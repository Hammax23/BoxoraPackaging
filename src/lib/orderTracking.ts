/** Order stages in order. Stored as `QuoteRequest.orderStage` (null = not an order yet). */
export const ORDER_STAGES = [
  { key: "RECEIVED", label: "Order received", hint: "We have your order and are getting started." },
  { key: "DESIGN", label: "Design & proof", hint: "Your artwork and proof are being prepared and approved." },
  { key: "PRODUCTION", label: "In production", hint: "Your packaging is being printed and made." },
  { key: "QUALITY", label: "Quality check", hint: "Your order is being inspected and packed." },
  { key: "SHIPPED", label: "Shipped", hint: "Your order is on its way." },
  { key: "DELIVERED", label: "Delivered", hint: "Your order has been delivered." },
] as const;

export type OrderStageKey = (typeof ORDER_STAGES)[number]["key"];

export const stageIndex = (key: string | null | undefined) => ORDER_STAGES.findIndex((s) => s.key === key);

/** Only http(s) links are accepted for carrier tracking URLs. */
export const safeUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : null);
