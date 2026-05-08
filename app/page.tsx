"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
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
  accent: string;
  art: string;
  image?: string;
  kind?: "generic" | "accessory" | "watch" | "electronics" | "psstore";
};

const categories = ["For You", "Accessories", "Watches", "Electronics", "PS Stores"];

const featuredSlides = [
  {
    title: "Trending accessories",
    subtitle: "Curated pieces and statement accents.",
    image: "/banners/fashion-banner.svg",
    accent: "from-[#f8efe2] to-[#f3dcc0]",
  },
  {
    title: "Mobile essentials",
    subtitle: "Tech picks with clean, modern styling.",
    image: "/banners/mobile-banner.svg",
    accent: "from-[#eaf0ff] to-[#d8e3ff]",
  },
  {
    title: "Power picks",
    subtitle: "Popular value-focused products.",
    image: "/banners/poco-banner.svg",
    accent: "from-[#fff0e3] to-[#ffd7b7]",
  },
];

const categoryProducts: Record<string, Product[]> = {
  "For You": [
    {
      name: "Premium Picks",
      price: "₹1,499.00",
      oldPrice: "₹1,799",
      brand: "Curated for you",
      seller: "Fixx Select",
      rating: "4.8",
      reviews: "(128)",
      shipping: "Free",
      discount: "12% OFF",
      accent: "from-[#f5efe4] to-[#ead8c4]",
      art: "SP",
      id: ""
    },
    {
      name: "Daily Essentials",
      price: "₹249.00",
      oldPrice: "₹299",
      brand: "Top rated",
      seller: "Fixx Select",
      rating: "4.6",
      reviews: "(84)",
      shipping: "Free",
      discount: "15% OFF",
      accent: "from-[#e8f0ff] to-[#d4e1ff]",
      art: "BG",
      id: ""
    },
  ],
  Accessories: [
    {
      kind: "accessory",
      name: "Round Diamond Pendant Necklace",
      price: "₹1,170.00",
      oldPrice: "₹1,340",
      brand: "THE FUTURE ROCKS",
      seller: "THE FUTURE ROCKS",
      rating: "4.9",
      reviews: "(411)",
      shipping: "Free",
      discount: "13% OFF",
      accent: "from-[#fffaf0] to-[#f5e4b8]",
      art: "D1",
      image: "/accessories/uly.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "14kt Gold Open Heart Pendant",
      price: "₹1,294.00",
      oldPrice: "₹1,440",
      brand: "Ritani",
      seller: "Ritani",
      rating: "4.8",
      reviews: "(220)",
      shipping: "Free",
      discount: "10% OFF",
      accent: "from-[#fff8ef] to-[#f0d6a0]",
      art: "H1",
      image: "/accessories/eave.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "Round Diamond Pendant Necklace",
      price: "₹1,170.00",
      oldPrice: "₹1,340",
      brand: "THE FUTURE ROCKS",
      seller: "THE FUTURE ROCKS",
      rating: "4.7",
      reviews: "(97)",
      shipping: "Free",
      discount: "13% OFF",
      accent: "from-[#f8fbff] to-[#dfe8f7]",
      art: "D2",
      image: "/accessories/june.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "Pacific Green Lab Diamond Pave",
      price: "₹2,195.00",
      oldPrice: "₹2,560",
      brand: "Brilliant Earth",
      seller: "Brilliant Earth",
      rating: "4.9",
      reviews: "(63)",
      shipping: "Free",
      discount: "14% OFF",
      accent: "from-[#f8fff7] to-[#d8f0da]",
      art: "G1",
      image: "/accessories/may.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "BVLGARI Serpenti Bracelet",
      price: "₹26,000.00",
      oldPrice: "₹29,000",
      brand: "BVLGARI",
      seller: "BVLGARI",
      rating: "4.6",
      reviews: "(18)",
      shipping: "Free",
      discount: "10% OFF",
      accent: "from-[#fff4ef] to-[#f4d1b6]",
      art: "S1",
      image: "/accessories/jmaes.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "Libra Zodiac Diamond Medallion Necklace",
      price: "₹1,295.00",
      oldPrice: "₹1,480",
      brand: "Brilliant Earth",
      seller: "Brilliant Earth",
      rating: "4.7",
      reviews: "(104)",
      shipping: "Free",
      discount: "12% OFF",
      accent: "from-[#fffbe8] to-[#f1e0a2]",
      art: "LB",
      image: "/accessories/web.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "67 Pave Diamond Numerology Necklace",
      price: "₹27,850.00",
      oldPrice: "₹31,000",
      brand: "Logan Hollowell",
      seller: "Logan Hollowell",
      rating: "4.8",
      reviews: "(22)",
      shipping: "Free",
      discount: "10% OFF",
      accent: "from-[#faf7ff] to-[#e7def9]",
      art: "67",
      image: "/shopping.webp",
      id: ""
    },
    {
      kind: "accessory",
      name: "Ballerina Blue Diamond Earrings",
      price: "₹590.00",
      oldPrice: "₹690",
      brand: "THE FUTURE ROCKS",
      seller: "THE FUTURE ROCKS",
      rating: "4.9",
      reviews: "(41)",
      shipping: "Free",
      discount: "15% OFF",
      accent: "from-[#f2fbff] to-[#d7eefc]",
      art: "B1",
      image: "/accessories/imageas.webp",
      id: ""
    },
  ],
  Watches: [
    {
      kind: "watch",
      name: "Sylvi Men's Imperial Analog Watch",
      price: "₹97.50",
      oldPrice: "₹195",
      brand: "Sylvi & more",
      seller: "Sylvi & more",
      rating: "4.2",
      reviews: "(14)",
      shipping: "Free delivery",
      discount: "LOW PRICE",
      accent: "from-[#f5f5f3] to-[#e5e4e0]",
      art: "F1",
      image: "/watch-images/fossil-mens-privater.svg",
      id: ""
    },
    {
      kind: "watch",
      name: "Sonata Verve Quartz Analog Watch",
      price: "₹194.65",
      oldPrice: "₹229",
      brand: "Amazon.in",
      seller: "Amazon.in",
      rating: "4.9",
      reviews: "(411)",
      shipping: "Free delivery",
      discount: "LOW PRICE",
      accent: "from-[#f6efe6] to-[#ead7be]",
      art: "RC",
      image: "/watch-images/ralph-christian-intrepid.svg",
      id: ""
    },
    {
      kind: "watch",
      name: "Timex Men's Round Dial Analog Watch",
      price: "₹429.00",
      oldPrice: "₹529",
      brand: "Amazon.in & more",
      seller: "Amazon.in & more",
      rating: "4.8",
      reviews: "(10K)",
      shipping: "Free delivery",
      discount: "LOW PRICE",
      accent: "from-[#f3f4ef] to-[#dfe4d9]",
      art: "AW",
      image: "/watch-images/apple-watch-series-11.svg",
      id: ""
    },
    {
      kind: "watch",
      name: "CASIO Edifice Men Digital Watch",
      price: "₹440.00",
      oldPrice: "₹550",
      brand: "Amazon.in",
      seller: "Amazon.in",
      rating: "4.1",
      reviews: "(39)",
      shipping: "Free delivery",
      discount: "LOW PRICE",
      accent: "from-[#eff1f4] to-[#d7dbe2]",
      art: "MV",
      image: "/watch-images/movado-bold-evolution.svg",
      id: ""
    },
    {
      kind: "watch",
      name: "Noise Twist 2 Smartwatch",
      price: "₹156.00",
      oldPrice: "₹195",
      brand: "Noise",
      seller: "Noise",
      rating: "4.2",
      reviews: "(14)",
      shipping: "Free delivery",
      discount: "LOW PRICE",
      accent: "from-[#f5efe4] to-[#dcc69f]",
      art: "F2",
      image: "/watch-images/watch.webp",
      id: ""
    },
  ],
  Electronics: [
    {
      name: "Amazon Echo Show 5 Smart Display",
      price: "₹69.99",
      oldPrice: "₹90",
      brand: "Home Depot & more",
      seller: "Home Depot & more",
      rating: "4.6",
      reviews: "(5.6K)",
      shipping: "Free next-day delivery",
      discount: "22% OFF",
      accent: "from-[#eef0f2] to-[#d7dde5]",
      art: "ECHO5",
      kind: "electronics",
      image: "/electronics/e8.webp",
      id: ""
    },
    {
      name: "Amazon Echo Dot Smart Speaker with Alexa",
      price: "₹39.99",
      oldPrice: "₹50",
      brand: "Best Buy & more",
      seller: "Best Buy & more",
      rating: "4.7",
      reviews: "(20K)",
      shipping: "Free delivery by Sat",
      discount: "20% OFF",
      accent: "from-[#eff4fb] to-[#d5e0ef]",
      art: "DOT",
      kind: "electronics",
      image: "/electronics/e3.webp",
      id: ""
    },
    {
      name: "Google TV Streamer",
      price: "₹69.99",
      oldPrice: "₹100",
      brand: "Best Buy & more",
      seller: "Best Buy & more",
      rating: "4.3",
      reviews: "(11K)",
      shipping: "Pre-owned",
      discount: "30% OFF",
      accent: "from-[#f4f2ee] to-[#e6e0d6]",
      art: "TV",
      kind: "electronics",
      image: "/electronics/e5.webp",
      id: ""
    },
    {
      name: "Amazon Echo Show 11 Smart Display",
      price: "₹169.99",
      oldPrice: "₹220",
      brand: "Electronics & more",
      seller: "Electronics & more",
      rating: "4.6",
      reviews: "(351)",
      shipping: "Free delivery",
      discount: "22% OFF",
      accent: "from-[#eef0f3] to-[#dfe3ea]",
      art: "ECHO11",
      kind: "electronics",
      image: "/electronics/e6.webp",
      id: ""
    },
    {
      name: "Apple AirTag",
      price: "₹16.50",
      oldPrice: "₹29",
      brand: "Best Buy & more",
      seller: "Best Buy & more",
      rating: "4.8",
      reviews: "(65K)",
      shipping: "Free delivery",
      discount: "43% OFF",
      accent: "from-[#f5f5f5] to-[#e5e5e5]",
      art: "TAG",
      kind: "electronics",
      image: "/electronics/e4.webp",
      id: ""
    },
    {
      name: "JBL Charge 6 Portable Speaker",
      price: "₹161.34",
      oldPrice: "₹190",
      brand: "Excellent & more",
      seller: "Excellent & more",
      rating: "4.7",
      reviews: "(1.2K)",
      shipping: "Free delivery",
      discount: "15% OFF",
      accent: "from-[#f2f2f0] to-[#dbdbd8]",
      art: "JBL",
      kind: "electronics",
      image: "/electronics/e2.webp",
      id: ""
    },
    {
      name: "Roku Streaming Stick HD",
      price: "₹26.99",
      oldPrice: "₹30",
      brand: "Macy's & more",
      seller: "Macy's & more",
      rating: "4.8",
      reviews: "(9K)",
      shipping: "Free delivery",
      discount: "9% OFF",
      accent: "from-[#f0ebff] to-[#d8cbff]",
      art: "ROKU",
      kind: "electronics",
      image: "/electronics/e7.webp",
      id: ""
    },
    {
      name: "Microsoft Xbox Series X Console",
      price: "₹449.99",
      oldPrice: "₹480",
      brand: "Secret Cart",
      seller: "Secret Cart",
      rating: "4.7",
      reviews: "(1.8K)",
      shipping: "Free delivery",
      discount: "6% OFF",
      accent: "from-[#efefef] to-[#d8d8d8]",
      art: "XBOX",
      kind: "electronics",
      image: "/electronics/e1.webp",
      id: ""
    },
  ],
  "PS Stores": [
    {
      kind: "psstore",
      name: "Sony PlayStation Plus",
      price: "₹3,949",
      oldPrice: "₹4,499",
      brand: "PlayStation & more",
      seller: "PlayStation & more",
      rating: "4.9",
      reviews: "(8K)",
      shipping: "Free next-day delivery",
      discount: "ESSENTIAL",
      accent: "from-[#f2f2f0] to-[#e6e6e2]",
      art: "PS+1",
      image: "/ps-store/psplus-essential.webp",
      id: ""
    },
    {
      kind: "psstore",
      name: "God Of War Digital...",
      price: "₹1,999",
      oldPrice: "₹2,499",
      brand: "PlayStation Store",
      seller: "PlayStation Store",
      rating: "5.0",
      reviews: "(10)",
      shipping: "Free next-day delivery",
      discount: "LOW PRICE",
      accent: "from-[#243746] to-[#0d1116]",
      art: "GOW",
      image: "/ps-store/god-of-war.webp",
      id: ""
    },
    {
      kind: "psstore",
      name: "Grand Theft Auto Online",
      price: "₹1,669",
      oldPrice: "₹1,999",
      brand: "PlayStation Store",
      seller: "PlayStation Store",
      rating: "4.7",
      reviews: "(50K)",
      shipping: "Free next-day delivery",
      discount: "LOW PRICE",
      accent: "from-[#2c1d2d] to-[#101014]",
      art: "GTA",
      image: "/ps-store/gta-online.webp",
      id: ""
    },
    {
      kind: "psstore",
      name: "PlayStation Plus Extra...",
      price: "₹6,699",
      oldPrice: "₹7,299",
      brand: "PlayStation Store",
      seller: "PlayStation Store",
      rating: "5.0",
      reviews: "(1)",
      shipping: "Free next-day delivery",
      discount: "EXTRA",
      accent: "from-[#ffe24a] to-[#f0c200]",
      art: "PS+2",
      image: "/ps-store/ghost-of-tsushima.webp",
      id: ""
    },
    {
      kind: "psstore",
      name: "Cricket 26 - The Offici...",
      price: "₹4,399",
      oldPrice: "₹4,999",
      brand: "PlayStation Store",
      seller: "PlayStation Store",
      rating: "4.0",
      reviews: "(11)",
      shipping: "Free next-day delivery",
      discount: "LOW PRICE",
      accent: "from-[#1f2430] to-[#08111a]",
      art: "CR26",
      image: "/ps-store/little-nightmares.webp",
      id: ""
    },
    {
      kind: "psstore",
      name: "Marvel's Spider-Man...",
      price: "â‚¹3,999",
      oldPrice: "â‚¹4,499",
      brand: "PlayStation Store",
      seller: "PlayStation Store",
      rating: "4.7",
      reviews: "(11K)",
      shipping: "Free next-day delivery",
      discount: "LOW PRICE",
      accent: "from-[#1d2436] to-[#0a0d15]",
      art: "SPM",
      image: "/ps-store/spider-man-miles-morales.webp",
      id: ""
    },
    {
      kind: "psstore",
      name: "The Last of Us Part II",
      price: "â‚¹2,499",
      oldPrice: "â‚¹2,999",
      brand: "PlayStation Store",
      seller: "PlayStation Store",
      rating: "4.8",
      reviews: "(15K)",
      shipping: "Free next-day delivery",
      discount: "LOW PRICE",
      accent: "from-[#0c1018] to-[#050608]",
      art: "TLU2",
      image: "/ps-store/last-of-us-part-ii.webp",
      id: ""
    },
  ],
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-stone-400">
      <path
        fill="currentColor"
        d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm8.2 12.8-3.4-3.4 1.4-1.4 3.4 3.4-1.4 1.4Z"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-stone-700">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        d="M12 20.5s-7.5-4.7-9.3-9.2C1.3 7.7 3.3 5 6.4 5c1.8 0 3 .8 3.9 2.1C11.2 5.8 12.4 5 14.2 5c3.1 0 5.1 2.7 3.7 6.3C19.5 15.8 12 20.5 12 20.5Z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-stone-700">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        d="M6.5 8h11l-.9 11.5a1.5 1.5 0 0 1-1.5 1.3H8.9a1.5 1.5 0 0 1-1.5-1.3L6.5 8Zm2-1a3.5 3.5 0 0 1 7 0"
      />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className="h-11 w-11 text-stone-900">
      <path
        d="M36 30c-7 9-9 21-7 31 2 10 8 18 14 23 5 4 11 6 17 7-4-10-2-22 4-33 5-9 11-16 11-27 0-11-7-18-16-18-8 0-16 6-23 17Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M84 30c7 9 9 21 7 31-2 10-8 18-14 23-5 4-11 6-17 7 4-10 2-22-4-33-5-9-11-16-11-27 0-11 7-18 16-18 8 0 16 6 23 17Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 30c-4 7-5 17-2 27 3 10 3 23 0 33"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M50 22c-1 8 3 16 9 21 5-7 5-15-2-21-2-2-5-2-7 0Z" fill="currentColor" />
      <path d="M70 22c1 8-3 16-9 21-5-7-5-15 2-21 2-2 5-2 7 0Z" fill="currentColor" />
    </svg>
  );
}

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  if (product.kind === "electronics") {
    return <ElectronicsCard product={product} onClick={onClick} />;
  }
  if (product.kind === "psstore") {
    return <PSStoreCard product={product} onClick={onClick} />;
  }
  if (product.kind === "watch") {
    return <WatchCard product={product} onClick={onClick} />;
  }
  if (product.kind === "accessory") {
    return <AccessoryCard product={product} onClick={onClick} />;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-[430px] flex-col rounded-[1.75rem] border border-stone-200 bg-white p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`relative flex h-[290px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${product.accent}`}>
        <span className="absolute left-4 top-4 rounded-lg bg-white px-3 py-1.5 text-[0.95rem] font-medium tracking-tight text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.14)]">
          {product.discount}
        </span>
        <div className="relative flex h-[168px] w-[114px] items-center justify-center rounded-[2.3rem] bg-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]">
          <div className="absolute inset-0 rounded-[2.3rem] bg-white/12 blur-[1px]" />
          <div className="relative flex h-[150px] w-[96px] items-center justify-center rounded-[2rem] bg-[#fffaf0] shadow-[0_22px_45px_rgba(0,0,0,0.08)] ring-1 ring-white/80">
            <div className="text-center text-[1.9rem] font-medium tracking-[0.08em] text-stone-700">
              {product.art}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1 pb-1">
        <h3 className="line-clamp-2 min-h-[3.1rem] max-w-[225px] text-[1.12rem] leading-[1.25] text-[#1749ff] transition group-hover:text-blue-700">
          {product.name}
        </h3>
        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-[1.15rem] font-semibold text-emerald-700">{product.price}</p>
          <p className="text-[0.95rem] text-stone-500 line-through">{product.oldPrice}</p>
        </div>
        <p className="mt-2 text-[0.95rem] text-stone-500">{product.brand}</p>
        <div className="mt-2 flex items-center gap-2 text-[0.95rem] text-stone-600">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-stone-100 text-[0.9rem] font-semibold text-stone-900">
            {product.seller.slice(0, 1).toUpperCase()}
          </span>
          <span>{product.seller}</span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[0.95rem] text-stone-500">
          <span>{product.shipping}</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[0.95rem] text-stone-600">
          <span>{product.rating}</span>
          <span className="text-amber-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span>{product.reviews}</span>
        </div>
      </div>
    </button>
  );
}

function PSStoreCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-[340px] flex-col rounded-[1.2rem] bg-white text-left transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`relative flex h-[160px] items-center justify-center overflow-hidden rounded-[1.2rem] bg-gradient-to-br ${product.accent}`}
      >
        <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          {product.discount}
        </span>
        <PSStoreVisual kind={product.art} />
      </div>

      <div className="px-1 pt-2">
        <h3 className="line-clamp-2 min-h-[3rem] text-[0.98rem] leading-[1.25] text-stone-900 transition group-hover:text-blue-700">
          {product.name}
        </h3>
        <p className="mt-1 text-[1.02rem] text-stone-900">{product.price}</p>
        <p className="mt-1 text-[0.92rem] text-stone-600">{product.brand}</p>
        <div className="mt-1 text-[0.92rem] text-stone-500">{product.shipping}</div>
        <div className="mt-1 flex items-center gap-1 text-[0.9rem] text-stone-600">
          <span>{product.rating}</span>
          <span className="text-amber-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span>{product.reviews}</span>
        </div>
      </div>
    </button>
  );
}

function PSStoreVisual({ kind }: { kind: string }) {
  switch (kind) {
    case "PS+1":
      return (
        <div className="relative flex h-[138px] w-[138px] items-center justify-center">
          <div className="absolute inset-0 rounded-[1.2rem] border border-stone-200 bg-white" />
          <div className="absolute top-4 text-[0.8rem] font-semibold tracking-[0.32em] text-stone-900">ESSENTIAL</div>
          <div className="absolute top-10 text-[0.95rem] font-medium text-stone-900">12 Months</div>
          <div className="absolute bottom-5 text-[4rem] font-black text-[#f0c300]">PLUS</div>
        </div>
      );
    case "PS+2":
      return (
        <div className="relative flex h-[138px] w-[138px] items-center justify-center">
          <div className="absolute inset-0 rounded-[1.2rem] border border-[#f1d14d] bg-[#111111]" />
          <div className="absolute top-4 text-[0.8rem] font-semibold tracking-[0.32em] text-[#f1d14d]">DELUXE</div>
          <div className="absolute top-10 text-[0.95rem] font-medium text-[#f1d14d]">12 Months</div>
          <div className="absolute bottom-5 text-[4rem] font-black text-[#f1d14d]">PLUS</div>
        </div>
      );
    case "GOW":
      return (
        <div className="relative h-[138px] w-[138px] overflow-hidden rounded-[1.2rem] bg-[radial-gradient(circle_at_50%_45%,#708090_0%,#1a2028_55%,#090b0f_100%)]">
          <div className="absolute inset-x-0 bottom-0 h-10 bg-[linear-gradient(180deg,transparent,#000)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.22),transparent_36%)]" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.95rem] font-bold tracking-[0.2em] text-white">
            GOD OF WAR
          </div>
        </div>
      );
    case "GTA":
      return (
        <div className="relative h-[138px] w-[138px] overflow-hidden rounded-[1.2rem] bg-[linear-gradient(180deg,#2a2940,#101014)]">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
            <div className="rounded-lg bg-[linear-gradient(135deg,#f5d06a,#a81e2e)]" />
            <div className="rounded-lg bg-[linear-gradient(135deg,#6fc4ff,#214b7a)]" />
            <div className="rounded-lg bg-[linear-gradient(135deg,#fbd46d,#2a8f3d)]" />
            <div className="rounded-lg bg-[linear-gradient(135deg,#a74eb9,#1f1d42)]" />
          </div>
          <div className="absolute inset-x-0 top-8 text-center text-[0.95rem] font-black tracking-[0.08em] text-white drop-shadow">
            grand theft auto online
          </div>
        </div>
      );
    case "CR26":
      return (
        <div className="relative h-[138px] w-[138px] overflow-hidden rounded-[1.2rem] bg-[radial-gradient(circle_at_50%_42%,#f05b2d_0%,#1a1a1d_52%,#090a0d_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_38%)]" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[1.1rem] font-extrabold tracking-[0.16em] text-white">
            CRICKET 26
          </div>
        </div>
      );
    default:
      return <div className="h-[138px] w-[138px]" />;
  }
}

function AccessoryCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-[360px] flex-col rounded-[1.5rem] bg-white text-left transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`relative flex h-[178px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${product.accent}`}
      >
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[0.78rem] font-medium tracking-tight text-stone-800 shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
          {product.discount}
        </span>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover p-2"
          />
        ) : (
          <AccessoryVisual kind={product.art} />
        )}
      </div>

      <div className="px-1 pt-3">
        <h3 className="line-clamp-2 min-h-[3.1rem] text-[1rem] leading-[1.28] text-stone-800 transition group-hover:text-blue-700">
          {product.name}
        </h3>
        <p className="mt-2 text-[1rem] font-semibold text-stone-900">{product.price}</p>
        <p className="mt-1 text-[0.92rem] text-stone-500">{product.brand}</p>
        <div className="mt-1 text-[0.92rem] text-stone-500">{product.shipping}</div>
      </div>
    </button>
  );
}

function AccessoryVisual({ kind }: { kind: string }) {
  switch (kind) {
    case "D1":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[32px] h-[92px] w-[92px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#4b3a2b_0%,#1a120d_70%)]" />
          <div className="absolute left-1/2 top-[10px] h-[78px] w-[124px] -translate-x-1/2 rounded-[2rem] border border-stone-500 bg-[linear-gradient(180deg,#6f7c8f,#2f3640)] shadow-[0_12px_26px_rgba(0,0,0,0.08)]" />
        </div>
      );
    case "H1":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[30px] h-[100px] w-[100px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_30%,#d4a86a_0%,#7d5532_72%)] opacity-70" />
          <div className="absolute left-1/2 top-[12px] h-[88px] w-[98px] -translate-x-1/2 rounded-[2rem] bg-[linear-gradient(180deg,#efe6d3,#c8a96f)] shadow-[0_12px_26px_rgba(0,0,0,0.08)]" />
        </div>
      );
    case "D2":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[28px] h-[98px] w-[98px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#edf3fb_0%,#c8d5ea_72%)]" />
          <div className="absolute left-1/2 top-[12px] h-[78px] w-[120px] -translate-x-1/2 rounded-full border border-white/70 bg-white/30" />
        </div>
      );
    case "G1":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[28px] h-[102px] w-[126px] -translate-x-1/2 rounded-[1.8rem] bg-[linear-gradient(180deg,#e6f1e2,#b7d3b3)]" />
          <div className="absolute left-1/2 top-[8px] h-[90px] w-[90px] -translate-x-1/2 rounded-full bg-[#6c6a2c] opacity-70" />
        </div>
      );
    case "S1":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[28px] h-[102px] w-[102px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7e7d9_0%,#d79f68_72%)]" />
          <div className="absolute left-1/2 top-[10px] h-[90px] w-[90px] -translate-x-1/2 rounded-[2rem] border border-stone-300 bg-[linear-gradient(180deg,#fff6ef,#efd3b6)] shadow-[0_12px_26px_rgba(0,0,0,0.08)]" />
        </div>
      );
    case "LB":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[16px] h-[120px] w-[18px] -translate-x-1/2 rounded-full bg-[#d9c26a]" />
          <div className="absolute left-1/2 top-[44px] h-[72px] w-[72px] -translate-x-1/2 rounded-full border border-stone-200 bg-[radial-gradient(circle_at_35%_30%,#f7f0ba_0%,#c7ae51_72%)]" />
        </div>
      );
    case "67":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[8px] h-[128px] w-[112px] -translate-x-1/2 rounded-full border border-stone-200 bg-[radial-gradient(circle_at_50%_25%,#f3eefc_0%,#d6cbe7_72%)]" />
          <div className="absolute left-1/2 top-[30px] h-[86px] w-[86px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f8f5ff_0%,#c8bddb_72%)]" />
        </div>
      );
    case "B1":
      return (
        <div className="relative h-[168px] w-full">
          <div className="absolute left-1/2 top-[28px] h-[98px] w-[98px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ccecff_0%,#83c4e8_72%)]" />
          <div className="absolute left-1/2 top-[8px] h-[124px] w-[20px] -translate-x-1/2 rounded-full bg-[#d5dce7]" />
        </div>
      );
    default:
      return <div className="h-[168px] w-full" />;
  }
}

function ElectronicsCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full flex-col rounded-[1.25rem] bg-white p-2 text-left shadow-[0_1px_0_rgba(0,0,0,0.03)] ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className={`relative flex h-48 items-center justify-center overflow-hidden rounded-[1rem] bg-gradient-to-br ${product.accent}`}>
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[0.9rem] font-semibold tracking-tight text-stone-700 shadow-sm">
          {product.discount}
        </span>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <ElectronicsVisual kind={product.art} />
        )}
      </div>

      <div className="px-0 pt-3">
        <h3 className="line-clamp-2 min-h-[3.2rem] text-[1.05rem] leading-tight text-blue-700 underline decoration-transparent underline-offset-2 transition group-hover:decoration-blue-700">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-lg font-semibold text-emerald-700">{product.price}</p>
          <p className="text-sm text-stone-500 line-through">{product.oldPrice}</p>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm bg-amber-400 text-[0.65rem] font-bold text-white">
            {product.brand.slice(0, 1)}
          </span>
          <span>{product.brand}</span>
        </p>
        <div className="mt-1 text-sm text-stone-500">{product.shipping}</div>
        <div className="mt-1 flex items-center gap-1 text-sm text-stone-600">
          <span>{product.rating}</span>
          <span className="text-amber-500">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span>{product.reviews}</span>
        </div>
      </div>
    </button>
  );
}

function WatchCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-[470px] flex-col bg-white text-left transition hover:-translate-y-1"
    >
      <div
        className={`relative flex h-[230px] items-center justify-center overflow-hidden rounded-[1rem] bg-white ${product.accent}`}
      >
        <span className="absolute left-3 top-3 rounded-lg bg-white px-3 py-1.5 text-[0.92rem] font-semibold tracking-tight text-stone-800 shadow-[0_1px_3px_rgba(0,0,0,0.14)]">
          {product.discount}
        </span>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover p-2"
          />
        ) : (
          <WatchVisual kind={product.art} />
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-3">
        <h3 className="line-clamp-2 min-h-[3.6rem] max-w-[210px] text-[1.08rem] leading-[1.35] text-stone-900 transition group-hover:text-blue-700">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-[1.08rem] font-semibold text-emerald-700">{product.price}</p>
          <p className="text-[0.98rem] text-stone-500 line-through">{product.oldPrice}</p>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[0.95rem] text-stone-600">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-[0.2rem] bg-amber-400 text-[0.68rem] font-bold text-white">
            a
          </span>
          <span>{product.seller}</span>
        </div>

        <div className="mt-2 text-[0.95rem] text-stone-600">{product.shipping}</div>
        <div className="mt-1 flex items-center gap-1 text-[0.95rem] text-stone-600">
          <span>{product.rating}</span>
          <span className="text-amber-500">★★★★★</span>
          <span>{product.reviews}</span>
        </div>
      </div>
    </button>
  );
}

