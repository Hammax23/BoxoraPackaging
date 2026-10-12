/** Boxora live industries — matches site category taxonomy. */
export const BOXORA_INDUSTRIES = [
  "Cosmetic Boxes",
  "Food Boxes",
  "Retail Boxes",
  "Electronics Boxes",
  "Ecommerce Boxes",
  "Gift Boxes",
  "Ecofriendly Boxes",
  "Sweets Boxes",
  "Sports Boxes",
  "Holiday Boxes",
  "Fashion Boxes",
  "Tobacco Boxes",
  "Automotive Boxes",
  "PetCare Boxes",
  "Toy Boxes",
  "Coffee & Tea",
] as const;

export type BoxoraIndustry = (typeof BOXORA_INDUSTRIES)[number];

/**
 * Canonical industry keys used by catalog scoring + AI.
 * Keep these stable — catalog `industries[]` arrays use the same keys.
 */
export type IndustryKey =
  | "cosmetic"
  | "food"
  | "retail"
  | "electronics"
  | "ecommerce"
  | "gift"
  | "ecofriendly"
  | "sweets"
  | "sports"
  | "holiday"
  | "fashion"
  | "tobacco"
  | "automotive"
  | "petcare"
  | "toy"
  | "coffee"
  | "other";

export function toIndustryKey(industry: string): IndustryKey {
  const s = industry.toLowerCase().replace(/\s+/g, " ").trim();

  if (s.includes("coffee") || s.includes("tea") || s.includes("matcha")) return "coffee";
  if (
    s.includes("cosmetic") ||
    s.includes("beauty") ||
    s.includes("skincare") ||
    s.includes("soap") ||
    s.includes("shampoo") ||
    s.includes("lipstick") ||
    s.includes("serum") ||
    s.includes("perfume") ||
    s.includes("lotion") ||
    s.includes("cream") ||
    s.includes("nail")
  ) {
    return "cosmetic";
  }
  if (s.includes("sweet") || s.includes("candy") || s.includes("confection") || s.includes("chocolate") || s.includes("cookie")) {
    return "sweets";
  }
  if (s.includes("food") || s.includes("beverage") || s.includes("snack") || s.includes("bakery") || s.includes("sauce") || s.includes("spice") || s.includes("juice")) {
    return "food";
  }
  if (s.includes("retail") || s.includes("display") || s.includes("pdq")) return "retail";
  if (s.includes("electronic") || s.includes("gadget") || s.includes("phone") || s.includes("charger")) return "electronics";
  if (s.includes("ecommerce") || s.includes("e-commerce") || s.includes("subscription") || s.includes("mailer")) {
    return "ecommerce";
  }
  if (s.includes("gift") || s.includes("jewelry") || s.includes("watch") || s.includes("candle")) return "gift";
  if (s.includes("eco") || s.includes("kraft") || s.includes("recycl")) return "ecofriendly";
  if (s.includes("sport") || s.includes("supplement") || s.includes("protein") || s.includes("vitamin")) return "sports";
  if (s.includes("holiday") || s.includes("seasonal") || s.includes("christmas")) return "holiday";
  if (s.includes("fashion") || s.includes("apparel") || s.includes("shoe") || s.includes("sneaker")) return "fashion";
  if (s.includes("tobacco") || s.includes("vape") || s.includes("cbd") || s.includes("cannabis")) {
    return "tobacco";
  }
  if (s.includes("auto") || s.includes("car part")) return "automotive";
  if (s.includes("pet") || s.includes("dog") || s.includes("cat")) return "petcare";
  if (s.includes("toy") || s.includes("kids") || s.includes("baby")) return "toy";
  return "other";
}

/**
 * Enterprise playbook: what clients in each industry typically expect.
 * Used by AI system prompt + local scoring boosts.
 */
export const INDUSTRY_PLAYBOOK: Record<
  IndustryKey,
  {
    prefer: string[];
    avoid: string[];
    note: string;
  }
> = {
  cosmetic: {
    prefer: ["folding-carton", "folding-sleeve", "rigid-setup", "rigid-drawer", "mailer-box"],
    avoid: ["corrugated-shipper", "double-wall-shipper", "side-gusset-bag"],
    note: "Premium retail presentation — cartons / rigid unboxing over bulk shippers.",
  },
  food: {
    prefer: ["standup-pouch", "standup-flat-bottom", "quad-seal-bag", "side-gusset-bag", "spouted-pouch", "folding-carton"],
    avoid: ["rigid-drawer", "rigid-setup"],
    note: "Food-contact barrier pouches / bags; cartons for dry retail packs.",
  },
  coffee: {
    prefer: ["standup-flat-bottom", "standup-pouch", "side-gusset-bag", "quad-seal-bag"],
    avoid: ["rigid-setup", "rigid-drawer", "sachet-stick"],
    note: "Barrier stand-up / gusset bags with valve + zipper for coffee & tea.",
  },
  retail: {
    prefer: ["folding-carton", "folding-sleeve", "display-shipper", "mailer-box", "standup-pouch"],
    avoid: ["double-wall-shipper"],
    note: "Shelf-ready cartons and display formats for retail channels.",
  },
  electronics: {
    prefer: ["mailer-box", "tuck-mailer", "corrugated-shipper", "double-wall-shipper", "rigid-setup"],
    avoid: ["sachet-stick", "spouted-pouch", "standup-pouch"],
    note: "Protective mailers / shippers with crush resistance — not flexible pouches.",
  },
  ecommerce: {
    prefer: ["mailer-box", "tuck-mailer", "pouch-mailer-combo", "corrugated-shipper"],
    avoid: ["display-shipper", "sachet-stick"],
    note: "Ship-ready mailers designed for DTC parcel networks.",
  },
  gift: {
    prefer: ["rigid-setup", "rigid-drawer", "folding-sleeve", "folding-carton"],
    avoid: ["corrugated-shipper", "side-gusset-bag", "sachet-stick"],
    note: "Luxury rigid / sleeved cartons for gift unboxing moments.",
  },
  ecofriendly: {
    prefer: ["standup-pouch", "folding-carton", "mailer-box", "tuck-mailer"],
    avoid: ["foil-heavy"],
    note: "Prefer mono-material / recyclable-capable structures from catalog.",
  },
  sweets: {
    prefer: ["folding-carton", "folding-sleeve", "rigid-setup", "sachet-stick", "standup-pouch"],
    avoid: ["double-wall-shipper", "corrugated-shipper"],
    note: "Retail sweets cartons / portion sachets; gift rigid for premium lines.",
  },
  sports: {
    prefer: ["standup-pouch", "sachet-stick", "mailer-box", "folding-carton", "pouch-mailer-combo"],
    avoid: ["rigid-drawer"],
    note: "Supplement / nutrition pouches, stick packs, and DTC mailers.",
  },
  holiday: {
    prefer: ["rigid-setup", "folding-sleeve", "folding-carton", "rigid-drawer", "mailer-box"],
    avoid: ["sachet-stick", "spouted-pouch"],
    note: "Seasonal gift-ready rigid and sleeved cartons.",
  },
  fashion: {
    prefer: ["mailer-box", "tuck-mailer", "folding-carton", "rigid-setup"],
    avoid: ["standup-pouch", "side-gusset-bag", "sachet-stick"],
    note: "Apparel DTC mailers and premium folding / rigid for accessories.",
  },
  tobacco: {
    prefer: ["folding-carton", "folding-sleeve", "rigid-setup", "standup-pouch"],
    avoid: ["display-shipper", "spouted-pouch"],
    note: "Child-resistant capable cartons / premium rigid; pouches for loose formats.",
  },
  automotive: {
    prefer: ["corrugated-shipper", "double-wall-shipper", "mailer-box", "tuck-mailer"],
    avoid: ["standup-pouch", "sachet-stick", "spouted-pouch", "rigid-drawer"],
    note: "Heavy protective corrugated — parts need crush + puncture resistance.",
  },
  petcare: {
    prefer: ["standup-pouch", "standup-flat-bottom", "side-gusset-bag", "pouch-mailer-combo", "mailer-box"],
    avoid: ["rigid-drawer"],
    note: "Treat / food pouches and bags; mailer combo for DTC pet brands.",
  },
  toy: {
    prefer: ["mailer-box", "folding-carton", "corrugated-shipper", "rigid-setup", "tuck-mailer"],
    avoid: ["spouted-pouch", "sachet-stick"],
    note: "Retail cartons + protective mailers/shippers for toys.",
  },
  other: {
    prefer: ["mailer-box", "folding-carton", "standup-pouch"],
    avoid: [],
    note: "Balanced retail or ship-ready formats based on size and weight.",
  },
};

