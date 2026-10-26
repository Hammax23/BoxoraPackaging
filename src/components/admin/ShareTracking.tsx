import CopyButton from "@/components/admin/CopyButton";
import { absoluteUrl } from "@/lib/seo";
import { Mail } from "lucide-react";

/** Copy/email the customer's tracking link. The link carries only the reference; the customer still types their email. */
export default function ShareTracking({ reference, name, email }: { reference: string; name: string; email: string }) {
  const url = absoluteUrl(`/track?ref=${encodeURIComponent(reference)}`);
  const message = `Hi ${name},\n\nYou can follow your order ${reference} here: ${url}\n\nEnter your reference and the email you ordered with (${email}) to see its progress.\n\nThank you!`;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton value={url} label="Copy tracking link" />
      <CopyButton value={message} label="Copy message" />
      <a
        href={`mailto:${email}?subject=${encodeURIComponent(`Track your Boxora order ${reference}`)}&body=${encodeURIComponent(message)}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-bold text-dark transition hover:border-primary hover:text-primary"
      >
        <Mail className="h-3.5 w-3.5" /> Email link
      </a>
    </div>
  );
}