function WatchVisual({ kind }: { kind: string }) {
  switch (kind) {
    case "F1":
      return (
        <div className="relative flex h-[210px] w-[150px] items-center justify-center">
          <div className="absolute top-1 h-[188px] w-[56px] rounded-[1.4rem] bg-[linear-gradient(180deg,#e8e8ea,#bdbfc4)] shadow-[0_16px_26px_rgba(0,0,0,0.08)]" />
          <div className="absolute top-[18px] h-[132px] w-[132px] rounded-full border-[10px] border-[#76787d] bg-[#17181c] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.04)]" />
          <div className="absolute top-[36px] h-[96px] w-[96px] rounded-full border border-[#233a5f] bg-[radial-gradient(circle_at_50%_50%,#2d67aa_0%,#12243c_75%)]" />
          <div className="absolute top-[68px] h-[34px] w-[34px] rounded-full border-[6px] border-[#274b7c] bg-[#0f1724]" />
        </div>
      );
    case "RC":
      return (
        <div className="relative flex h-[210px] w-[150px] items-center justify-center">
          <div className="absolute top-1 h-[184px] w-[54px] rounded-[1.3rem] bg-[linear-gradient(180deg,#946247,#6a412f)] shadow-[0_16px_26px_rgba(0,0,0,0.08)]" />
          <div className="absolute top-[20px] h-[128px] w-[128px] rounded-full border-[10px] border-[#2d2f33] bg-[#16202d] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.04)]" />
          <div className="absolute top-[40px] h-[88px] w-[88px] rounded-full border border-[#33455e] bg-[radial-gradient(circle_at_50%_50%,#243244_0%,#11161f_72%)]" />
          <div className="absolute top-[69px] h-[24px] w-[24px] rounded-full border-[5px] border-[#d4b36b] bg-[#f3d98a]" />
        </div>
      );
    case "AW":
      return (
        <div className="relative flex h-[210px] w-[170px] items-center justify-center">
          <div className="absolute left-[26px] top-[14px] h-[182px] w-[118px] rounded-[2rem] bg-[#f3f3f0] shadow-[0_16px_26px_rgba(0,0,0,0.08)]" />
          <div className="absolute left-[56px] top-[24px] h-[156px] w-[58px] rounded-[1.2rem] bg-[linear-gradient(180deg,#d7e8f7,#9ed4f4)]" />
          <div className="absolute left-[44px] top-[40px] h-[24px] w-[84px] rounded-full bg-[#1b1f25]" />
          <div className="absolute left-[76px] top-[54px] h-[78px] w-[18px] rounded-full bg-[#d7e7fa]" />
        </div>
      );
    case "MV":
      return (
        <div className="relative flex h-[210px] w-[150px] items-center justify-center">
          <div className="absolute top-1 h-[184px] w-[54px] rounded-[1.3rem] bg-[linear-gradient(180deg,#9a623f,#603829)] shadow-[0_16px_26px_rgba(0,0,0,0.08)]" />
          <div className="absolute top-[20px] h-[128px] w-[128px] rounded-full border-[10px] border-[#2d2f33] bg-[#121417] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.04)]" />
          <div className="absolute top-[40px] h-[88px] w-[88px] rounded-full border border-[#1f2126] bg-[radial-gradient(circle_at_50%_50%,#373d45_0%,#171a1f_72%)]" />
        </div>
      );
    case "F2":
      return (
        <div className="relative flex h-[210px] w-[150px] items-center justify-center">
          <div className="absolute top-1 h-[184px] w-[54px] rounded-[1.3rem] bg-[linear-gradient(180deg,#f7d76f,#d4b952)] shadow-[0_16px_26px_rgba(0,0,0,0.08)]" />
          <div className="absolute top-[20px] h-[128px] w-[128px] rounded-full border-[10px] border-[#44484d] bg-[#0f1014] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.04)]" />
          <div className="absolute top-[40px] h-[88px] w-[88px] rounded-full border border-[#54585d] bg-[radial-gradient(circle_at_50%_50%,#202329_0%,#090a0d_72%)]" />
        </div>
      );
    default:
      return (
        <div className="relative flex h-[210px] w-[150px] items-center justify-center">
          <div className="rounded-[2rem] bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm">
            Watch
          </div>
        </div>
      );
  }
}