/** Free-text synonyms clients type → Boxora industry lines */
const INDUSTRY_SYNONYMS: { industry: BoxoraIndustry; terms: string[] }[] = [
  { industry: "Cosmetic Boxes", terms: ["cosmetic", "makeup", "beauty", "skincare", "lipstick", "serum", "perfume", "fragrance", "lotion", "cream", "nail", "soap", "shampoo", "conditioner"] },
  { industry: "Food Boxes", terms: ["food", "beverage", "snack", "grocery", "sauce", "spice", "meal", "protein bar", "juice"] },
  { industry: "Coffee & Tea", terms: ["coffee", "tea", "espresso", "roast", "beans", "matcha", "chai"] },
  { industry: "Retail Boxes", terms: ["retail", "shelf", "store", "pos", "display"] },
  { industry: "Electronics Boxes", terms: ["electronic", "gadget", "phone", "cable", "charger", "tech", "device", "accessory"] },
  { industry: "Ecommerce Boxes", terms: ["ecommerce", "e-commerce", "dtc", "online", "subscription", "ship", "mailer", "amazon"] },
  { industry: "Gift Boxes", terms: ["gift", "present", "luxury", "unboxing", "premium gift"] },
  { industry: "Ecofriendly Boxes", terms: ["eco", "recyclable", "sustainable", "green", "compost", "kraft"] },
  { industry: "Sweets Boxes", terms: ["sweet", "candy", "chocolate", "confection", "cookie", "bakery", "dessert"] },
  { industry: "Sports Boxes", terms: ["sport", "fitness", "supplement", "protein", "gym", "nutrition", "preworkout"] },
  { industry: "Holiday Boxes", terms: ["holiday", "christmas", "seasonal", "eid", "valentine", "festive"] },
  { industry: "Fashion Boxes", terms: ["fashion", "apparel", "clothing", "shoe", "bag", "textile", "wear"] },
  { industry: "Tobacco Boxes", terms: ["tobacco", "vape", "cbd", "cannabis", "cigar", "nicotine"] },
  { industry: "Automotive Boxes", terms: ["auto", "car", "vehicle", "parts", "motor", "oem"] },
  { industry: "PetCare Boxes", terms: ["pet", "dog", "cat", "treat", "animal"] },
  { industry: "Toy Boxes", terms: ["toy", "kids", "children", "baby", "game", "play"] },
];

/**
 * Full product-level catalog — clients type product names (soap, lipstick, coffee bags…).
 * Every Boxora industry line must have broad coverage so searches never feel empty.
 */
