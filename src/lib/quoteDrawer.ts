export const QUOTE_DRAWER_EVENT = "boxora:open-quote-drawer";

export type QuoteDrawerPayload = {
  /** Optional hint where user clicked from (navbar, faq, product, etc.) */
  source?: string;
  /** Optional product context */
  productSlug?: string;
  productName?: string;
};

export function openQuoteDrawer(payload: QuoteDrawerPayload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(QUOTE_DRAWER_EVENT, { detail: payload }));
}

