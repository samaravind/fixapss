"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    params.then(({ slug: resolvedSlug }) => setSlug(resolvedSlug));
  }, [params]);

  const title = prettifySlug(decodeURIComponent(slug));

  const saveToWishlist = () => {
    const item: WishlistItem = {
      name: title,
      price: "View from product page",
      category: "Saved from detail page",
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
      price: "Add from product page",
      category: "Added from detail page",
      slug,
    };

    const existing = readCart();
    const next = [...existing.filter((entry) => entry.slug !== slug), item];
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("cart-updated"));
    setInCart(true);
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
          Back to shop
        </Link>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Product detail
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            This detail page is now the click target for catalog items. You can swap this
            placeholder for a real product data fetch or a richer PDP whenever you are ready.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-stone-100 to-stone-200 p-6">
              <div className="flex min-h-[360px] items-center justify-center rounded-[1.25rem] bg-white">
                <span className="text-2xl font-semibold tracking-[0.2em] text-stone-400">
                  Product Image
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={saveToWishlist}
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
                >
                  {saved ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {inCart ? "Cart added" : "Add to Cart"}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-500">What happens next</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Hook this page up to your backend or product dataset, and this route can show
                  the full product gallery, pricing, seller details, and actions like add to cart.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-500">Route slug</p>
                <p className="mt-2 break-words text-sm text-stone-700">{slug}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