function ElectronicsVisual({ kind }: { kind: string }) {
  switch (kind) {
    case "ECHO5":
      return (
        <div className="relative h-36 w-40 rounded-3xl bg-[#22262d] shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
          <div className="absolute left-3 top-4 h-20 w-32 rounded-xl bg-[linear-gradient(180deg,#9fd2ee,#6e95bb_55%,#5a606a)] opacity-85" />
          <div className="absolute bottom-4 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-emerald-200/80 blur-[1px]" />
        </div>
      );
    case "DOT":
      return (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="h-36 w-36 rounded-full bg-[#17191d] shadow-[0_30px_60px_rgba(0,0,0,0.18)]" />
          <div className="absolute bottom-5 h-2 w-24 rounded-full bg-sky-400/80 blur-[1px]" />
        </div>
      );
    case "TV":
      return (
        <div className="relative flex h-36 w-40 items-center justify-center">
          <div className="h-18 w-32 rounded-2xl bg-[#f1ede7] shadow-[0_20px_35px_rgba(0,0,0,0.12)]" />
          <div className="absolute right-4 top-16 h-18 w-10 rotate-12 rounded-lg bg-white shadow-md" />
        </div>
      );
    case "ECHO11":
      return (
        <div className="relative h-36 w-40 rounded-3xl bg-[#1f2329] shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
          <div className="absolute left-4 top-4 h-20 w-32 rounded-xl bg-[#3c424c]" />
          <div className="absolute bottom-3 left-1/2 h-2 w-20 -translate-x-1/2 rounded-full bg-stone-300/80" />
        </div>
      );
    case "TAG":
      return (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="h-30 w-30 rounded-full border border-stone-200 bg-white shadow-[0_25px_45px_rgba(0,0,0,0.12)]" />
          <div className="absolute h-16 w-16 rounded-full bg-stone-900" />
          <div className="absolute top-4 h-5 w-5 rounded-full border-2 border-stone-300 bg-white" />
        </div>
      );
    case "JBL":
      return (
        <div className="relative flex h-36 w-40 items-center justify-center">
          <div className="h-16 w-32 rounded-3xl bg-[#ebece8] shadow-[0_18px_35px_rgba(0,0,0,0.12)]" />
          <div className="absolute text-2xl font-black tracking-[0.2em] text-orange-500">JBL</div>
        </div>
      );
    case "ROKU":
      return (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute left-6 top-6 h-28 w-12 rounded-2xl bg-[#27212f] shadow-lg" />
          <div className="absolute right-6 top-10 h-26 w-16 rounded-2xl bg-[#7f3ae7]" />
          <div className="absolute bottom-4 h-4 w-28 rounded-md bg-[#2d1d4d]" />
        </div>
      );
    case "XBOX":
      return (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="h-32 w-18 rounded-lg bg-[#202124] shadow-[0_24px_45px_rgba(0,0,0,0.16)]" />
          <div className="absolute top-4 h-2 w-8 rounded-full bg-stone-500" />
        </div>
      );
    default:
      return (
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="rounded-3xl bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm">
            {kind}
          </div>
        </div>
      );
  }
}

function FooterIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 text-[0.68rem] font-semibold text-white">
      {label}
    </span>
  );
}

function ProductDetailsModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const description =
    product.kind === "watch"
      ? "A featured watch pick with a clean display, everyday wearability, and a premium look."
      : product.kind === "accessory"
        ? "A selected accessory with a polished finish and a style-led design suitable for daily wear."
        : product.kind === "electronics"
          ? "A practical and popular electronics item chosen for convenience, utility, and modern styling."
          : "A highlighted product from the collection with balanced design and strong value.";

  const specifications = [
    `Category: ${product.kind ? product.kind.charAt(0).toUpperCase() + product.kind.slice(1) : "General"}`,
    `Brand: ${product.brand}`,
    `Seller: ${product.seller}`,
    `Shipping: ${product.shipping}`,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-stone-900">Product Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Close
          </button>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-[240px_1fr]">
          <div className="rounded-[1.25rem] bg-stone-50 p-4">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-56 w-full object-contain" />
            ) : (
              <div className="flex h-56 items-center justify-center rounded-[1rem] bg-gradient-to-br from-stone-100 to-stone-200 text-2xl font-bold text-stone-500">
                {product.art}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">{product.brand}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{product.name}</h3>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-emerald-700">{product.price}</span>
              <span className="text-lg text-stone-500 line-through">{product.oldPrice}</span>
            </div>
            <div className="mt-5 rounded-[1.1rem] bg-stone-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Description
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{description}</p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.1rem] border border-stone-200 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Specifications
                </p>
                <ul className="mt-3 space-y-2 text-sm text-stone-700">
                  {specifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.1rem] border border-stone-200 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Rating
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-3xl font-bold text-stone-900">{product.rating}</span>
                  <div className="text-amber-500">★★★★★</div>
                  <span className="text-sm text-stone-500">{product.reviews}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-[1.1rem] border border-stone-200 p-4">
              <div className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
                <p><span className="font-medium text-stone-800">MRP:</span> {product.oldPrice}</p>
                <p><span className="font-medium text-stone-800">Price:</span> {product.price}</p>
                <p><span className="font-medium text-stone-800">Seller:</span> {product.seller}</p>
                <p><span className="font-medium text-stone-800">Shipping:</span> {product.shipping}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Accessories");
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentUser, setCurrentUser] = useState("");
  const router = useRouter();

  const products = useMemo(() => categoryProducts[activeCategory] ?? [], [activeCategory]);
  const slide = featuredSlides[activeSlide % featuredSlides.length];

  const openProduct = (product: Product, index: number) => {
    const slug = `${activeCategory}-${product.name}-${index}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    router.push(`/product/${slug}`);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % featuredSlides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncCurrentUser = () => {
      try {
        const stored = window.localStorage.getItem("fixx-current-user");
        setCurrentUser(stored ?? "");
      } catch {
        setCurrentUser("");
      }
    };

    syncCurrentUser();
    window.addEventListener("storage", syncCurrentUser);

    return () => {
      window.removeEventListener("storage", syncCurrentUser);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-stone-900">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-2 sm:px-6 lg:px-8">
          <a href="#" className="flex shrink-0 items-center">
            <LogoMark />
          </a>

          <div className="flex justify-center">
            <label className="hidden h-10 w-full max-w-[420px] items-center gap-2 rounded-md bg-stone-100 px-3 text-sm text-stone-500 ring-1 ring-transparent transition focus-within:ring-stone-300 md:flex">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search by product, category or collection"
                className="w-full bg-transparent outline-none placeholder:text-stone-400"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden h-7 w-px bg-stone-200 sm:block" />
            <a href="/login" className="text-sm font-medium text-stone-700 hover:text-black">
              {currentUser ? currentUser : "Login"}
            </a>
            <button
              type="button"
              aria-label="Wishlist"
              onClick={() => router.push("/wishlist")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone-100"
            >
              <HeartIcon />
            </button>
            <button
              type="button"
              aria-label="Cart"
              onClick={() => router.push("/cart")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-stone-100"
            >
              <BagIcon />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200 bg-white">
          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap px-2 text-lg font-medium text-stone-800">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="relative py-4 transition hover:text-black"
              >
                {category}
                {activeCategory === category && (
                  <span className="absolute inset-x-0 -bottom-[1px] mx-auto h-1 w-28 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                Featured collection
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {activeCategory === "Accessories"
                  ? "Accessories like the screenshot"
                  : `${activeCategory} picks`}
              </h1>
            </div>
            <p className="hidden max-w-md text-right text-sm text-stone-500 md:block">
              Clicking a category swaps the content below. Accessories shows the jewelry-style grid.
            </p>
          </div>

          <div className="mb-6 rounded-[2rem] border border-stone-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className={`relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-4 sm:p-5 ${slide.accent}`}>
              <div className="grid items-center gap-4 md:grid-cols-[1.05fr_1fr]">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
                    Featured collection
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="max-w-md text-sm text-stone-600">{slide.subtitle}</p>
                  <div className="flex items-center gap-2 pt-2">
                    {featuredSlides.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Show featured slide ${index + 1}`}
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 rounded-full transition ${index === activeSlide ? "w-8 bg-stone-900" : "w-2.5 bg-stone-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-[220px] w-full max-w-[540px] rounded-[1.4rem] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
                  />
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => setActiveSlide((activeSlide - 1 + featuredSlides.length) % featuredSlides.length)}
                    className="absolute left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-semibold text-stone-800 shadow-md transition hover:bg-white"
                  >
                    {"<"}
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => setActiveSlide((activeSlide + 1) % featuredSlides.length)}
                    className="absolute right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-semibold text-stone-800 shadow-md transition hover:bg-white"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={`${activeCategory}-${product.name}-${index}`}
                product={product}
                onClick={() => openProduct(product, index)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-12 bg-[#172337] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8 xl:grid-cols-[repeat(4,minmax(0,1fr))_1.4fr_1.5fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-white/45">About</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Flipkart Stories</a></li>
              <li><a href="#" className="hover:underline">Press</a></li>
              <li><a href="#" className="hover:underline">Corporate Information</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-white/45">Group Companies</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Myntra</a></li>
              <li><a href="#" className="hover:underline">Cleartrip</a></li>
              <li><a href="#" className="hover:underline">Shopsy</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-white/45">Help</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Payments</a></li>
              <li><a href="#" className="hover:underline">Shipping</a></li>
              <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-white/45">Consumer Policy</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="#" className="hover:underline">Cancellation & Returns</a></li>
              <li><a href="#" className="hover:underline">Terms Of Use</a></li>
              <li><a href="#" className="hover:underline">Security</a></li>
              <li><a href="#" className="hover:underline">Privacy</a></li>
              <li><a href="#" className="hover:underline">Sitemap</a></li>
              <li><a href="#" className="hover:underline">Grievance Redressal</a></li>
              <li><a href="#" className="hover:underline">EPR Compliance</a></li>
              <li><a href="#" className="hover:underline">FSSAI Food Safety Connect App</a></li>
            </ul>
          </div>

          <div className="border-l border-white/15 pl-0 xl:pl-8">
            <p className="text-sm uppercase tracking-[0.14em] text-white/45">Mail Us:</p>
            <address className="mt-4 max-w-sm not-italic text-sm leading-6 text-white/90">
              Flipkart Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103,
              <br />
              Karnataka, India
            </address>
            <div className="mt-6">
              <p className="text-sm uppercase tracking-[0.14em] text-white/45">Social</p>
              <div className="mt-3 flex items-center gap-4">
                <FooterIcon label="f" />
                <FooterIcon label="x" />
                <FooterIcon label="P" />
                <FooterIcon label="I" />
              </div>
            </div>
          </div>

          <div className="xl:pl-4">
            <p className="text-sm uppercase tracking-[0.14em] text-white/45">Registered Office Address:</p>
            <address className="mt-4 max-w-sm not-italic text-sm leading-6 text-white/90">
              Flipkart Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103,
              <br />
              Karnataka, India
              <br />
              CIN : U51109KA2012PTC066107
              <br />
              Telephone: <a href="#" className="text-blue-400 hover:underline">044-45614700</a> / <a href="#" className="text-blue-400 hover:underline">044-67415800</a>
            </address>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-8 text-sm font-medium">
              <a href="#" className="inline-flex items-center gap-2 hover:underline">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#f5b800] text-[0.65rem] font-bold text-[#172337]">S</span>
                Become a Seller
              </a>
              <a href="#" className="inline-flex items-center gap-2 hover:underline">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f5b800] text-[0.65rem] font-bold text-[#172337]">A</span>
                Advertise
              </a>
              <a href="#" className="inline-flex items-center gap-2 hover:underline">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#f5b800] text-[0.65rem] font-bold text-[#172337]">G</span>
                Gift Cards
              </a>
              <a href="#" className="inline-flex items-center gap-2 hover:underline">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f5b800] text-[0.65rem] font-bold text-[#172337]">H</span>
                Help Center
              </a>
            </div>

            <p className="text-sm text-white/90">(c) 2007-2026 Flipkart.com</p>

            <div className="flex flex-wrap items-center gap-2">
              {["VISA", "MC", "MC2", "AMEX", "D", "DISCOVER", "RuPay", "Net Banking", "COD", "EMI"].map((label) => (
                <span
                  key={label}
                  className="inline-flex min-w-11 items-center justify-center rounded-sm bg-white px-2 py-1 text-[0.65rem] font-semibold text-stone-700"
                >
                  {label === "MC2" ? "MC" : label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
