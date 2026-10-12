import { revalidatePath } from "next/cache";

export function revalidatePublicContent() {
  // Root layout feeds the header (industries megamenu) on every page
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/blog");
  revalidatePath("/products", "layout");
  revalidatePath("/blog", "layout");
}
