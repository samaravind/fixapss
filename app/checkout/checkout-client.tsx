"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "../page";

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

function formatINR(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function CheckoutClient({
  slug,
  initialProduct,
}: {
  slug: string;
  initialProduct: Product | null;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [activePayment, setActivePayment] = useState("UPI");
  const [quantity, setQuantity] = useState(1);

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

  const currentItem = useMemo(() => {
    if (initialProduct) {
      return {
        name: initialProduct.name,
        price: initialProduct.price,
        image: initialProduct.image,
        category: initialProduct.category,
        slug,
      };
    }

    return items.find((item) => item.slug === slug) ?? items[0] ?? null;
  }, [initialProduct, items, slug]);

  const unitAmount = useMemo(() => {
    if (!currentItem?.price) {
      return 0;
    }

    const normalized = currentItem.price.replace(/[^\d.]/g, "");
    const parsed = Number(normalized);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [currentItem]);

  const totalAmount = unitAmount * quantity;
  const unitPriceLabel = formatINR(unitAmount);
  const itemTotalLabel = formatINR(totalAmount);

  return (
    <main className="min-h-screen bg-[#f1f3f6] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="mt-4 rounded-[1.5rem] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Payment options
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Review and pay
              </h1>
            </div>
            <p className="text-sm text-slate-500">{items.length} item(s)</p>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="rounded-[1.25rem] border border-slate-200 p-4">
                <div className="flex items-start gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                    {currentItem?.image ? (
                      <Image
                        src={currentItem.image}
                        alt={currentItem.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-medium leading-6 text-slate-900">
                      {currentItem?.name ?? "No item in cart"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {currentItem?.category ?? "Add an item from the product page"}
                    </p>
                    <p className="mt-3 text-sm text-slate-500">
                      Unit price: <span className="font-medium text-slate-700">{unitPriceLabel}</span>
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm">
                        <span className="font-medium">Qty:</span>
                        <select
                          value={quantity}
                          onChange={(event) => setQuantity(Number(event.target.value))}
                          className="bg-transparent outline-none"
                        >
                          {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </label>
                      <p className="text-3xl font-semibold tracking-tight text-slate-900">{itemTotalLabel}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Delivery
                </p>
                <div className="mt-3 flex items-start gap-3">
                  <div className="mt-0.5 text-lg">🚚</div>
                  <div>
                    <p className="font-medium text-slate-900">EXPRESS delivery</p>
                    <p className="text-sm text-slate-600">Delivery in 2 days, Wed</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-slate-200 p-4">
                <label className="flex items-center gap-3 text-base text-slate-900">
                  <input type="checkbox" className="h-5 w-5 accent-[#2874f0]" />
                  Use GST Invoice
                </label>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Choose payment method
                </p>
                <div className="mt-3 grid gap-2">
                  {["UPI", "Cards", "Netbanking", "Wallets", "Cash on Delivery"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setActivePayment(method)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                        activePayment === method
                          ? "border-[#2874f0] bg-[#eef4ff] text-[#2874f0]"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.25rem] border border-slate-200 bg-[#f7f9fc] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Order summary
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Item total</span>
                    <span>{itemTotalLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Protect Promise Fee</span>
                    <span>+ ₹149</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                    <span>Payable amount</span>
                    <span>{itemTotalLabel}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-[#f59d00] px-6 py-3 text-base font-semibold text-white shadow-[0_6px_18px_rgba(245,157,0,0.28)] transition hover:bg-[#e48f00]"
                >
                  Buy Now
                </button>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
