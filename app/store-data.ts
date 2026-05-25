export type Product = {
  id: string;
  name: string;
  price: string;
  oldPrice: string;
  brand: string;
  seller: string;
  rating: string;
  reviews: string;
  shipping: string;
  discount: string;
  image?: string;
  badge?: string;
  category: string;
};

export type Category = {
  label: string;
  tagline: string;
  accent: string;
  image: string;
};

export const categories: Category[] = [
  { label: "Electronics", tagline: "Top deals on devices", accent: "from-[#ecf4ff] to-[#d7e8ff]", image: "/electronics/e8.webp" },
  { label: "Watches", tagline: "Best value timepieces", accent: "from-[#f7f3ec] to-[#ead7be]", image: "/watch-images/watch.webp" },
  { label: "Accessories", tagline: "Style-led essentials", accent: "from-[#fff6ea] to-[#f2ddb8]", image: "/accessories/uly.webp" },
  { label: "Games", tagline: "Digital games and plans", accent: "from-[#101826] to-[#1e2d44]", image: "/ps-store/psplus-essential.webp" },
];

export const CUSTOM_CATEGORIES_KEY = "fixx-admin-category-rows";

export const catalog: Record<string, Product[]> = {
  Electronics: [
    { id: "e1", category: "Electronics", name: "Amazon Echo Show 5 Smart Display", price: "\u20B969.99", oldPrice: "\u20B990", brand: "Amazon", seller: "Best Buy & more", rating: "4.6", reviews: "(5.6K)", shipping: "Free next-day delivery", discount: "22% OFF", image: "/electronics/e8.webp", badge: "Best Deal" },
    { id: "e2", category: "Electronics", name: "Amazon Echo Dot Smart Speaker", price: "\u20B939.99", oldPrice: "\u20B950", brand: "Amazon", seller: "Best Buy & more", rating: "4.7", reviews: "(20K)", shipping: "Free delivery", discount: "20% OFF", image: "/electronics/e3.webp", badge: "Popular" },
    { id: "e3", category: "Electronics", name: "Apple AirTag", price: "\u20B916.50", oldPrice: "\u20B929", brand: "Apple", seller: "Best Buy & more", rating: "4.8", reviews: "(65K)", shipping: "Free delivery", discount: "43% OFF", image: "/electronics/e4.webp", badge: "Fast Pick" },
    { id: "e4", category: "Electronics", name: "JBL Charge 6 Portable Speaker", price: "\u20B9161.34", oldPrice: "\u20B9190", brand: "JBL", seller: "Excellent & more", rating: "4.7", reviews: "(1.2K)", shipping: "Free delivery", discount: "15% OFF", image: "/electronics/e2.webp", badge: "Top Rated" },
  ],
  Watches: [
    { id: "w1", category: "Watches", name: "Sylvi Men's Imperial Analog Watch", price: "\u20B997.50", oldPrice: "\u20B9195", brand: "Sylvi", seller: "Sylvi & more", rating: "4.2", reviews: "(14)", shipping: "Free delivery", discount: "LOW PRICE", image: "/watch-images/fossil-mens-privater.svg", badge: "Budget Buy" },
    { id: "w2", category: "Watches", name: "Sonata Verve Quartz Analog Watch", price: "\u20B9194.65", oldPrice: "\u20B9229", brand: "Sonata", seller: "Amazon.in", rating: "4.9", reviews: "(411)", shipping: "Free delivery", discount: "LOW PRICE", image: "/watch-images/ralph-christian-intrepid.svg", badge: "Best Seller" },
    { id: "w3", category: "Watches", name: "Timex Men's Round Dial Analog Watch", price: "\u20B9429.00", oldPrice: "\u20B9529", brand: "Timex", seller: "Amazon.in & more", rating: "4.8", reviews: "(10K)", shipping: "Free delivery", discount: "LOW PRICE", image: "/watch-images/apple-watch-series-11.svg", badge: "Hot Deal" },
    { id: "w4", category: "Watches", name: "Noise Twist 2 Smartwatch", price: "\u20B9156.00", oldPrice: "\u20B9195", brand: "Noise", seller: "Noise", rating: "4.2", reviews: "(14)", shipping: "Free delivery", discount: "LOW PRICE", image: "/watch-images/watch.webp", badge: "New Arrival" },
  ],
  Accessories: [
    { id: "a1", category: "Accessories", name: "Round Diamond Pendant Necklace", price: "\u20B91,170.00", oldPrice: "\u20B91,340", brand: "THE FUTURE ROCKS", seller: "THE FUTURE ROCKS", rating: "4.9", reviews: "(411)", shipping: "Free", discount: "13% OFF", image: "/accessories/uly.webp", badge: "Curated" },
    { id: "a2", category: "Accessories", name: "14kt Gold Open Heart Pendant", price: "\u20B91,294.00", oldPrice: "\u20B91,440", brand: "Ritani", seller: "Ritani", rating: "4.8", reviews: "(220)", shipping: "Free", discount: "10% OFF", image: "/accessories/eave.webp", badge: "Giftable" },
    { id: "a3", category: "Accessories", name: "Pacific Green Lab Diamond Pave", price: "\u20B92,195.00", oldPrice: "\u20B92,560", brand: "Brilliant Earth", seller: "Brilliant Earth", rating: "4.9", reviews: "(63)", shipping: "Free", discount: "14% OFF", image: "/accessories/may.webp", badge: "Premium" },
    { id: "a4", category: "Accessories", name: "Ballerina Blue Diamond Earrings", price: "\u20B9590.00", oldPrice: "\u20B9690", brand: "THE FUTURE ROCKS", seller: "THE FUTURE ROCKS", rating: "4.9", reviews: "(41)", shipping: "Free", discount: "15% OFF", image: "/accessories/imageas.webp", badge: "Trending" },
  ],
  Games: [
    { id: "p1", category: "Games", name: "Sony PlayStation Plus", price: "\u20B93,949", oldPrice: "\u20B94,499", brand: "PlayStation", seller: "PlayStation & more", rating: "4.9", reviews: "(8K)", shipping: "Free next-day delivery", discount: "ESSENTIAL", image: "/ps-store/psplus-essential.webp", badge: "Subscription" },
    { id: "p2", category: "Games", name: "God Of War Digital", price: "\u20B91,999", oldPrice: "\u20B92,499", brand: "PlayStation", seller: "PlayStation Store", rating: "5.0", reviews: "(10)", shipping: "Free next-day delivery", discount: "LOW PRICE", image: "/ps-store/god-of-war.webp", badge: "Game Deal" },
    { id: "p3", category: "Games", name: "Grand Theft Auto Online", price: "\u20B91,669", oldPrice: "\u20B91,999", brand: "PlayStation", seller: "PlayStation Store", rating: "4.7", reviews: "(50K)", shipping: "Free next-day delivery", discount: "LOW PRICE", image: "/ps-store/gta-online.webp", badge: "Digital" },
    { id: "p4", category: "Games", name: "Marvel's Spider-Man", price: "\u20B93,999", oldPrice: "\u20B94,499", brand: "PlayStation", seller: "PlayStation Store", rating: "4.7", reviews: "(11K)", shipping: "Free next-day delivery", discount: "LOW PRICE", image: "/ps-store/spider-man-miles-morales.webp", badge: "Top Pick" },
  ],
};

export function buildSlug(category: string, name: string, index: number) {
  return `${category}-${name}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categorySlug(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
