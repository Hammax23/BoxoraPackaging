import { revalidatePath } from "next/cache";

export function revalidatePublicContent() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/blog");
  revalidatePath("/products", "layout");
  revalidatePath("/blog", "layout");
}