export const BOXORA_PRODUCT_TARGETS: {
  label: string;
  industry: BoxoraIndustry;
  terms: string[];
}[] = [
  // ── Cosmetic Boxes ──────────────────────────────────────────
  { label: "Soap Boxes", industry: "Cosmetic Boxes", terms: ["soap", "bar soap", "bath soap", "handmade soap", "soap box", "glycerin soap"] },
  { label: "Liquid Soap Boxes", industry: "Cosmetic Boxes", terms: ["liquid soap", "hand wash", "hand soap"] },
  { label: "Shampoo Boxes", industry: "Cosmetic Boxes", terms: ["shampoo", "hair wash", "shampoo box"] },
  { label: "Conditioner Boxes", industry: "Cosmetic Boxes", terms: ["conditioner", "hair conditioner", "hair mask"] },
  { label: "Hair Oil Boxes", industry: "Cosmetic Boxes", terms: ["hair oil", "argan oil", "hair serum"] },
  { label: "Hair Dye Boxes", industry: "Cosmetic Boxes", terms: ["hair dye", "hair color", "henna"] },
  { label: "Lipstick Boxes", industry: "Cosmetic Boxes", terms: ["lipstick", "lipstick box", "lip color"] },
  { label: "Lip Gloss Boxes", industry: "Cosmetic Boxes", terms: ["lip gloss", "lip oil"] },
  { label: "Lip Balm Boxes", industry: "Cosmetic Boxes", terms: ["lip balm", "chapstick", "lip care"] },
  { label: "Foundation Boxes", industry: "Cosmetic Boxes", terms: ["foundation", "bb cream", "cc cream", "base makeup"] },
  { label: "Compact Powder Boxes", industry: "Cosmetic Boxes", terms: ["compact", "powder compact", "pressed powder", "loose powder"] },
  { label: "Mascara Boxes", industry: "Cosmetic Boxes", terms: ["mascara", "eyelash"] },
  { label: "Eyeliner Boxes", industry: "Cosmetic Boxes", terms: ["eyeliner", "kajal", "eye pencil"] },
  { label: "Eyeshadow Boxes", industry: "Cosmetic Boxes", terms: ["eyeshadow", "eye palette", "shadow palette"] },
  { label: "Blush Boxes", industry: "Cosmetic Boxes", terms: ["blush", "rouge", "cheek color"] },
  { label: "Highlighter Boxes", industry: "Cosmetic Boxes", terms: ["highlighter", "illuminator"] },
  { label: "Makeup Palette Boxes", industry: "Cosmetic Boxes", terms: ["makeup palette", "beauty palette", "contour kit"] },
  { label: "Makeup Brush Boxes", industry: "Cosmetic Boxes", terms: ["makeup brush", "beauty blender", "brush set"] },
  { label: "Serum Boxes", industry: "Cosmetic Boxes", terms: ["serum", "face serum", "vitamin c serum", "retinol"] },
  { label: "Face Cream Boxes", industry: "Cosmetic Boxes", terms: ["face cream", "day cream", "night cream", "moisturizer"] },
  { label: "Body Lotion Boxes", industry: "Cosmetic Boxes", terms: ["body lotion", "lotion", "body cream", "body butter"] },
  { label: "Face Wash Boxes", industry: "Cosmetic Boxes", terms: ["face wash", "cleanser", "facial wash", "face cleanser"] },
  { label: "Toner Boxes", industry: "Cosmetic Boxes", terms: ["toner", "face toner", "mist"] },
  { label: "Sunscreen Boxes", industry: "Cosmetic Boxes", terms: ["sunscreen", "spf", "sunblock", "sun cream"] },
  { label: "Face Mask Boxes", industry: "Cosmetic Boxes", terms: ["face mask", "sheet mask", "clay mask"] },
  { label: "Eye Cream Boxes", industry: "Cosmetic Boxes", terms: ["eye cream", "under eye", "eye serum"] },
  { label: "Perfume Boxes", industry: "Cosmetic Boxes", terms: ["perfume", "fragrance", "eau de parfum", "edt"] },
  { label: "Cologne Boxes", industry: "Cosmetic Boxes", terms: ["cologne", "aftershave", "body spray"] },
  { label: "Attar Boxes", industry: "Cosmetic Boxes", terms: ["attar", "ittar", "oud"] },
  { label: "Deodorant Boxes", industry: "Cosmetic Boxes", terms: ["deodorant", "antiperspirant", "deo"] },
  { label: "Nail Polish Boxes", industry: "Cosmetic Boxes", terms: ["nail polish", "nail lacquer", "manicure", "nail gel"] },
  { label: "Nail Care Kits", industry: "Cosmetic Boxes", terms: ["nail kit", "nail care", "cuticle"] },
  { label: "Bath Bomb Boxes", industry: "Cosmetic Boxes", terms: ["bath bomb", "bath salt", "bath fizz"] },
  { label: "Body Scrub Boxes", industry: "Cosmetic Boxes", terms: ["body scrub", "exfoliator", "sugar scrub"] },
  { label: "Essential Oil Boxes", industry: "Cosmetic Boxes", terms: ["essential oil", "aromatherapy", "diffuser oil"] },
  { label: "Beard Care Boxes", industry: "Cosmetic Boxes", terms: ["beard oil", "beard balm", "beard kit", "grooming"] },
  { label: "Skincare Kit Boxes", industry: "Cosmetic Boxes", terms: ["skincare kit", "beauty kit", "facial kit", "routine kit"] },
  { label: "Cosmetic Display Boxes", industry: "Cosmetic Boxes", terms: ["cosmetic display", "makeup display"] },

  // ── Food Boxes ──────────────────────────────────────────────
  { label: "Snack Boxes", industry: "Food Boxes", terms: ["snack", "snack box", "party snack"] },
  { label: "Chips & Crisps Boxes", industry: "Food Boxes", terms: ["chips", "crisps", "potato chips", "nachos"] },
  { label: "Nuts & Dry Fruit Boxes", industry: "Food Boxes", terms: ["nuts", "dry fruit", "almond", "cashew", "trail mix"] },
  { label: "Sauce Boxes", industry: "Food Boxes", terms: ["sauce", "pasta sauce", "hot sauce"] },
  { label: "Ketchup & Condiment Boxes", industry: "Food Boxes", terms: ["ketchup", "mayo", "mayonnaise", "condiment", "mustard"] },
  { label: "Chutney Boxes", industry: "Food Boxes", terms: ["chutney", "pickle", "achar", "relish"] },
  { label: "Spice Boxes", industry: "Food Boxes", terms: ["spice", "masala", "seasoning", "spice blend"] },
  { label: "Flour & Grain Boxes", industry: "Food Boxes", terms: ["flour", "atta", "grain", "rice box", "dal"] },
  { label: "Pasta Boxes", industry: "Food Boxes", terms: ["pasta", "noodles", "macaroni"] },
  { label: "Cereal Boxes", industry: "Food Boxes", terms: ["cereal", "breakfast cereal", "muesli", "oats"] },
  { label: "Oil Bottles Packaging", industry: "Food Boxes", terms: ["cooking oil", "olive oil", "ghee packaging"] },
  { label: "Honey Boxes", industry: "Food Boxes", terms: ["honey", "honey jar box", "organic honey"] },
  { label: "Jam & Spread Boxes", industry: "Food Boxes", terms: ["jam", "jelly", "peanut butter", "spread", "nutella"] },
  { label: "Juice Boxes", industry: "Food Boxes", terms: ["juice", "nectar", "fruit drink", "juice carton"] },
  { label: "Soft Drink Packaging", industry: "Food Boxes", terms: ["soft drink", "soda", "beverage can box"] },
  { label: "Water Bottle Packaging", industry: "Food Boxes", terms: ["water bottle", "mineral water", "sparkling water"] },
  { label: "Dairy Product Boxes", industry: "Food Boxes", terms: ["dairy", "milk", "yogurt", "cheese", "butter"] },
  { label: "Frozen Food Boxes", industry: "Food Boxes", terms: ["frozen food", "frozen meal", "ice cream carton"] },
  { label: "Ready Meal Boxes", industry: "Food Boxes", terms: ["ready meal", "meal kit", "prepared food"] },
  { label: "Baby Food Boxes", industry: "Food Boxes", terms: ["baby food", "infant formula", "puree"] },
  { label: "Organic Food Boxes", industry: "Food Boxes", terms: ["organic food", "organic grocery"] },
  { label: "Meat & Seafood Boxes", industry: "Food Boxes", terms: ["meat", "seafood", "chicken pack", "fish pack"] },
  { label: "Egg Cartons & Boxes", industry: "Food Boxes", terms: ["egg", "egg carton", "egg box"] },
  { label: "Bread & Bakery Food Boxes", industry: "Food Boxes", terms: ["bread", "bakery food", "loaf box"] },

  // ── Coffee & Tea ────────────────────────────────────────────
  { label: "Coffee Bags", industry: "Coffee & Tea", terms: ["coffee bag", "coffee pouch", "coffee packaging"] },
  { label: "Coffee Bean Bags", industry: "Coffee & Tea", terms: ["coffee beans", "whole bean", "roast bag"] },
  { label: "Ground Coffee Pouches", industry: "Coffee & Tea", terms: ["ground coffee", "filter coffee", "espresso grind"] },
  { label: "Instant Coffee Boxes", industry: "Coffee & Tea", terms: ["instant coffee", "coffee sachet", "3in1 coffee"] },
  { label: "Coffee Capsule Boxes", industry: "Coffee & Tea", terms: ["coffee capsule", "nespresso", "pod coffee", "k-cup"] },
  { label: "Tea Boxes", industry: "Coffee & Tea", terms: ["tea box", "tea packaging", "loose tea box"] },
  { label: "Tea Bag Boxes", industry: "Coffee & Tea", terms: ["tea bag", "tea bags", "pyramid tea"] },
  { label: "Green Tea Boxes", industry: "Coffee & Tea", terms: ["green tea", "sencha", "jasmine tea"] },
  { label: "Herbal Tea Boxes", industry: "Coffee & Tea", terms: ["herbal tea", "chamomile", "mint tea", "detox tea"] },
  { label: "Chai Masala Boxes", industry: "Coffee & Tea", terms: ["chai", "masala chai", "karak chai"] },
  { label: "Matcha Pouches", industry: "Coffee & Tea", terms: ["matcha", "matcha powder", "matcha pouch"] },
  { label: "Cocoa & Hot Chocolate Boxes", industry: "Coffee & Tea", terms: ["cocoa", "hot chocolate", "drinking chocolate"] },

  // ── Sweets Boxes ────────────────────────────────────────────
  { label: "Chocolate Boxes", industry: "Sweets Boxes", terms: ["chocolate", "chocolate box", "cocoa bar"] },
  { label: "Truffle Boxes", industry: "Sweets Boxes", terms: ["truffle", "chocolate truffle"] },
  { label: "Candy Boxes", industry: "Sweets Boxes", terms: ["candy", "sweets", "toffee", "hard candy"] },
  { label: "Gummy Candy Boxes", industry: "Sweets Boxes", terms: ["gummy", "gummies", "jelly candy"] },
  { label: "Cookie Boxes", industry: "Sweets Boxes", terms: ["cookie", "biscuit", "cookies box"] },
  { label: "Brownie Boxes", industry: "Sweets Boxes", terms: ["brownie", "blondie"] },
  { label: "Cake Boxes", industry: "Sweets Boxes", terms: ["cake", "cake box", "birthday cake"] },
  { label: "Cupcake Boxes", industry: "Sweets Boxes", terms: ["cupcake", "muffin box"] },
  { label: "Donut Boxes", industry: "Sweets Boxes", terms: ["donut", "doughnut"] },
  { label: "Macaron Boxes", industry: "Sweets Boxes", terms: ["macaron", "macaroon"] },
  { label: "Pastry Boxes", industry: "Sweets Boxes", terms: ["pastry", "croissant", "danish"] },
  { label: "Mithai Boxes", industry: "Sweets Boxes", terms: ["mithai", "indian sweets", "ladoo", "barfi", "halwa"] },
  { label: "Dates Boxes", industry: "Sweets Boxes", terms: ["dates", "khajoor", "stuffed dates"] },
  { label: "Ice Cream Packaging", industry: "Sweets Boxes", terms: ["ice cream", "gelato", "kulfi"] },
  { label: "Dessert Boxes", industry: "Sweets Boxes", terms: ["dessert", "sweet box", "pudding"] },

  // ── Retail Boxes ────────────────────────────────────────────
  { label: "Retail Display Boxes", industry: "Retail Boxes", terms: ["display box", "retail display", "counter display"] },
  { label: "PDQ Display Shippers", industry: "Retail Boxes", terms: ["pdq", "shelf ready", "srrc", "retail ready"] },
  { label: "POS Counter Boxes", industry: "Retail Boxes", terms: ["pos", "point of sale", "counter unit"] },
  { label: "Hang Tab Retail Boxes", industry: "Retail Boxes", terms: ["hang tab", "peg hook", "hanging pack"] },
  { label: "Window Retail Boxes", industry: "Retail Boxes", terms: ["window box", "clear window retail"] },
  { label: "Shelf Tray Boxes", industry: "Retail Boxes", terms: ["shelf tray", "retail tray"] },
  { label: "Dump Bin Displays", industry: "Retail Boxes", terms: ["dump bin", "floor display"] },
  { label: "Product Sample Boxes", industry: "Retail Boxes", terms: ["sample box", "tester pack", "trial size"] },

  // ── Electronics Boxes ───────────────────────────────────────
  { label: "Phone Boxes", industry: "Electronics Boxes", terms: ["phone box", "mobile box", "smartphone packaging"] },
  { label: "Phone Case Boxes", industry: "Electronics Boxes", terms: ["phone case", "mobile cover", "case packaging"] },
  { label: "Charger Boxes", industry: "Electronics Boxes", terms: ["charger", "power adapter", "wall charger"] },
  { label: "Cable Boxes", industry: "Electronics Boxes", terms: ["cable", "usb cable", "charging cable", "wire box"] },
  { label: "Earbud & Earphone Boxes", industry: "Electronics Boxes", terms: ["earbud", "earphone", "airpod", "headphone"] },
  { label: "Power Bank Boxes", industry: "Electronics Boxes", terms: ["power bank", "portable charger"] },
  { label: "Smartwatch Boxes", industry: "Electronics Boxes", terms: ["smartwatch", "fitness band", "wearable"] },
  { label: "Tablet Boxes", industry: "Electronics Boxes", terms: ["tablet", "ipad packaging"] },
  { label: "Laptop Boxes", industry: "Electronics Boxes", terms: ["laptop", "notebook computer"] },
  { label: "Keyboard & Mouse Boxes", industry: "Electronics Boxes", terms: ["keyboard", "mouse", "peripheral"] },
  { label: "Speaker Boxes", industry: "Electronics Boxes", terms: ["speaker", "bluetooth speaker", "soundbar"] },
  { label: "Camera Boxes", industry: "Electronics Boxes", terms: ["camera", "webcam", "action cam"] },
  { label: "SSD & Storage Boxes", industry: "Electronics Boxes", terms: ["ssd", "hard drive", "usb drive", "memory card"] },
  { label: "Gaming Accessory Boxes", industry: "Electronics Boxes", terms: ["gaming", "controller", "console accessory"] },
  { label: "LED & Lighting Boxes", industry: "Electronics Boxes", terms: ["led", "bulb", "smart light", "lamp packing"] },
  { label: "Gadget Boxes", industry: "Electronics Boxes", terms: ["gadget", "tech gift", "electronic device"] },

  // ── Ecommerce Boxes ─────────────────────────────────────────
  { label: "Mailer Boxes", industry: "Ecommerce Boxes", terms: ["mailer", "mailer box", "shipping mailer"] },
  { label: "Shipping Boxes", industry: "Ecommerce Boxes", terms: ["shipping box", "carton shipper", "courier box"] },
  { label: "Subscription Boxes", industry: "Ecommerce Boxes", terms: ["subscription", "monthly box", "sub box", "crate"] },
  { label: "Amazon Packaging Boxes", industry: "Ecommerce Boxes", terms: ["amazon", "fba", "amazon packaging"] },
  { label: "DTC Brand Mailers", industry: "Ecommerce Boxes", terms: ["dtc", "direct to consumer", "branded mailer"] },
  { label: "Poly Mailer Packaging", industry: "Ecommerce Boxes", terms: ["poly mailer", "plastic mailer", "courier bag"] },
  { label: "Return Mailer Boxes", industry: "Ecommerce Boxes", terms: ["return mailer", "returns packaging"] },
  { label: "Unboxing Experience Boxes", industry: "Ecommerce Boxes", terms: ["unboxing", "experience box", "branded insert"] },
  { label: "Insert Card Packaging", industry: "Ecommerce Boxes", terms: ["insert card", "thank you card pack"] },

  // ── Gift Boxes ──────────────────────────────────────────────
  { label: "Gift Boxes", industry: "Gift Boxes", terms: ["gift box", "present box", "gift packaging"] },
  { label: "Luxury Gift Boxes", industry: "Gift Boxes", terms: ["luxury gift", "premium gift", "rigid gift"] },
  { label: "Jewelry Boxes", industry: "Gift Boxes", terms: ["jewelry", "jewellery", "ring box", "necklace box"] },
  { label: "Earring Boxes", industry: "Gift Boxes", terms: ["earring", "earring box", "studs"] },
  { label: "Bracelet Boxes", industry: "Gift Boxes", terms: ["bracelet", "bangle box"] },
  { label: "Watch Boxes", industry: "Gift Boxes", terms: ["watch box", "watch case", "timepiece"] },
  { label: "Candle Boxes", industry: "Gift Boxes", terms: ["candle", "scented candle", "soy candle", "candle jar"] },
  { label: "Perfume Gift Sets", industry: "Gift Boxes", terms: ["perfume gift", "fragrance set", "gift set"] },
  { label: "Hamper Boxes", industry: "Gift Boxes", terms: ["hamper", "gift hamper", "gift basket"] },
  { label: "Wedding Favor Boxes", industry: "Gift Boxes", terms: ["wedding favor", "nikah favor", "shaadi favor", "guest favor"] },
  { label: "Corporate Gift Boxes", industry: "Gift Boxes", terms: ["corporate gift", "client gift", "employee gift"] },
  { label: "Keepsake Boxes", industry: "Gift Boxes", terms: ["keepsake", "memory box", "treasure box"] },

  // ── Ecofriendly Boxes ───────────────────────────────────────
  { label: "Eco Kraft Boxes", industry: "Ecofriendly Boxes", terms: ["kraft box", "eco kraft", "brown kraft"] },
  { label: "Recyclable Mailer Boxes", industry: "Ecofriendly Boxes", terms: ["recyclable mailer", "eco mailer"] },
  { label: "Compostable Packaging", industry: "Ecofriendly Boxes", terms: ["compostable", "biodegradable", "plant based pack"] },
  { label: "Mono-Material Pouches", industry: "Ecofriendly Boxes", terms: ["mono material", "recyclable pouch", "pe pouch"] },
  { label: "Paper Bag Packaging", industry: "Ecofriendly Boxes", terms: ["paper bag", "kraft bag", "shopping bag"] },
  { label: "Plastic-Free Boxes", industry: "Ecofriendly Boxes", terms: ["plastic free", "zero plastic", "plasticless"] },
  { label: "Sustainable Shipping Boxes", industry: "Ecofriendly Boxes", terms: ["sustainable shipper", "green shipping"] },
  { label: "Seed Paper Packaging", industry: "Ecofriendly Boxes", terms: ["seed paper", "plantable packaging"] },

  // ── Sports Boxes ────────────────────────────────────────────
  { label: "Supplement Boxes", industry: "Sports Boxes", terms: ["supplement", "dietary supplement", "supplement bottle box"] },
  { label: "Protein Powder Pouches", industry: "Sports Boxes", terms: ["protein powder", "whey", "casein", "protein pouch"] },
  { label: "Protein Bar Boxes", industry: "Sports Boxes", terms: ["protein bar", "energy bar", "granola bar", "fitness bar"] },
  { label: "Vitamin Boxes", industry: "Sports Boxes", terms: ["vitamin", "multivitamin", "vitamin bottle"] },
  { label: "Capsule & Tablet Boxes", industry: "Sports Boxes", terms: ["capsule", "tablet", "pill bottle box"] },
  { label: "Pre-Workout Boxes", industry: "Sports Boxes", terms: ["preworkout", "pre workout", "intra workout"] },
  { label: "Creatine & Amino Boxes", industry: "Sports Boxes", terms: ["creatine", "bcaa", "amino acid", "eaas"] },
  { label: "Sports Drink Packaging", industry: "Sports Boxes", terms: ["sports drink", "electrolyte", "energy drink"] },
  { label: "Gym Accessory Boxes", industry: "Sports Boxes", terms: ["gym", "fitness accessory", "resistance band"] },
  { label: "Yoga Product Boxes", industry: "Sports Boxes", terms: ["yoga", "yoga mat box", "meditation"] },
  { label: "Athletic Wear Mailers", industry: "Sports Boxes", terms: ["athletic wear", "sportswear mailer", "activewear"] },

  // ── Holiday Boxes ───────────────────────────────────────────
  { label: "Christmas Gift Boxes", industry: "Holiday Boxes", terms: ["christmas", "xmas", "christmas gift", "noel"] },
  { label: "Eid Gift Boxes", industry: "Holiday Boxes", terms: ["eid", "eid gift", "ramadan gift", "eid mubarak"] },
  { label: "Valentine Boxes", industry: "Holiday Boxes", terms: ["valentine", "valentines", "love gift"] },
  { label: "Halloween Boxes", industry: "Holiday Boxes", terms: ["halloween", "spooky box"] },
  { label: "New Year Gift Boxes", industry: "Holiday Boxes", terms: ["new year", "nye gift", "year end gift"] },
  { label: "Mother's Day Boxes", industry: "Holiday Boxes", terms: ["mothers day", "mother day"] },
  { label: "Father's Day Boxes", industry: "Holiday Boxes", terms: ["fathers day", "father day"] },
  { label: "Diwali Gift Boxes", industry: "Holiday Boxes", terms: ["diwali", "deepavali", "festival gift"] },
  { label: "Thanksgiving Boxes", industry: "Holiday Boxes", terms: ["thanksgiving", "turkey day"] },
  { label: "Seasonal Promo Boxes", industry: "Holiday Boxes", terms: ["seasonal", "holiday promo", "festive pack"] },
  { label: "Advent Calendar Boxes", industry: "Holiday Boxes", terms: ["advent", "advent calendar"] },

  // ── Fashion Boxes ───────────────────────────────────────────
  { label: "Shoe Boxes", industry: "Fashion Boxes", terms: ["shoe", "shoe box", "footwear", "sneaker box"] },
  { label: "Sneaker Boxes", industry: "Fashion Boxes", terms: ["sneaker", "trainer", "kicks"] },
  { label: "Apparel Mailers", industry: "Fashion Boxes", terms: ["apparel", "clothing mailer", "garment mailer"] },
  { label: "T-Shirt Packaging", industry: "Fashion Boxes", terms: ["tshirt", "t-shirt", "tee packaging"] },
  { label: "Hoodie & Jacket Boxes", industry: "Fashion Boxes", terms: ["hoodie", "jacket", "outerwear"] },
  { label: "Dress Boxes", industry: "Fashion Boxes", terms: ["dress", "gown packaging"] },
  { label: "Handbag Boxes", industry: "Fashion Boxes", terms: ["handbag", "purse", "tote packaging"] },
  { label: "Wallet Boxes", industry: "Fashion Boxes", terms: ["wallet", "card holder", "purse wallet"] },
  { label: "Belt Boxes", industry: "Fashion Boxes", terms: ["belt", "leather belt"] },
  { label: "Scarf & Hijab Boxes", industry: "Fashion Boxes", terms: ["scarf", "hijab", "dupatta", "shawl"] },
  { label: "Sock Packaging", industry: "Fashion Boxes", terms: ["sock", "socks pack", "hosiery"] },
  { label: "Underwear Packaging", industry: "Fashion Boxes", terms: ["underwear", "lingerie", "intimates"] },
  { label: "Hat & Cap Boxes", industry: "Fashion Boxes", terms: ["hat", "cap", "beanie"] },
  { label: "Sunglasses Boxes", industry: "Fashion Boxes", terms: ["sunglasses", "eyewear", "glasses case"] },
  { label: "Fashion Accessories Boxes", industry: "Fashion Boxes", terms: ["fashion accessory", "style accessory"] },

  // ── Tobacco Boxes ───────────────────────────────────────────
  { label: "Cigarette Boxes", industry: "Tobacco Boxes", terms: ["cigarette", "cig pack", "smoke pack"] },
  { label: "Cigar Boxes", industry: "Tobacco Boxes", terms: ["cigar", "cigar box", "humidor style"] },
  { label: "Vape Boxes", industry: "Tobacco Boxes", terms: ["vape", "vape kit", "vape device"] },
  { label: "Vape Pod Boxes", industry: "Tobacco Boxes", terms: ["vape pod", "pod pack", "refill pod"] },
  { label: "E-Liquid Boxes", industry: "Tobacco Boxes", terms: ["e-liquid", "e juice", "vape juice"] },
  { label: "Nicotine Pouch Boxes", industry: "Tobacco Boxes", terms: ["nicotine pouch", "nicotine pack", "snus"] },
  { label: "CBD Product Boxes", industry: "Tobacco Boxes", terms: ["cbd", "cbd oil", "cbd gummies"] },
  { label: "Hemp Product Boxes", industry: "Tobacco Boxes", terms: ["hemp", "hemp oil", "hemp flower"] },
  { label: "Cannabis Packaging", industry: "Tobacco Boxes", terms: ["cannabis", "marijuana", "weed packaging", "thc"] },
  { label: "Rolling Paper Boxes", industry: "Tobacco Boxes", terms: ["rolling paper", "papers", "wraps"] },
  { label: "Hookah & Shisha Boxes", industry: "Tobacco Boxes", terms: ["hookah", "shisha", "molasses"] },

  // ── Automotive Boxes ────────────────────────────────────────
  { label: "Auto Parts Boxes", industry: "Automotive Boxes", terms: ["auto part", "car part", "spare part", "oem part"] },
  { label: "Oil Filter Boxes", industry: "Automotive Boxes", terms: ["oil filter", "air filter", "cabin filter"] },
  { label: "Brake Parts Boxes", industry: "Automotive Boxes", terms: ["brake", "brake pad", "rotor"] },
  { label: "Spark Plug Boxes", industry: "Automotive Boxes", terms: ["spark plug", "ignition"] },
  { label: "Battery Packaging", industry: "Automotive Boxes", terms: ["car battery", "auto battery", "battery pack"] },
  { label: "Headlight Boxes", industry: "Automotive Boxes", terms: ["headlight", "tail light", "auto lamp"] },
  { label: "Tire & Wheel Packaging", industry: "Automotive Boxes", terms: ["tire", "wheel", "rim packaging"] },
  { label: "Car Accessory Boxes", industry: "Automotive Boxes", terms: ["car accessory", "auto accessory", "interior accessory"] },
  { label: "Motor Oil Packaging", industry: "Automotive Boxes", terms: ["motor oil", "engine oil", "lubricant"] },
  { label: "Tool Kit Boxes", industry: "Automotive Boxes", terms: ["tool kit", "auto tools", "mechanic tools"] },

  // ── PetCare Boxes ───────────────────────────────────────────
  { label: "Pet Treat Pouches", industry: "PetCare Boxes", terms: ["pet treat", "dog treat", "cat treat", "treat pouch"] },
  { label: "Dog Food Bags", industry: "PetCare Boxes", terms: ["dog food", "puppy food", "kibble bag"] },
  { label: "Cat Food Boxes", industry: "PetCare Boxes", terms: ["cat food", "kitten food", "wet cat food"] },
  { label: "Pet Supplement Boxes", industry: "PetCare Boxes", terms: ["pet supplement", "pet vitamin", "joint chew"] },
  { label: "Pet Toy Boxes", industry: "PetCare Boxes", terms: ["pet toy", "dog toy", "cat toy"] },
  { label: "Pet Grooming Boxes", industry: "PetCare Boxes", terms: ["pet grooming", "pet shampoo", "pet brush"] },
  { label: "Litter & Hygiene Boxes", industry: "PetCare Boxes", terms: ["cat litter", "pet litter", "pet pad"] },
  { label: "Aquarium Product Boxes", industry: "PetCare Boxes", terms: ["aquarium", "fish food", "fish tank"] },
  { label: "Bird Food Boxes", industry: "PetCare Boxes", terms: ["bird food", "bird seed", "avian"] },
  { label: "Pet Subscription Boxes", industry: "PetCare Boxes", terms: ["pet subscription", "pet crate", "pet monthly"] },

  // ── Toy Boxes ───────────────────────────────────────────────
  { label: "Toy Packaging Boxes", industry: "Toy Boxes", terms: ["toy box", "toy packaging", "kids toy"] },
  { label: "Action Figure Boxes", industry: "Toy Boxes", terms: ["action figure", "figurine", "collectible figure"] },
  { label: "Doll Boxes", industry: "Toy Boxes", terms: ["doll", "barbie style", "doll packaging"] },
  { label: "Building Block Boxes", industry: "Toy Boxes", terms: ["lego", "building blocks", "bricks"] },
  { label: "Board Game Boxes", industry: "Toy Boxes", terms: ["board game", "card game", "tabletop"] },
  { label: "Puzzle Boxes", industry: "Toy Boxes", terms: ["puzzle", "jigsaw"] },
  { label: "Educational Toy Boxes", industry: "Toy Boxes", terms: ["educational toy", "stem toy", "learning toy"] },
  { label: "Plush Toy Boxes", industry: "Toy Boxes", terms: ["plush", "stuffed animal", "soft toy"] },
  { label: "Baby Toy Boxes", industry: "Toy Boxes", terms: ["baby toy", "infant toy", "teether pack"] },
  { label: "Remote Control Toy Boxes", industry: "Toy Boxes", terms: ["rc toy", "remote control", "drone toy"] },
  { label: "Art & Craft Kits", industry: "Toy Boxes", terms: ["craft kit", "art kit", "diy kids"] },
  { label: "Collectible Trading Card Boxes", industry: "Toy Boxes", terms: ["trading card", "tcg", "booster box"] },
];

