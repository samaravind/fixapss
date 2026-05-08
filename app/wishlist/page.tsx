"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const WISHLIST_STORAGE_KEY = "fixx-wishlist";

type WishlistItem = {
  name: string;
  price: string;
  image?: string;
  category: string;
  slug: string;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const readWishlist = () => {
      try {
        const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as WishlistItem[]) : [];
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch {
        setItems([]);
      }
    };

    readWishlist();
    window.addEventListener("storage", readWishlist);
    window.addEventListener("wishlist-updated", readWishlist as EventListener);

    return () => {
      window.removeEventListener("storage", readWishlist);
      window.removeEventListener("wishlist-updated", readWishlist as EventListener);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
          Back to shop
        </Link>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Wishlist
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Saved items
              </h1>
            </div>
            <p className="text-sm text-stone-500">{items.length} item(s)</p>
          </div>

          {items.length === 0 ? (
            <p className="mt-6 text-sm text-stone-500">
              Your wishlist is empty. Open any product and tap Add to Wishlist to save it here.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/product/${item.slug}`}
                  className="flex items-center gap-4 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4 transition hover:bg-white"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-[1rem] bg-white">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold text-stone-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-900">{item.name}</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700">{item.price}</p>
                    <p className="mt-1 text-xs text-stone-500">{item.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
