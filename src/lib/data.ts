import { images } from "./images";

export const topBar = {
  tagline: "Enterprise packaging solutions for modern brands worldwide.",
  email: "support@boxora.com",
  phone: "+1834 123 456 789",
  helpText: "Need help? Call Us:",
  quoteHref: "#quote",
  quoteLabel: "Get Free Quote",
};

export const navLeft = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "INDUSTRIES",
    href: "#",
    megamenu: "industries" as const,
  },
  {
    label: "PACKAGING STYLES",
    href: "#packaging-styles",
    megamenu: "packaging-styles" as const,
    children: [
      "Shop - Sidebar",
      "Shop - List View",
      "Shop - Top Filter",
      "Shop - Category 01",
    ],
  },
];

export const navRight = [
  {
    label: "TRENDS",
    href: "#",
    megamenu: "trends" as const,
  },
  { label: "BLOG", href: "/blog" },
  {
    label: "ABOUT US",
    href: "#",
    children: ["About Us", "FAQ", "Our Team", "Contact"],
  },
];

/** @deprecated use navLeft + navRight */
export const navLinks = [...navLeft, ...navRight];

export const industriesMegamenu = {
  categories: [
    {
      name: "Custom Coffee Bags",
      sub: "Stylish eco-friendly paper bags",
      image: images.megamenuCategories[0],
      href: "/category/custom-coffee-bags",
    },
    {
      name: "Pet Treat packaging",
      sub: "Quality manufacturing services",
      image: images.megamenuCategories[5],
      href: "/category/pet-treat-packaging",
    },
    {
      name: "Food packaging",
      sub: "High-quality custom printed",
      image: images.megamenuCategories[1],
      href: "/category/food-packaging",
    },
    {
      name: "Water & Juice",
      sub: "Custom professional printing",
      image: images.megamenuCategories[6],
      href: "/category/water-and-juice",
    },
    {
      name: "Coffee cups",
      sub: "Eco-friendly paper coffee cups",
      image: images.megamenuCategories[2],
      href: "/category/coffee-cups",
    },
    {
      name: "Wine Pouch",
      sub: "High quality wine paper bag",
      image: images.megamenuCategories[7],
      href: "/category/wine-pouch",
    },
    {
      name: "Stock packaging",
      sub: "Produced very inexpensively",
      image: images.megamenuCategories[3],
      href: "/category/stock-packaging",
    },
    {
      name: "Flexible pouches",
      sub: "Flexible food pouches",
      image: images.megamenuCategories[8],
      href: "/category/flexible-pouches",
    },
    {
      name: "Tea packaging",
      sub: "Fully customizable in size",
      image: images.megamenuCategories[4],
      href: "/category/tea-packaging",
    },
    {
      name: "Cosmetic Packaging",
      sub: "Strategic for your cosmetics line",
      image: images.megamenuCategories[9],
      href: "/category/cosmetic-packaging",
    },
  ],
  banners: [
    {
      title: "15% Discount",
      description: "On all mailer boxes orders of 500 pieces or more.",
      image: images.headerBanners[0],
      href: "#",
    },
    {
      title: "Custom packaging, simplified",
      description: "",
      image: images.headerBanners[1],
      href: "#",
    },
  ],
};

export const trendsMegamenu = {
  title: "2024–2025 Packaging Trends",
  items: [
    {
      title: "Minimalist Packaging",
      description:
        "Clean, eco-forward designs with simplified typography and premium whitespace — ideal for modern D2C brands.",
      image: images.megamenuCategories[3],
      href: "#",
    },
    {
      title: "Eco‑Luxury Packaging",
      description:
        "Sustainable materials paired with elevated finishes — soft-touch, foil, and texture without extra waste.",
      image: images.megamenuCategories[7],
      href: "#",
    },
    {
      title: "Subscription Boxes",
      description:
        "Recurring delivery packaging built for durability, brand storytelling, and share-worthy unboxing moments.",
      image: images.megamenuCategories[1],
      href: "#",
    },
  ],
  cta: {
    title: "Get Help With Expert Guidance",
    description:
      "Need help finding the perfect packaging? Contact us now for a free consultation with our packaging specialist.",
    phoneLabel: "Call Us Toll Free",
    phone: "1-800-726-9660",
    buttonLabel: "Get Free Quote",
    buttonHref: "#quote",
  },
  viewAll: {
    label: "View All Trends",
    href: "#",
  },
};