export type IndustrySuggestion = {
  /** What the user selects / sees (product or industry label) */
  label: string;
  /** Mapped Boxora industry for scoring + AI */
  industry: BoxoraIndustry;
  score: number;
  reason: string;
  source: "match" | "ai";
  kind: "product" | "industry";
};

function scoreTermHit(query: string, term: string) {
  const q = query.toLowerCase();
  const t = term.toLowerCase();
  if (q === t) return 100;
  if (t.startsWith(q)) return 90;
  if (q.startsWith(t) && t.length >= 3) return 80;
  if (t.includes(q)) return 74;
  if (q.includes(t) && t.length >= 3) return 68;
  // multi-word soft match: "soap box" vs "soap"
  const qWords = q.split(/\s+/);
  const tWords = t.split(/\s+/);
  if (qWords.some((w) => tWords.some((tw) => tw.startsWith(w) && w.length >= 3))) return 72;
  return 0;
}

/** Instant local product + industry suggestions while typing. */
export function suggestIndustriesLocal(query: string, limit = 8): IndustrySuggestion[] {
  const q = query.toLowerCase().replace(/\s+/g, " ").trim();

  if (!q) {
    // Default: popular products first, then industries
    const defaults: IndustrySuggestion[] = [
      ...BOXORA_PRODUCT_TARGETS.slice(0, 5).map((p) => ({
        label: p.label,
        industry: p.industry,
        score: 55,
        reason: `Product target · ${p.industry}`,
        source: "match" as const,
        kind: "product" as const,
      })),
      ...BOXORA_INDUSTRIES.slice(0, 3).map((industry) => ({
        label: industry,
        industry,
        score: 48,
        reason: "Industry line",
        source: "match" as const,
        kind: "industry" as const,
      })),
    ];
    return defaults.slice(0, limit);
  }

  const scored = new Map<string, IndustrySuggestion>();

  const upsert = (row: IndustrySuggestion) => {
    const prev = scored.get(row.label);
    if (!prev || row.score > prev.score) scored.set(row.label, row);
  };

  // Product targets (priority)
  for (const product of BOXORA_PRODUCT_TARGETS) {
    let best = scoreTermHit(q, product.label);
    let hit = best > 0 ? product.label : "";
    for (const term of product.terms) {
      const s = scoreTermHit(q, term);
      if (s > best) {
        best = s;
        hit = term;
      }
    }
    if (best <= 0) continue;
    upsert({
      label: product.label,
      industry: product.industry,
      score: best + 4, // slight boost so products rank above bare industries
      reason: hit ? `Product match for “${hit}” · ${product.industry}` : `Maps to ${product.industry}`,
      source: "match",
      kind: "product",
    });
  }

  // Industry lines
  for (const name of BOXORA_INDUSTRIES) {
    const lower = name.toLowerCase();
    let score = scoreTermHit(q, lower);
    if (lower.split(/\s+/).some((w) => w.startsWith(q) && q.length >= 2)) score = Math.max(score, 82);
    if (score > 0) {
      upsert({
        label: name,
        industry: name,
        score,
        reason: `Industry line · ${name}`,
        source: "match",
        kind: "industry",
      });
    }
  }

  for (const row of INDUSTRY_SYNONYMS) {
    let best = 0;
    let hit = "";
    for (const term of row.terms) {
      const s = scoreTermHit(q, term);
      if (s > best) {
        best = s;
        hit = term;
      }
    }
    if (best <= 0) continue;
    upsert({
      label: row.industry,
      industry: row.industry,
      score: best,
      reason: hit ? `Often typed as “${hit}”` : "Related industry",
      source: "match",
      kind: "industry",
    });
  }

  return [...scored.values()]
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function industryHint(value: string): string {
  const key = toIndustryKey(resolveIndustryLine(value));
  return INDUSTRY_PLAYBOOK[key].note;
}

export function isKnownIndustry(value: string): value is BoxoraIndustry {
  return (BOXORA_INDUSTRIES as readonly string[]).includes(value);
}

export function isKnownProductOrIndustry(value: string): boolean {
  if (isKnownIndustry(value)) return true;
  return BOXORA_PRODUCT_TARGETS.some((p) => p.label === value);
}

/** Resolve a product label (Soap Boxes) or industry to a Boxora industry line. */
export function resolveIndustryLine(value: string): BoxoraIndustry {
  const product = BOXORA_PRODUCT_TARGETS.find((p) => p.label === value);
  if (product) return product.industry;
  if (isKnownIndustry(value)) return value;
  // Free-text fallback via key mapping → best industry name
  const key = toIndustryKey(value);
  const fromKey = BOXORA_INDUSTRIES.find((i) => toIndustryKey(i) === key);
  return fromKey ?? "Retail Boxes";
}

export function allSelectableLabels(): string[] {
  return [...BOXORA_PRODUCT_TARGETS.map((p) => p.label), ...BOXORA_INDUSTRIES];
}

export type TypicalProductSize = {
  length: number;
  width: number;
  height: number;
  weight: number;
  note: string;
};

/** Typical single-unit retail sizes (inches / kg) for common products. */
const TYPICAL_SIZE_BY_LABEL: Record<string, TypicalProductSize> = {
  "Soap Boxes": {
    length: 3.5,
    width: 2.5,
    height: 1.1,
    weight: 0.12,
    note: "Typical single bar soap (~90–150g). 8×5×3\" is closer to a multi-bar gift set.",
  },
  "Lipstick Boxes": {
    length: 3.2,
    width: 1.0,
    height: 1.0,
    weight: 0.04,
    note: "Typical lipstick carton for one stick.",
  },
  "Perfume Boxes": {
    length: 5.5,
    width: 2.2,
    height: 2.2,
    weight: 0.25,
    note: "Typical 50–100ml perfume carton.",
  },
  "Coffee Bags": {
    length: 8,
    width: 5,
    height: 2.5,
    weight: 0.35,
    note: "Common 12oz / 340g coffee pouch footprint.",
  },
  "Tea Boxes": {
    length: 6,
    width: 3,
    height: 3,
    weight: 0.15,
    note: "Typical retail tea carton for ~20–50 bags.",
  },
  "Chocolate Boxes": {
    length: 7,
    width: 3.5,
    height: 1.5,
    weight: 0.2,
    note: "Typical bar / small assortment chocolate carton.",
  },
  "Phone Case Boxes": {
    length: 7,
    width: 4,
    height: 0.8,
    weight: 0.08,
    note: "Typical phone case retail carton.",
  },
  "Shoe Boxes": {
    length: 13,
    width: 9,
    height: 5,
    weight: 0.9,
    note: "Approximate adult shoe box — adjust to exact pair size.",
  },
};

export function getTypicalProductSize(productLabel: string): TypicalProductSize | null {
  if (TYPICAL_SIZE_BY_LABEL[productLabel]) return TYPICAL_SIZE_BY_LABEL[productLabel];
  const lower = productLabel.toLowerCase();
  if (lower.includes("soap")) return TYPICAL_SIZE_BY_LABEL["Soap Boxes"];
  if (lower.includes("lipstick")) return TYPICAL_SIZE_BY_LABEL["Lipstick Boxes"];
  if (lower.includes("perfume")) return TYPICAL_SIZE_BY_LABEL["Perfume Boxes"];
  if (lower.includes("coffee bag") || lower.includes("coffee pouch")) {
    return TYPICAL_SIZE_BY_LABEL["Coffee Bags"];
  }
  return null;
}

export type SizeFitCheck = {
  status: "ok" | "large" | "small" | "heavy";
  message: string;
  typical: TypicalProductSize;
};

/** Compare entered dims to typical product unit size. */
export function checkProductSizeFit(
  productLabel: string,
  length: number,
  width: number,
  height: number,
  weight: number,
): SizeFitCheck | null {
  const typical = getTypicalProductSize(productLabel);
  if (!typical || length <= 0 || width <= 0 || height <= 0) return null;

  const enteredVol = length * width * height;
  const typicalVol = typical.length * typical.width * typical.height;
  const ratio = enteredVol / Math.max(typicalVol, 0.01);

  if (weight > typical.weight * 4.5) {
    return {
      status: "heavy",
      message: `Weight ${weight} kg is high for a typical ${productLabel.replace(/ Boxes$/i, "").toLowerCase()} unit (~${typical.weight} kg). This may be a multipack or gift set.`,
      typical,
    };
  }
  if (ratio >= 4) {
    return {
      status: "large",
      message: `${length}×${width}×${height}" is much larger than a typical single unit (~${typical.length}×${typical.width}×${typical.height}"). ${typical.note}`,
      typical,
    };
  }
  if (ratio <= 0.35) {
    return {
      status: "small",
      message: `Entered size looks smaller than a typical ${productLabel} unit (~${typical.length}×${typical.width}×${typical.height}").`,
      typical,
    };
  }
  return {
    status: "ok",
    message: `Size is in a realistic range for ${productLabel} (typical ~${typical.length}×${typical.width}×${typical.height}", ${typical.weight} kg).`,
    typical,
  };
}

