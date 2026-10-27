import { prisma } from "@/lib/db";
import { notifyOwner } from "@/lib/leads/mailer";
import { allow, clientIp } from "@/lib/leads/rateLimit";
import { MAX_FILES, saveUpload, validateUpload, type StoredFile } from "@/lib/leads/storage";
import { makeQuoteRef } from "@/lib/packagingEstimator";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function text(form: FormData, key: string, max: number) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function num(form: FormData, key: string, min: number, max: number) {
  const raw = text(form, key, 24);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!allow(`leads:${ip}`, 12, 60 * 60 * 1000)) {
    return fail("Too many requests. Please try again later.", 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail("Invalid request.");
  }

  // Bots post instantly; people need a few seconds. (No hidden inputs: browser autofill fills those and
  // would silently discard real requests.) Older pages that don't send the timer are allowed through.
  const elapsed = Number(text(form, "elapsed", 12));
  if (Number.isFinite(elapsed) && text(form, "elapsed", 12) !== "" && elapsed < 1500) {
    return fail("That was a little quick. Please try again.");
  }

  const type = text(form, "type", 20);

  // ───── Newsletter ─────
  if (type === "newsletter") {
    const email = text(form, "email", 200).toLowerCase();
    if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.");
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: text(form, "source", 60) || null },
    });
    return NextResponse.json({ ok: true });
  }

  const name = text(form, "name", 120);
  const email = text(form, "email", 200).toLowerCase();
  if (!name) return fail("Please enter your name.");
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.");

  // ───── Contact message ─────
  if (type === "contact") {
    const message = text(form, "message", 5000);
    if (message.length < 3) return fail("Please write a message.");
    const phone = text(form, "phone", 40);
    const topic = text(form, "topic", 80);
    await prisma.contactMessage.create({
      data: { name, email, phone: phone || null, topic: topic || null, message },
    });
    await notifyOwner({
      subject: `New message from ${name}${topic ? ` (${topic})` : ""}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nTopic: ${topic || "-"}\n\n${message}`,
      replyTo: email,
    });
    return NextResponse.json({ ok: true });
  }

  // ───── Quote / product order ─────
  if (type !== "quote" && type !== "order") return fail("Unknown request type.");

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return fail(`You can attach up to ${MAX_FILES} files.`);
  for (const f of files) {
    const problem = validateUpload(f);
    if (problem) return fail(problem);
  }

  const stored: StoredFile[] = [];
  for (const f of files) stored.push(await saveUpload(f));

  const productName = text(form, "productName", 160);
  const productSlug = text(form, "productSlug", 160);
  const industry = text(form, "industry", 120);
  const quantity = num(form, "quantity", 1, 10_000_000);
  const dimensions = {
    length: num(form, "length", 0, 1000),
    width: num(form, "width", 0, 1000),
    height: num(form, "height", 0, 1000),
    weight: num(form, "weight", 0, 100_000),
  };
  const details = {
    textOnBox: text(form, "brandText", 40) || null,
    neededBy: text(form, "neededBy", 30) || null,
    shipTo: text(form, "shipTo", 200) || null,
    zip: text(form, "zip", 20) || null,
    unit: text(form, "unit", 20) || null,
    material: text(form, "material", 60) || null,
    color: text(form, "color", 60) || null,
    finish: text(form, "finish", 60) || null,
    boxType: text(form, "boxType", 120) || null,
    moq: text(form, "moq", 20) || null,
    risk: text(form, "risk", 40) || null,
    requestType: type,
  };
  const phone = text(form, "phone", 40);
  // Product page quote form: phone and quantity are required there.
  if (text(form, "source", 60).startsWith("product:")) {
    if (!phone) return fail("Please enter your phone number.");
    if (!quantity) return fail("Please enter a quantity.");
  }
  const company = text(form, "company", 120);
  const notes = text(form, "notes", 4000);

  let reference = makeQuoteRef();
  let created: { id: string } | null = null;
  for (let attempt = 0; attempt < 4 && !created; attempt++) {
    try {
      created = await prisma.quoteRequest.create({
        data: {
          reference,
          name,
          email,
          phone: phone || null,
          company: company || null,
          notes: notes || null,
          source: text(form, "source", 60) || null,
          details,
          attachments: stored.length ? stored : undefined,
          items: {
            create: [
              {
                productName: productName || industry || null,
                productSlug: productSlug || null,
                quantity,
                finishId: details.finish,
                dimensions,
                industry: industry || null,
                estimator: details.boxType ? { boxType: details.boxType } : undefined,
              },
            ],
          },
        },
        select: { id: true },
      });
    } catch (error) {
      // Reference collision (unique) is the only expected failure; retry with a new one.
      if (attempt === 3) {
        console.error("[leads] Could not save quote:", error);
        return fail("Something went wrong saving your request. Please try again.", 500);
      }
      reference = makeQuoteRef();
    }
  }

  const dims = [dimensions.length, dimensions.width, dimensions.height].every((d) => d != null)
    ? `${dimensions.length} x ${dimensions.width} x ${dimensions.height} ${details.unit ?? "in"}`
    : "-";
  await notifyOwner({
    subject: `New ${type === "order" ? "order request" : "quote request"} ${reference} from ${name}`,
    text: [
      `Reference: ${reference}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      `Company: ${company || "-"}`,
      `Product: ${productName || industry || "-"}`,
      `Box type: ${details.boxType ?? "-"}`,
      `Size: ${dims}`,
      `Quantity: ${quantity ?? "-"}`,
      `Finish: ${details.finish ?? "-"}`,
      `Text on box: ${details.textOnBox ?? "-"}`,
      `Needed by: ${details.neededBy ?? "-"}`,
      `Ship to: ${details.shipTo ?? "-"}`,
      `Zip code: ${details.zip ?? "-"}`,
      `Files: ${stored.length ? stored.map((f) => f.name).join(", ") : "none"}`,
      "",
      notes || "(no notes)",
      "",
      "Open the admin panel > Quote requests to view files and update the status.",
    ].join("\n"),
    replyTo: email,
  });

  return NextResponse.json({ ok: true, reference });
}
