const BASE = "https://demo2.themelexus.com/bocpak/wp-content/uploads";

export const img = (path: string) => `${BASE}/${path}`;

const product = (n: number) => img(`2024/05/product-${n}-1-460x460.jpg`);

export const images = {
  logo: "/logo/logo.png",
  logoDark: "/logo/logo.png",
  payment: img("2024/05/payment.png"),
  menuDiscount: img("2024/05/menu-discount.png"),
  headerBanners: [
    img("2024/05/banner-megamenu-1.jpg"),
    img("2024/05/banner-megamenu-2.jpg"),
  ],
  megamenuCategories: Array.from({ length: 10 }, (_, i) =>
    img(`2024/05/megamenu-categories-${i + 1}.jpg`),
  ),
  hero: {
    bg: img("2024/05/h1-slider1.png"),
    floatLeft: [
      img("2024/05/h1-slider1-l1.jpg"),
      img("2024/05/h1-slider1-l2.jpg"),
      img("2024/05/h1-slider1-l3.jpg"),
      img("2024/05/h1-slider1-l4.jpg"),
    ],
    floatRight: [
      img("2024/05/h1-slider1-r1.jpg"),
      img("2024/05/h1-slider1-r2.jpg"),
      img("2024/05/h1-slider1-r3.jpg"),
      img("2024/05/h1-slider1-r4.jpg"),
    ],
  },
  categories: [
    ...Array.from({ length: 8 }, (_, i) =>
      img(`2024/05/cat-${String(i + 1).padStart(2, "0")}.jpg`),
    ),
    img("2024/05/megamenu-categories-8.jpg"),
    img("2024/05/megamenu-categories-10.jpg"),
  ],
  services: [
    img("2024/05/megamenu-1.jpg"),
    img("2024/05/megamenu-2.jpg"),
    img("2024/05/megamenu-3.jpg"),
    img("2024/05/megamenu-4.jpg"),
    img("2024/05/megamenu-5.jpg"),
    img("2024/05/megamenu-categories-1.jpg"),
  ],
  packagingStyles: [
    img("2024/05/megamenu-1.jpg"),
    img("2024/05/megamenu-2.jpg"),
    img("2024/05/megamenu-3.jpg"),
    img("2024/05/megamenu-4.jpg"),
    img("2024/05/megamenu-5.jpg"),
    img("2024/05/megamenu-categories-2.jpg"),
    img("2024/05/megamenu-categories-3.jpg"),
    img("2024/05/megamenu-categories-4.jpg"),
  ],
  ecoBanner: img("2024/05/h1-banner09.jpg"),
  specialOffer: img("2024/05/h1-banner10.jpg"),
  goGreen: img("2024/05/h1-banner09.jpg"),
  products: [
    product(19),
    product(18),
    product(17),
    product(16),
    product(15),
    product(14),
    product(13),
    product(12),
    product(11),
    product(20),
  ],
  testimonials: [
    img("2024/05/review-01.jpg"),
    img("2024/05/review-02.jpg"),
    img("2024/05/review-03.jpg"),
    img("2024/05/review-04.jpg"),
    img("2024/05/review-05.jpg"),
    img("2024/05/review-06.jpg"),
  ],
};