export const heroContent = {
  badge: "#1 PRINTING SERVICES NYC",
  titleLine1: "We are your best solution for",
  titleLine2: "Product Packaging",
  subtitle: "Packaging is the first impression your brand makes on a customer.",
  tags: [
    { label: "FOOD PACKAGING", bg: "#b8dcff", color: "#1a4a8a", rotate: -4 },
    { label: "COFFEE CUPS", bg: "#ffc8eb", color: "#8a1a5c", rotate: 3 },
    { label: "STOCK PACKAGING", bg: "#c8f5d0", color: "#1a6a32", rotate: -2 },
    { label: "WATER & JUICE", bg: "#fff3b0", color: "#7a5c00", rotate: 5 },
    { label: "TEA PACKAGING", bg: "#ffd4a8", color: "#8a4200", rotate: -3 },
    { label: "FLEXIBLE POUCHES", bg: "#e0c8ff", color: "#4a1a8a", rotate: 2 },
  ],
};

export const marqueeItems = [
  "Icons",
  "Vibrant printed colors",
  "Made for sustainability",
  "Sturdy and rigid packaging",
  "Paper-based, plant-based, waste-based",
  "100% Recyclable & compostable",
  "Fast and free standard shipping",
];

export const packagingStyles = [
  {
    title: "Stand-Up Pouches",
    description:
      "Shelf-ready flexible packaging engineered for food, beverage, and consumer goods with superior barrier performance.",
    image: images.packagingStyles[0],
    specs: ["Food Safe", "Custom Print", "MOQ 500"],
    href: "#",
  },
  {
    title: "Flat Bottom Bags",
    description:
      "Premium retail presentation with reinforced base structure for stability, visibility, and high-speed filling lines.",
    image: images.packagingStyles[1],
    specs: ["Retail Ready", "High Barrier", "Eco Options"],
    href: "#",
  },
  {
    title: "Side Gusset Bags",
    description:
      "Expandable-volume packaging ideal for coffee, tea, grains, and specialty products requiring extended shelf life.",
    image: images.packagingStyles[2],
    specs: ["Degassing Valve", "Foil Lined", "Bulk Volume"],
    href: "#",
  },
  {
    title: "Custom Mailer Boxes",
    description:
      "Branded unboxing experiences built for e-commerce durability, product protection, and consistent brand recall.",
    image: images.packagingStyles[3],
    specs: ["E-Commerce", "Rigid Build", "Full Color"],
    href: "#",
  },
  {
    title: "Roll Stock Film",
    description:
      "High-performance flexible film for automated packaging lines — precision printing with minimal material waste.",
    image: images.packagingStyles[4],
    specs: ["Automated Fill", "Wide Web", "Short Runs"],
    href: "#",
  },
  {
    title: "Zipper Pouches",
    description:
      "Resealable consumer convenience with tamper-evident options for snacks, supplements, and multi-use products.",
    image: images.packagingStyles[5],
    specs: ["Resealable", "Child Resistant", "Clear Window"],
    href: "#",
  },
  {
    title: "Rigid Setup Boxes",
    description:
      "Luxury rigid packaging for premium retail, corporate gifting, and high-value product launches worldwide.",
    image: images.packagingStyles[6],
    specs: ["Luxury Finish", "Magnetic Close", "Emboss / Foil"],
    href: "#",
  },
  {
    title: "Paper-Based Packaging",
    description:
      "Sustainable, compostable paper solutions aligned with enterprise ESG goals and plastic-reduction mandates.",
    image: images.packagingStyles[7],
    specs: ["Compostable", "FSC Certified", "Plastic Free"],
    href: "#",
  },
  {
    title: "Spout Pouches",
    description:
      "Convenient, spill-resistant packaging ideal for liquids, sauces, concentrates, and refill products.",
    image: images.packagingStyles[5],
    specs: ["Spill Proof", "Custom Fitments", "High Barrier"],
    href: "#",
  },
  {
    title: "Window Pouches",
    description:
      "Showcase your product with a clear window — great for snacks, coffee, and retail-ready shelf appeal.",
    image: images.packagingStyles[0],
    specs: ["Clear Window", "Shelf Ready", "Custom Print"],
    href: "#",
  },
];

