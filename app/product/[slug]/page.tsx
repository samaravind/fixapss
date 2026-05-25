"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api, convexEnabled } from "../../../lib/convex";
import { buildSlug, catalog, type Product } from "../../page";

type ProductDoc = {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  price: string;
  oldPrice?: string;
  brand?: string;
  seller?: string;
  rating?: string;
  reviews?: string;
  shipping?: string;
  discount?: string;
  image?: string;
  images?: string[];
  badge?: string;
};

const WISHLIST_STORAGE_KEY = "fixx-wishlist";
const CART_STORAGE_KEY = "fixx-cart";

type WishlistItem = {
  name: string;
  price: string;
  image?: string;
  category: string;
  slug: string;
};

type CartItem = WishlistItem;

function prettifySlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatSavings(price?: string, oldPrice?: string) {
  if (!price || !oldPrice) {
    return "Save more with marketplace offers";
  }

  const current = Number(price.replace(/[^\d.]/g, ""));
  const original = Number(oldPrice.replace(/[^\d.]/g, ""));

  if (!Number.isFinite(current) || !Number.isFinite(original) || original <= current) {
    return "Save more with marketplace offers";
  }

  const savings = Math.round(((original - current) / original) * 100);
  return `${savings}% off compared to the list price`;
}

function IconWishlist({ active = false }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 transition ${active ? "text-[#2874f0]" : "text-[#2874f0]"}`}
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? "0" : "2.75"}
    >
      <path
        d="M12 20.2s-6.2-4-8.2-7.4C2 10 3.1 6.9 6.2 6.9c1.7 0 3 1 3.8 2 0.8-1 2.1-2 3.8-2 3.1 0 4.2 3.1 2.4 5.9-2 3.4-8.2 7.4-8.2 7.4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 4h2l2.2 9.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H7.1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 4 14h6l-1 8 11-13h-6l-1-7Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductImagePlaceholder() {
  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-[#edf4ff] via-[#eaf1ff] to-[#dfe9fc] p-6 shadow-[0_16px_45px_rgba(40,116,240,0.12)]">
      <div className="flex min-h-[380px] items-center justify-center rounded-[1.75rem] bg-white px-4 shadow-[inset_0_0_0_1px_rgba(40,116,240,0.04)] sm:min-h-[420px]">
        <span className="text-center text-[1.7rem] font-medium tracking-[0.24em] text-[#95a8c8] sm:text-[2rem]">
          Product Image
        </span>
      </div>
    </div>
  );
}

function ProductImageCard({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return <ProductImagePlaceholder />;
  }

  return (
    <div className="rounded-[2rem] bg-gradient-to-br from-[#edf4ff] via-[#eaf1ff] to-[#dfe9fc] p-6 shadow-[0_16px_45px_rgba(40,116,240,0.12)]">
      <div className="overflow-hidden rounded-[1.75rem] bg-white px-4 py-4 shadow-[inset_0_0_0_1px_rgba(40,116,240,0.04)]">
        <div className="flex min-h-[380px] items-center justify-center sm:min-h-[420px]">
          <Image
            src={src}
            alt={alt}
            width={900}
            height={900}
            className="h-full w-full max-h-[380px] object-contain sm:max-h-[420px]"
          />
        </div>
      </div>
    </div>
  );
}

type ResolvedProduct = {
  name: string;
  price: string;
  oldPrice?: string;
  brand?: string;
  seller?: string;
  rating?: string;
  reviews?: string;
  shipping?: string;
  discount?: string;
  image?: string;
  badge?: string;
  category: string;
  slug: string;
};

function mapStaticProduct(product: Product, category: string, slug: string): ResolvedProduct {
  return {
    ...product,
    category,
    slug,
  };
}

function mapLiveProduct(product: ProductDoc): ResolvedProduct {
  return {
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    brand: product.brand,
    seller: product.seller,
    rating: product.rating,
    reviews: product.reviews,
    shipping: product.shipping,
    discount: product.discount,
    image: product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined),
    badge: product.badge,
    category: product.categoryName,
    slug: product.slug,
  };
}

function findProductBySlug(slug: string): ResolvedProduct | null {
  for (const [category, items] of Object.entries(catalog)) {
    for (let index = 0; index < items.length; index += 1) {
      const product = items[index];
      if (buildSlug(category, product.name, index) === slug) {
        return mapStaticProduct(product, category, slug);
      }
    }
  }

  return null;
}

function findLocalProductBySlug(slug: string): ResolvedProduct | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("fixx-products");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const item = parsed.find((p: any) => {
      const itemSlug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return itemSlug === slug;
    });
    if (!item) return null;
    
    return {
      name: item.name,
      price: item.price,
      oldPrice: item.oldPrice,
      brand: item.brand,
      seller: item.seller,
      rating: item.rating,
      reviews: item.reviews,
      shipping: item.shipping,
      discount: item.discount,
      image: item.image || (item.images && item.images.length > 0 ? item.images[0] : undefined),
      badge: item.badge,
      category: item.categoryName || "Uncategorized",
      slug: slug,
    };
  } catch {
    return null;
  }
}

function readWishlist(): WishlistItem[] {
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as WishlistItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [saved, setSaved] = useState(false);
  const [inCart, setInCart] = useState(false);
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const convexProduct = convexEnabled ? useQuery(api.products.getBySlug, slug ? { slug } : "skip") : undefined;

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => setSlug(resolvedSlug));
  }, [params]);

  const product = useMemo(() => {
    if (convexEnabled && convexProduct && typeof convexProduct === "object" && "_id" in convexProduct) {
      return mapLiveProduct(convexProduct as ProductDoc);
    }

    return slug ? (findProductBySlug(slug) || findLocalProductBySlug(slug)) : null;
  }, [convexProduct, slug]);

  const title = product?.name ?? prettifySlug(decodeURIComponent(slug));

  const saveToWishlist = () => {
    const item: WishlistItem = {
      name: title,
      price: product?.price ?? "View from product page",
      image: product?.image,
      category: product?.category ?? "Saved from detail page",
      slug,
    };

    const existing = readWishlist();
    const next = [...existing.filter((entry) => entry.slug !== slug), item];
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("wishlist-updated"));
    setSaved(true);
  };

  const addToCart = () => {
    const item: CartItem = {
      name: title,
      price: product?.price ?? "Add from product page",
      image: product?.image,
      category: product?.category ?? "Added from detail page",
      slug,
    };

    const existing = readCart();
    const next = [...existing.filter((entry) => entry.slug !== slug), item];
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("cart-updated"));
    setInCart(true);
  };

  const buyNow = () => {
    addToCart();
    router.push(`/checkout?slug=${encodeURIComponent(slug)}`);
  };

  return (
    <main className="min-h-screen bg-[#f1f3f6] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="mt-6 rounded-[2rem] border border-[#e2e7f0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Product detail
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            This detail page matches the marketplace look and keeps the shopping flow consistent.
            You can swap this placeholder for a real product fetch whenever you are ready.
          </p>
          {product ? (
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {product.rating} ★
              </span>
              <span className="text-sm text-slate-500">{product.reviews} reviews</span>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <ProductImageCard src={product?.image} alt={title} />
              <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_1fr]">
                <button
                  type="button"
                  onClick={saveToWishlist}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition ${
                    saved
                      ? "border-[#c7d7ff] bg-[#eef4ff] shadow-[0_0_0_3px_rgba(40,116,240,0.08)]"
                      : "border-[#d7deea] bg-white hover:bg-slate-50"
                  }`}
                >
                  <IconWishlist active={saved} />
                  <span className="sr-only">{saved ? "Saved to Wishlist" : "Add to Wishlist"}</span>
                </button>
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d7deea] bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  <IconCart />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  onClick={buyNow}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f59d00] px-8 py-3 text-base font-semibold text-white shadow-[0_6px_18px_rgba(245,157,0,0.28)] transition hover:bg-[#e48f00]"
                >
                  <IconBolt />
                  Buy Now
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-[#e2e7f0] bg-[#f7f9fc] p-4">
                <p className="text-sm font-semibold text-slate-500">What happens next</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product
                    ? "This page now resolves the matching product image and title from the storefront catalog, so every item opens with the same framed image style."
                    : "Hook this page up to your backend or product dataset, and this route can show the full product gallery, pricing, seller details, and actions like add to cart."}
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-[#e2e7f0] bg-[#f7f9fc] p-4">
                <p className="text-sm font-semibold text-slate-500">Route slug</p>
                <p className="mt-2 break-words text-sm text-slate-700">{slug}</p>
                {product ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">{product.price}</p>
                ) : null}
              </div>
              <div className="rounded-[1.25rem] border border-[#e2e7f0] bg-[#f7f9fc] p-4">
                <p className="text-sm font-semibold text-slate-500">Product details</p>
                {product ? (
                  <div className="mt-3 space-y-3 text-sm text-slate-700">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Brand</span>
                      <span className="font-medium text-slate-900 text-right">{product.brand}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Seller</span>
                      <span className="font-medium text-slate-900 text-right">{product.seller}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Rating</span>
                      <span className="font-medium text-slate-900 text-right">
                        {product.rating} {product.reviews}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Shipping</span>
                      <span className="font-medium text-slate-900 text-right">{product.shipping}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Offer</span>
                      <span className="font-medium text-emerald-700 text-right">{product.discount}</span>
                    </div>
                    <div className="rounded-xl bg-white p-3 text-slate-600">
                      {product.name} is now tracked through the shared catalog, so the detail page can keep
                      the image, title, pricing, and buying actions in sync.
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    We could not match this item to the storefront catalog yet, but the page structure is
                    ready for live product data.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[#e2e7f0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-slate-900">Overview</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {product
                ? `${product.name} is displayed with the same marketplace frame, pricing treatment, and action buttons used across the catalog.`
                : "This area can summarize the key purpose, use case, or value of the product once the catalog entry is available."}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#e2e7f0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-slate-900">Key value</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {product
                ? formatSavings(product.price, product.oldPrice)
                : "Use this space for a short value statement, such as what makes the item worth buying now."}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[#e2e7f0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-slate-900">Next step</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add real product specs, reviews, and delivery info here when you connect this route to your
              backend or CMS.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
