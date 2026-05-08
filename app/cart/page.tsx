"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "fixx-cart";

type CartItem = {
  name: string;
  price: string;
  image?: string;
  category: string;
  slug: string;
};

function readCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cart-updated", sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart-updated", sync as EventListener);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Cart
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Cart added</h1>
          </div>
          <p className="text-sm text-stone-500">{items.length} item(s)</p>
        </div>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-stone-500">
              No items in cart yet. Open a product and tap Add to Cart.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/product/${item.slug}`}
                  className="flex items-center gap-3 rounded-[1.1rem] border border-stone-200 bg-stone-50 p-3 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-[0.9rem] bg-white">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
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