export const packagingStylesMegamenu = {
  styles: packagingStyles,
  banners: [
    {
      title: "Premium packaging for modern brands",
      description: "Explore finishes, materials, and fast turnaround options.",
      image: images.headerBanners[0],
      href: "#packaging-styles",
    },
    {
      title: "Sustainable options, same quality",
      description: "Compostable and FSC-certified packaging styles available.",
      image: images.headerBanners[1],
      href: "#packaging-styles",
    },
  ],
};

export const categories = [
  { name: "Custom Coffee Bags", count: 2, image: images.categories[0], sub: "Stylish eco-friendly paper bags" },
  { name: "Food packaging", count: 1, image: images.categories[1], sub: "Fresh food safe packaging" },
  { name: "Coffee cups", count: 3, image: images.categories[2], sub: "Eco-friendly paper coffee cups" },
  { name: "Stock packaging", count: 4, image: images.categories[3], sub: "Ready stock solutions" },
  { name: "Tea packaging", count: 2, image: images.categories[4], sub: "Preserve aroma and freshness" },
  { name: "Flexible pouches", count: 5, image: images.categories[5], sub: "Flexible food pouches" },
  { name: "Water & Juice", count: 3, image: images.categories[6], sub: "Leak-proof beverage pouches" },
  { name: "Pet Treat packaging", count: 3, image: images.categories[7], sub: "Quality manufacturing services" },
  { name: "Wine Pouch", count: 2, image: images.categories[8], sub: "High quality wine paper bag" },
  { name: "Cosmetic Packaging", count: 4, image: images.categories[9], sub: "Strategic for your cosmetics line" },
];

export const services = [
  {
    title: "Structural Engineering",
    description:
      "Our packaging experts design and engineer innovative structures tailored to your product and branding.",
    bullets: [
      "Consultation Packaging Strategy",
      "Structural Engineering",
      "Packaging & Artwork Design",
    ],
    image: images.services[0],
  },
  {
    title: "Digital Printing",
    description:
      "Custom printed packages help attract the attention of customers, tell them everything they need to know about your brand with a single glance.",
    image: images.services[1],
  },
  {
    title: "Custom Printed Bags",
    description:
      "Packaging is an incredibly important identity asset, which can have enormous brand building capabilities. Make it unique with a customised design.",
    image: images.services[2],
  },
  {
    title: "Custom Mailer Box",
    description:
      "Our custom coffee mailer boxes are the perfect solution to engage customers and protect your roasted coffee during shipping.",
    image: images.services[3],
  },
  {
    title: "Custom Roll Stock",
    description:
      "Our fully customisable roll stock features high-quality images and a design that keeps even the smallest details crisp and crystal clear.",
    image: images.services[4],
  },
  {
    title: "Samples & Prototyping",
    description:
      "Create physical samples and 3D interactive prototypes final product packaging before making a final decision.",
    bullets: [
      "Smart material applications",
      "Structure and size validation",
      "Stringent proofing & color matching",
    ],
    image: images.services[5],
  },
];

export const featuresSection = {
  label: "Why Boxora.",
  title: "Why brands choose us for custom packaging",
  description:
    "From short runs to enterprise-scale production — we combine premium quality, fast turnaround, and transparent pricing so your packaging works as hard as your brand.",
};

export const features = [
  {
    title: "No Setup or Die Charge",
    description:
      "Launch custom packaging without upfront tooling or die-cut fees on qualifying orders.",
    icon: "banknote",
  },
  {
    title: "Top Quality Custom Made Boxes",
    description:
      "Precision-crafted boxes built to your exact specifications with premium materials.",
    icon: "target",
  },
  {
    title: "Short Run Custom Box Printing",
    description:
      "Flexible minimums for startups, product pilots, and seasonal packaging runs.",
    icon: "calculator",
  },
  {
    title: "Free Designing, Low Pricing",
    description:
      "Expert design support included with competitive, transparent enterprise pricing.",
    icon: "paintbrush",
  },
  {
    title: "One Week Production",
    description:
      "Fast turnaround from final approval to production without compromising quality.",
    icon: "calendar",
  },
  {
    title: "Free Shipping & Handling",
    description:
      "Complimentary shipping and handling on eligible standard orders nationwide.",
    icon: "truck",
  },
];

export type Product = {
  slug: string;
  name: string;
  description: string;
  category?: string;
  price?: number;
  salePrice?: number;
  discount?: string;
  rating: number;
  reviews: number;
  image: string;
  onSale?: boolean;
  hot?: boolean;
  action?: string;
};

