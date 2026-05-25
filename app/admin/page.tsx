"use client";

"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { buildSlug, catalog } from "../page";

const USERS_STORAGE_KEY = "fixx-users";
const CART_STORAGE_KEY = "fixx-cart";
const WISHLIST_STORAGE_KEY = "fixx-wishlist";

type User = {
  email: string;
  password: string;
  mobile?: string;
  name?: string;
};

type StoredItem = {
  slug: string;
  name: string;
  price: string;
  category: string;
};

type ProductSummary = {
  category: string;
  name: string;
  priceValue: number;
  discountPercent: number;
};

function parseMoney(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35" strokeLinecap="round" />
      <path d="M16 3.2a4 4 0 0 1 0 7.6" strokeLinecap="round" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8h12l1 12H5L6 8Z" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20s-7-4.6-9.5-8.7C0.5 8.1 2.1 4.5 5.9 4.5c2 0 3.4 1 4.1 2 0.7-1 2.1-2 4.1-2 3.8 0 5.4 3.6 3.4 6.8C19 15.4 12 20 12 20Z" />
    </svg>
  );
}

function IconPackage() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3.5 7.5 12 3l8.5 4.5L12 12 3.5 7.5Z" strokeLinejoin="round" />
      <path d="M3.5 7.5V16.5L12 21l8.5-4.5V7.5" strokeLinejoin="round" />
      <path d="M12 12v9" strokeLinecap="round" />
    </svg>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function getAllProducts(): ProductSummary[] {
  return Object.entries(catalog).flatMap(([category, items]) =>
    items.map((item) => {
      const priceValue = parseMoney(item.price);
      const oldPriceValue = parseMoney(item.oldPrice);
      const discountPercent =
        oldPriceValue > 0 ? Math.max(0, Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100)) : 0;

      return {
        category,
        name: item.name,
        priceValue,
        discountPercent,
      };
    }),
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [cartItems, setCartItems] = useState<StoredItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<StoredItem[]>([]);

  const products = useMemo(() => getAllProducts(), []);
  const totalCatalogValue = useMemo(() => products.reduce((sum, product) => sum + product.priceValue, 0), [products]);
  const highestDiscount = useMemo(() => [...products].sort((a, b) => b.discountPercent - a.discountPercent).slice(0, 4), [products]);
  const categoryCounts = useMemo(
    () => Object.entries(catalog).map(([category, items]) => ({ category, count: items.length })),
    [],
  );

  useEffect(() => {
    const syncData = () => {
      setUsers(readJson<User[]>(USERS_STORAGE_KEY, []));
      setCartItems(readJson<StoredItem[]>(CART_STORAGE_KEY, []));
      setWishlistItems(readJson<StoredItem[]>(WISHLIST_STORAGE_KEY, []));
    };

    syncData();
    window.addEventListener("storage", syncData);
    window.addEventListener("cart-updated", syncData);
    window.addEventListener("wishlist-updated", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("cart-updated", syncData);
      window.removeEventListener("wishlist-updated", syncData);
    };
  }, []);

  const totalProducts = products.length;
  const totalCategories = Object.keys(catalog).length;
  const activeAccounts = users.length;
  const savedCart = cartItems.length;
  const savedWishlist = wishlistItems.length;
  const sessionLabel = "Admin panel";

  return (
    <div className="space-y-6">
      <section
        id="dashboard"
        className="rounded-lg border bg-gray-900 text-white shadow-sm"
      >
        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-semibold text-blue-300">Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold">Marketplace control center</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              Monitor users, cart activity, wishlist activity, and catalog coverage.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Store</Link>
              <Link href="/admin/login" className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Login</Link>
              <Link href="/cart" className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Cart</Link>
            </div>
          </div>
          <div className="grid gap-4 rounded-lg bg-white/5 p-4">
            <div className="rounded-md bg-white/10 p-3">
              <p className="text-sm text-gray-300">Current session</p>
              <p className="mt-1 text-xl font-semibold">{sessionLabel}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-white/10 p-3">
                <p className="text-sm text-gray-300">Users</p>
                <p className="mt-1 text-xl font-semibold">{activeAccounts}</p>
              </div>
              <div className="rounded-md bg-white/10 p-3">
                <p className="text-sm text-gray-300">Products</p>
                <p className="mt-1 text-xl font-semibold">{totalProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total products" value={String(totalProducts)} hint="Across all catalog categories" icon={<IconPackage />} />
        <StatCard title="Registered users" value={String(activeAccounts)} hint="Stored in local browser data" icon={<IconUsers />} />
        <StatCard title="Cart items" value={String(savedCart)} hint="Current saved checkout queue" icon={<IconBag />} />
        <StatCard title="Wishlist items" value={String(savedWishlist)} hint="Saved products awaiting review" icon={<IconHeart />} />
      </section>

      <section id="category" className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500">Category</p>
            <h2 className="mt-1 text-xl font-semibold">Category coverage</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-gray-500">Value Rs. {totalCatalogValue.toFixed(2)}</p>
            <Link href="/admin/category" className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100">Categories</Link>
          </div>
        </div>

        <Link href="/admin/category" className="mt-4 block overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[1.3fr_0.6fr_0.8fr_0.8fr] gap-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
            <span>Category</span>
            <span>Items</span>
            <span>Value</span>
            <span>Open</span>
          </div>
          <div className="divide-y">
            {categoryCounts.map((item) => {
              const categoryItems = catalog[item.category as keyof typeof catalog] ?? [];
              const categoryValue = categoryItems.reduce((sum, product) => sum + parseMoney(product.price), 0);

              return (
                <div key={item.category} className="grid grid-cols-[1.3fr_0.6fr_0.8fr_0.8fr] gap-4 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.category}</p>
                    <p className="text-xs text-gray-500">Products currently live in this category</p>
                  </div>
                  <span className="text-gray-600">{item.count}</span>
                  <span className="text-gray-600">Rs. {categoryValue.toFixed(2)}</span>
                  <span className="font-medium text-blue-600">View</span>
                </div>
              );
            })}
          </div>
        </Link>
      </section>

      <section id="products" className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500">Products</p>
            <h2 className="mt-1 text-xl font-semibold">Top discounted products</h2>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-4 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Discount</span>
          </div>
          <div className="divide-y">
            {highestDiscount.map((product) => {
              const selected = Object.values(catalog).flat().find((item) => item.name === product.name);
              const productIndex = selected
                ? catalog[selected.category as keyof typeof catalog].findIndex((item) => item.name === selected.name)
                : -1;
              const slug = selected && productIndex >= 0 ? buildSlug(selected.category, selected.name, productIndex) : "";

              return (
                <div key={`${product.category}-${product.name}`} className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-4 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <Link href={slug ? `/product/${slug}` : "#"} className="font-medium text-gray-900 hover:text-blue-600">
                      {product.name}
                    </Link>
                  </div>
                  <span className="text-gray-600">{product.category}</span>
                  <span className="text-gray-600">Rs. {product.priceValue.toFixed(2)}</span>
                  <span className="font-medium text-green-700">{product.discountPercent}% OFF</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="users" className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500">Users</p>
            <h2 className="mt-1 text-xl font-semibold">Registered accounts</h2>
          </div>
          <p className="text-sm text-gray-500">{users.length} total</p>
        </div>

        <div className="mt-4 space-y-2">
          {users.length === 0 ? (
            <p className="rounded-lg border border-dashed bg-gray-50 px-4 py-6 text-sm text-gray-500">
              No users have been saved yet.
            </p>
          ) : (
            users.map((user) => (
              <div key={user.email} className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">{user.name || user.email}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    {user.mobile ? "Mobile linked" : "Email only"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500">Activity</p>
            <h2 className="mt-1 text-xl font-semibold">Shopping signals</h2>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-500">Cart</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{cartItems.length} items stored</p>
          </div>
          <div className="rounded-md bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-500">Wishlist</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{wishlistItems.length} items stored</p>
          </div>
          <div className="rounded-md bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-500">Catalog health</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{totalCategories} categories available</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f1f3f6] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#dfe5ee] bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            Loading admin panel...
          </div>
        </main>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
}
