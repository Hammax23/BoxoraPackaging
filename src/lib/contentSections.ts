import { businessBenefits, features, industriesMegamenu, packagingStylesMegamenu, trendsMegamenu, packagingStyleDetails, packagingStyles, packagingTrends } from "@/lib/data";
import { images } from "@/lib/images";

/**
 * Page content that used to live in code. Each section is editable in Admin → Page content and stored in
 * SiteSetting as `content:<key>`; the defaults below are used until an admin saves a change.
 */
export type ContentSection = {
  key: string;
  label: string;
  hint: string;
  defaults: unknown[] | Record<string, unknown>;
  /** Field name → allowed values (rendered as a dropdown). */
  selects?: Record<string, string[]>;
};

export const ABOUT_ICONS = ["Gem", "Leaf", "Palette", "Rocket", "Handshake", "ShieldCheck"];
export const TEAM_ICONS = ["Headset", "Ruler", "Palette", "Printer", "PackageCheck", "Leaf", "Truck", "Boxes"];
export const FEATURE_ICONS = ["banknote", "target", "calculator", "paintbrush", "calendar", "truck", "leaf", "headset"];

export const contentSections: ContentSection[] = [
  {
    key: "styles",
    label: "Packaging styles",
    hint: "Home slider, /styles, each style page, search and sitemap. Slug is the page URL; href should be /styles/<slug>.",
    defaults: packagingStyles.map((s) => ({ ...s, ...packagingStyleDetails[s.slug] })),
  },
  {
    key: "trends",
    label: "Packaging trends",
    hint: "/trends and each trend page. Styles lists style slugs that suit the trend.",
    defaults: packagingTrends,
  },
  { key: "featureItems", label: "Home: why-choose-us cards", hint: "Cards beside the “Why Boxora” heading.", defaults: features, selects: { icon: FEATURE_ICONS } },
  {
    key: "menus",
    label: "Header menus: banners & help card",
    hint: "Promo banners in the Industries and Packaging Styles menus, and the title and help card in the Trends menu. The menu lists themselves come from Industries, Packaging styles and Packaging trends.",
    defaults: {
      industriesBanners: industriesMegamenu.banners.map(({ title, description, image, href }) => ({ title, description, image, href })),
      stylesBanners: packagingStylesMegamenu.banners.map(({ title, description, image, href }) => ({ title, description, image, href })),
      trendsTitle: trendsMegamenu.title,
      trendsViewAllLabel: trendsMegamenu.viewAll.label,
      trendsCta: trendsMegamenu.cta,
    },
  },
  {
    key: "policies",
    label: "Policy pages (Shipping, Returns, Privacy, Terms)",
    hint: "Each entry becomes a page at /policies/<slug>. Put each paragraph on its own line; a line starting with ## becomes a heading. These are generic starting texts: replace them with your real policies and have them reviewed before relying on them.",
    defaults: [
      {
        slug: "shipping-policy",
        title: "Shipping Policy",
        body: "## Production and delivery\nCustom packaging is made to order. Production time and delivery time are confirmed on your quote and order confirmation, and rush options may be available on request.\n\n## Shipping costs\nStandard shipping details, including any free-shipping offer, are shown on your quote. Orders that need special handling or faster delivery are quoted separately.\n\n## Tracking\nWe share tracking details as soon as your order ships. If you have not received them, contact us and we will help.\n\n## Delays and damage\nPlease inspect your delivery on arrival and contact us promptly if anything is damaged or missing so we can resolve it.",
      },
      {
        slug: "returns-policy",
        title: "Return & Refund Policy",
        body: "## Custom orders\nBecause packaging is printed and made specifically for you, custom orders are generally not returnable once production has started. You approve a proof before printing so details can be checked first.\n\n## Problems with your order\nIf your order arrives damaged, incorrect or does not match the approved proof, contact us promptly with photos and your order reference. We will review it and offer a fix, reprint or refund where appropriate.\n\n## Cancellations\nTo change or cancel an order, contact us as early as possible. Once production has begun we may not be able to cancel.",
      },
      {
        slug: "privacy-policy",
        title: "Privacy Policy",
        body: "## What we collect\nWhen you request a quote, send a message or subscribe to our newsletter, we collect the details you provide, such as your name, email, phone number, company and project information, plus any artwork files you upload.\n\n## How we use it\nWe use your information to respond to your enquiry, prepare quotes, produce and deliver your order, and, if you subscribe, send packaging news and offers. You can unsubscribe at any time.\n\n## Sharing\nWe do not sell your personal information. We only share it with service providers who help us run the website, send email or deliver orders.\n\n## Your choices\nYou can ask us to access, correct or delete your personal information by contacting us using the details on our Contact page.",
      },
      {
        slug: "terms-and-conditions",
        title: "Terms & Conditions",
        body: "## Quotes and orders\nQuotes are estimates based on the details you provide and may change if your specifications, quantity or artwork change. An order is confirmed once you approve the quote and proof.\n\n## Artwork and approvals\nYou are responsible for the content and rights of any artwork you supply and for checking the proof before approving it.\n\n## Liability\nOur responsibility for any order is limited to the value of that order, to the extent permitted by law.\n\n## Changes\nWe may update these terms from time to time. The version on this page applies to your order.",
      },
    ],
  },
  {
    key: "heroImages",
    label: "Home: hero images",
    hint: "The photo mosaic beside the hero text (4 images work best).",
    defaults: [
      { image: images.photo(19), alt: "Printed rigid box" },
      { image: images.photo(14), alt: "Kraft carry box" },
      { image: images.photo(18), alt: "Printed mailer box" },
      { image: images.photo(11), alt: "Stand-up pouch" },
    ],
  },
  {
    key: "heroChecklist",
    label: "Home: hero checklist",
    hint: "Short ticks under the hero paragraph.",
    defaults: [{ text: "Free Design Support" }, { text: "Custom Sizes & Styles" }, { text: "Fast Turnaround" }, { text: "Free Shipping" }],
  },
  {
    key: "homeStyles",
    label: "Home: packaging styles heading",
    hint: "Heading above the style cards. The highlight part is shown in the brand colour.",
    defaults: {
      title: "Packaging Can Make",
      highlight: "All The Difference",
      text: "Packaging is the first thing your customer sees. Make it beyond perfect with our custom packaging solutions.",
      button: "View all packaging styles",
    },
  },
  {
    key: "homeBrands",
    label: "Home: brands we've worked with",
    hint: "Add client logos. The section stays hidden until at least one logo is added.",
    defaults: {
      title: "Brands We've Worked With",
      text: "Businesses trust Boxora for custom printed packaging made around their products, branding and order needs.",
      logos: [{ name: "", logo: "" }],
    },
  },
  {
    key: "homeReviews",
    label: "Home: reviews heading",
    hint: "Reviews appear once “Show testimonials” is on (Admin → FAQs & reviews). Rating line is optional.",
    defaults: { title: "What Our", highlight: "Customers Say", rating: "", ratingLabel: "" },
  },
  {
    key: "homePortfolio",
    label: "Home: packaging work gallery",
    hint: "Photo grid of finished projects.",
    defaults: {
      title: "See Our",
      highlight: "Custom Packaging Work",
      text: "From retail boxes to food packaging, mailer boxes and premium packaging, every project is made around the customer's product and brand.",
      button: "View full portfolio",
      href: "/products",
      images: Array.from({ length: 8 }, (_, i) => ({ image: images.photo((i % 10) + 11), alt: "Custom packaging project" })),
    },
  },
  {
    key: "homeCta",
    label: "Home: call-to-action band",
    hint: "Dark banner before the benefits section.",
    defaults: {
      title: "Ready To Make Your Packaging",
      highlight: "Unforgettable?",
      text: "Get a free quote and a 3D mockup, with no commitment.",
      button: "Get a Free Quote",
    },
  },
  {
    key: "homeBenefits",
    label: "Home: key benefits",
    hint: "Text list with a photo collage (use up to 3 images).",
    defaults: {
      title: "Key Benefits of Custom Boxes for Your Business",
      intro: "Investing in custom packaging lifts your brand to the next level. You can enjoy:",
      items: [
        { label: "Brand Recognition", text: "Show your colours, logo and message so your products stand out instantly." },
        { label: "Product Safety", text: "Boxes designed to fit keep items secure and protected during shipping and handling." },
        { label: "Sustainable Choices", text: "Choose eco-friendly, recyclable materials that reduce waste and appeal to conscious customers." },
        { label: "Memorable Unboxing", text: "A creative box design turns opening your order into an experience customers remember." },
      ],
      images: [{ image: images.photo(16) }, { image: images.photo(12) }, { image: images.photo(15) }],
    },
  },
  {
    key: "homeFaq",
    label: "Home: FAQ heading",
    hint: "The questions themselves are managed in Admin → FAQs & reviews.",
    defaults: {
      title: "Frequently Asked Questions",
      text: "Get simple answers about custom packaging, printing, shipping and ordering.",
      image: images.photo(13),
    },
  },
  {
    key: "social",
    label: "Footer: social links",
    hint: "Icons in the footer. Label: Facebook, Instagram, X, LinkedIn, Pinterest or YouTube. Leave the link empty to hide it.",
    selects: { label: ["Facebook", "Instagram", "X", "LinkedIn", "Pinterest", "YouTube"] },
    defaults: [{ label: "Facebook", href: "" }, { label: "Instagram", href: "" }],
  },
  {
    key: "aboutStats",
    label: "About: stats",
    hint: "The numbers strip on /about.",
    defaults: [
      { value: "50+", label: "Customization options" },
      { value: "100%", label: "Recyclable & compostable materials" },
      { value: "Free", label: "Standard shipping" },
      { value: "Rush", label: "Orders & short runs welcome" },
    ],
  },
  {
    key: "aboutValues",
    label: "About: values",
    hint: "Value cards on /about.",
    selects: { icon: ABOUT_ICONS },
    defaults: [
      { icon: "Gem", title: "Quality first", text: "Sturdy structures, crisp printing and finishes that hold up from the production line to the customer's hands." },
      { icon: "Leaf", title: "Made to be sustainable", text: "Paper-based, plant-based and waste-based materials, so great packaging never costs the planet." },
      { icon: "Palette", title: "Your brand, front and center", text: "Every pouch and box is a canvas. We help your story read at a single glance on the shelf." },
      { icon: "Rocket", title: "Speed to market", text: "Short runs and rush orders for launches, seasonal drops and niche products, without the long waits." },
      { icon: "Handshake", title: "A real partner", text: "Quick responses, honest guidance and one point of contact from first sketch to final delivery." },
      { icon: "ShieldCheck", title: "Promise kept", text: "We guarantee the highest quality products and customer experience with every order." },
    ],
  },
  {
    key: "aboutSteps",
    label: "About: how it works",
    hint: "The four-step process on /about.",
    defaults: [
      { n: "01", title: "Tell us what you need", text: "Share your product, quantity and goals, or use our instant quote tool to get started in minutes." },
      { n: "02", title: "Design & proof", text: "Pick from 50+ options and approve a clear proof so nothing is left to guesswork." },
      { n: "03", title: "Print & craft", text: "Your packaging is printed in vibrant color on the materials you chose and carefully quality checked." },
      { n: "04", title: "Ship to your door", text: "Standard shipping is free, and rush options are there when your launch date is tight." },
    ],
  },
  { key: "aboutBenefits", label: "About: business benefits", hint: "Checklist on /about.", defaults: businessBenefits.map((text) => ({ text })) },
  {
    key: "teamCrew",
    label: "Team: crew cards",
    hint: "Add a name and photo to show a portrait instead of the icon. Accent is a Tailwind gradient like from-primary to-secondary.",
    selects: { icon: TEAM_ICONS },
    defaults: [
      { role: "Packaging Specialists", tagline: "Your point of contact", text: "One dedicated specialist guides you from first question to final delivery, recommending the right structure, materials and quantity.", icon: "Headset", accent: "from-primary to-[#d8e267]", name: "", photo: "" },
      { role: "Structural Designers", tagline: "Dielines & fit", text: "We engineer boxes and pouches around your product so it fits snugly, protects well and opens beautifully.", icon: "Ruler", accent: "from-[#a6dc00] to-primary", name: "", photo: "" },
      { role: "Artwork & Prepress", tagline: "Colors that pop", text: "Our prepress team checks every file, matches colors and sends a clear proof before anything goes to print.", icon: "Palette", accent: "from-secondary to-[#d8e267]", name: "", photo: "" },
      { role: "Print & Production", tagline: "Craft at scale", text: "Skilled operators run vivid printing and finishing on sturdy stock, from short runs to larger production orders.", icon: "Printer", accent: "from-primary to-secondary", name: "", photo: "" },
      { role: "Quality Control", tagline: "Every unit counts", text: "Each order is inspected for color, structure and finish, so what arrives matches what you approved.", icon: "PackageCheck", accent: "from-[#14b8a6] to-primary", name: "", photo: "" },
      { role: "Sustainability Lead", tagline: "Better materials", text: "We source paper-based, plant-based and recyclable options so your packaging looks great and treads lightly.", icon: "Leaf", accent: "from-[#22c55e] to-[#14b8a6]", name: "", photo: "" },
      { role: "Fulfilment & Logistics", tagline: "On time, intact", text: "Careful packing, free standard shipping and rush options keep your launch dates safe.", icon: "Truck", accent: "from-[#f59e0b] to-secondary", name: "", photo: "" },
      { role: "Customer Care", tagline: "Fast replies", text: "Questions about an order? A real person answers quickly, with no ticket maze.", icon: "Boxes", accent: "from-secondary to-primary", name: "", photo: "" },
    ],
  },
  {
    key: "teamPrinciples",
    label: "Team: principles",
    hint: "Numbered principles on /team.",
    defaults: [
      { n: "01", title: "Be honest", text: "Clear pricing, realistic timelines, straight answers." },
      { n: "02", title: "Sweat the details", text: "The fold, the finish, the color: small things people feel." },
      { n: "03", title: "Move fast", text: "Quick responses, short runs and rush orders when you need them." },
      { n: "04", title: "Leave it greener", text: "Choose better materials every chance we get." },
    ],
  },
];

export const contentSection = (key: string) => contentSections.find((s) => s.key === key);
