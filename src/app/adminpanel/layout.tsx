import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Panel",
  description: "Boxora admin panel",
  path: "/adminpanel",
  noIndex: true,
});

export default function AdminPanelRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