export const products = [
  {
    slug: "water-juice-packaging",
    name: "Water & juice Packaging",
    description:
      "High-quality custom packaging solution designed to meet your specific needs.",
    category: "Cosmetic Packaging, Water & Juice",
    price: 19.67,
    rating: 3.33,
    reviews: 3,
    image: images.products[0],
    action: "Read more",
  },
  {
    slug: "baby-food-bags",
    name: "Baby food bags",
    description:
      "Safe, food-grade pouches designed for baby food with easy-open features and premium barrier protection.",
    category: "Cosmetic Packaging",
    price: 22.5,
    salePrice: 19.58,
    discount: "-13%",
    rating: 3.33,
    reviews: 3,
    image: images.products[1],
    onSale: true,
  },
  {
    slug: "taco-meat-vegetables",
    name: "Taco with meat and vegetables",
    description:
      "Durable food packaging built for fresh meals, retail display, and reliable shelf presentation.",
    category: "Pet Treat packaging",
    price: 13.0,
    rating: 4.0,
    reviews: 3,
    image: images.products[2],
  },
  {
    slug: "pet-food-packaging",
    name: "Pet food packaging",
    description:
      "Barrier pouches and boxes tailored for pet treats with strong seals and vibrant print-ready surfaces.",
    category: "Stock packaging, Wine Pouch",
    price: 100.65,
    rating: 4.0,
    reviews: 3,
    image: images.products[3],
  },
  {
    slug: "gourmet-beef-sosaties",
    name: "Gourmet Beef Sosaties Per kg",
    description:
      "Premium retail packaging for gourmet food products with a polished, brand-forward finish.",
    category: "Cosmetic Packaging",
    price: 215.2,
    rating: 3.0,
    reviews: 3,
    image: images.products[4],
  },
  {
    slug: "frozen-angelfish",
    name: "Frozen Angelfish Per kg",
    description:
      "Freezer-safe packaging engineered for cold-chain products and consistent retail presentation.",
    category: "Custom Coffee Bags",
    price: 11.81,
    rating: 4.33,
    reviews: 3,
    image: images.products[5],
  },
  {
    slug: "thinly-sliced-beef-brisket",
    name: "Thinly Sliced Beef Brisket",
    description:
      "Custom food packaging with strong shelf appeal, ideal for deli and specialty meat products.",
    category: "Coffee cups",
    price: 45.0,
    salePrice: 29.25,
    discount: "-35%",
    rating: 4.0,
    reviews: 3,
    image: images.products[6],
    onSale: true,
  },
  {
    slug: "ziplock-plastic-green-tea",
    name: "Ziplock plastic green tea",
    description:
      "Resealable tea pouches with barrier film options for freshness, aroma retention, and retail display.",
    category: "Custom Coffee Bags",
    price: 17.65,
    rating: 3.67,
    reviews: 3,
    image: images.products[7],
  },
  {
    slug: "wrapped-red-cabbage",
    name: "Wrapped Red Cabbage",
    description:
      "Flexible produce packaging designed for freshness, visibility, and efficient in-store merchandising.",
    category: "Food packaging",
    price: 24.0,
    salePrice: 21.36,
    discount: "-11%",
    rating: 4.33,
    reviews: 3,
    image: images.products[8],
    onSale: true,
    action: "Select options",
  },
  {
    slug: "sweetcorn-4-pack",
    name: "Sweetcorn 4 Pack",
    description:
      "Multi-pack food packaging with strong structure and print-ready panels for retail branding.",
    category: "Pet Treat packaging",
    price: 16.88,
    rating: 4.33,
    reviews: 3,
    image: images.products[9],
    hot: true,
  },
] as const satisfies readonly Product[];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductHref(slug: string) {
  return `/products/${slug}`;
}

export function getRelatedProducts(slug: string, limit = 4) {
  const current = products.find((product) => product.slug === slug);
  const others = products.filter((product) => product.slug !== slug);

  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter((product) => product.category === current.category);
  const differentCategory = others.filter((product) => product.category !== current.category);
  const ordered = [...sameCategory, ...differentCategory];

  return ordered.slice(0, limit);
}

