import { ORDER_STAGES } from "@/lib/orderTracking";

const input =
  "w-full min-h-[44px] rounded-xl border border-border bg-white px-4 py-2.5 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-bold text-dark">
        {label} {hint && <span className="font-normal text-lighter">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Labelled tracking inputs shared by the Orders page and the quote detail page (place inside a grid form). */
export default function TrackingFields({
  order,
}: {
  order: { orderStage: string | null; estimatedDelivery: Date | null; carrier: string | null; trackingNumber: string | null; trackingUrl: string | null };
}) {
  return (
    <>
      <Field label="Order stage" hint="what the customer sees">
        <select name="stage" defaultValue={order.orderStage ?? ""} className={input}>
          <option value="">Turn tracking off</option>
          {ORDER_STAGES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </Field>
      <Field label="Estimated delivery date">
        <input type="date" name="estimatedDelivery" min="2020-01-01" max="2100-12-31" defaultValue={order.estimatedDelivery?.toISOString().slice(0, 10) ?? ""} className={input} />
      </Field>
      <Field label="Carrier" hint="e.g. DHL, FedEx, UPS">
        <input name="carrier" defaultValue={order.carrier ?? ""} placeholder="Carrier name" className={input} />
      </Field>
      <Field label="Tracking number">
        <input name="trackingNumber" defaultValue={order.trackingNumber ?? ""} placeholder="Carrier tracking number" className={input} />
      </Field>
      <Field label="Carrier tracking link" hint="optional, must start with https://" wide>
        <input type="url" name="trackingUrl" defaultValue={order.trackingUrl ?? ""} placeholder="https://www.dhl.com/track?id=…" className={input} />
      </Field>
      <Field label="Note for the customer" hint="optional, appears in their updates" wide>
        <textarea name="message" rows={2} placeholder="e.g. Your order has left our facility and will arrive in 3–4 days." className={input} />
      </Field>
    </>
  );
}
