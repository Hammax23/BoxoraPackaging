import { images } from "./images";

const list: [string, string][] = [
  ["Apparel", "Garment bags, boxes and hang tags"],
  ["Bakery & Cake", "Cake boxes, pastry and bread packaging"],
  ["Beer & Liquor", "Bottle and can carriers, gift boxes"],
  ["Beverage", "Cups, pouches and bottle packaging"],
  ["Candle", "Rigid boxes and sleeves for candles"],
  ["Candy & Sweets", "Treat boxes, pouches and jars"],
  ["Cannabis", "Child-resistant, compliant packaging"],
  ["Chocolate", "Premium bar and truffle packaging"],
  ["Coffee", "Bags, cups and subscription boxes"],
  ["Cosmetics", "Beauty boxes with a premium finish"],
  ["E-Commerce", "Mailer boxes built for shipping"],
  ["Electronics", "Protective, brand-ready device boxes"],
  ["Food", "Food-safe boxes, pouches and trays"],
  ["Gift", "Gift boxes that make a statement"],
  ["Jewelry", "Rigid and magnetic jewelry boxes"],
  ["Pets", "Treat and pet-food packaging"],
  ["Pharmaceutical", "Compliant boxes and inserts"],
  ["Presentation", "Display and presentation packaging"],
  ["Restaurant", "Takeaway boxes, bags and wraps"],
  ["Retail", "Shelf-ready retail boxes"],
  ["Shipping", "Sturdy corrugated shipping cartons"],
  ["Soap", "Eco boxes and wraps for soap"],
  ["Toy", "Safe, playful toy packaging"],
  ["Tea", "Tins, boxes and sachet packaging"],
  ["Window", "Window boxes that show the product"],
  ["Wine", "Wine bottle boxes and gift sets"],
];

/** Shop-by-industry list shown in the header menu (editable later in Admin → Industries). */
export const shopIndustries = list.map(([name, sub], i) => ({
  name,
  sub,
  image: images.megamenuCategories[i % images.megamenuCategories.length],
}));