export const testimonials = [
  {
    title: "Great quality of products",
    text: "Great products, attention to detail, service and quality. The variety of products and variances of products offered is pretty big as well so you will definitely be able to find the right product for you!",
    name: "Christopher Feran",
    role: "Assistant Manager",
    image: images.testimonials[0],
  },
  {
    title: "Great quality of products",
    text: "Great expertise, innovation and quality focused. The team at Bocpak are really supportive and efficient, providing excellent solutions and quality packaging.",
    name: "Rabea Holzfurtner",
    role: "Assistant Manager",
    image: images.testimonials[1],
  },
  {
    title: "High-quality products",
    text: "High-quality products, accurate production timelines, clear expectations. We've had great experiences working with Bocpak and recommend them for custom packaging needs.",
    name: "Allie Stauss",
    role: "Co-General Manager",
    image: images.testimonials[2],
  },
  {
    title: "Good quality materials & high…",
    text: "I worked with Stella for our new packaging and she was incredibly helpful! Samples of the packaging came really fast and the process was overall seamless.",
    name: "Daniel H",
    role: "Co-General Manager",
    image: images.testimonials[3],
  },
  {
    title: "Amazing products and content",
    text: "Amazing products and content on the entire coffee value chain. looking forward to doing healthy and profitable business with you. Do u make Jutebags?",
    name: "Tonny Butera",
    role: "Co-General Manager",
    image: images.testimonials[4],
  },
  {
    title: "Amazing products and content",
    text: "Amazing products and content on the entire coffee value chain. looking forward to doing healthy and profitable business with you.",
    name: "Aaron Probert",
    role: "Co-General Manager",
    image: images.testimonials[5],
  },
];

export const businessBenefits = [
  "Consistently high-quality products",
  "Speed to market, including rush orders and short runs.",
  "Unique product offerings for niche markets",
  "Eco-friendly packaging for food products, including compostable bags and films",
  "Quick response without jet lag",
];

export const footerLinks = {
  shop: ["All Products", "Categories", "My account", "Wishlist", "Compare"],
  company: ["About Us", "Our Services", "Contact Us", "Blog"],
  support: ["FAQ", "Shipping & Delivery", "Returns", "Privacy Policy"],
};

export const quoteForm = {
  productTypes: [
    "Stand-Up Pouches",
    "Flat Bottom Bags",
    "Side Gusset Bags",
    "Custom Mailer Boxes",
    "Roll Stock Film",
    "Zipper Pouches",
    "Rigid Setup Boxes",
    "Paper-Based Packaging",
    "Coffee Bags",
    "Food Packaging",
    "Other",
  ],
  quantityRanges: [
    "100 – 500 units",
    "500 – 1,000 units",
    "1,000 – 5,000 units",
    "5,000 – 10,000 units",
    "10,000+ units",
    "Not sure yet",
  ],
  highlights: [
    "Response within 24 business hours",
    "No setup or die charges on qualifying orders",
    "Dedicated packaging specialist assigned",
  ],
};

export const faqs = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "Minimums vary by packaging style and material. Many flexible formats start from 500 units, while custom boxes and rigid packaging may require higher volumes. Contact us with your specs for an exact MOQ.",
  },
  {
    question: "Do you charge setup or die fees?",
    answer:
      "We offer no setup or die charges on qualifying orders. Our team will confirm eligibility based on your product type, artwork, and production run size before you commit.",
  },
  {
    question: "How long does production take?",
    answer:
      "Standard production typically completes within one week after final artwork approval. Rush timelines and short runs are available for time-sensitive launches — your specialist will outline options in your quote.",
  },
  {
    question: "Can I request samples before a bulk order?",
    answer:
      "Yes. We provide physical samples and prototyping so you can validate structure, materials, and print quality before full production. Sample turnaround depends on complexity and stock availability.",
  },
  {
    question: "What packaging materials do you offer?",
    answer:
      "We supply a wide range of materials including kraft, coated paper, flexible films, foil laminates, and rigid board — selected for your product's barrier, shelf-life, and branding requirements.",
  },
  {
    question: "Do you offer eco-friendly packaging options?",
    answer:
      "Absolutely. We provide compostable, recyclable, and plastic-free solutions including paper-based pouches, plant-based films, and FSC-certified materials to support your sustainability goals.",
  },
  {
    question: "Can you help with custom design and artwork?",
    answer:
      "Our in-house design team offers free design support with competitive pricing. We assist with dielines, brand artwork, color matching, and print-ready files to ensure production-ready results.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes. We deliver worldwide with reliable logistics partners. Free shipping and handling apply on eligible standard domestic orders; international rates and timelines are provided in your custom quote.",
  },
];
