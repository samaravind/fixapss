"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api, convexEnabled } from "../../../lib/convex";
import { buildSlug, catalog, categories, categorySlug, CUSTOM_CATEGORIES_KEY } from "../../store-data";

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
  badge?: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  seller: string;
  price: string;
  rating: string;
  reviews: string;
  image?: string;
};

type CustomCategory = {
  name?: string;
  hero?: string;
  route?: string;
};

function readStoredCategories(): CustomCategory[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CustomCategory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapStaticProducts(categoryLabel: string): ProductRow[] {
  return (catalog[categoryLabel] ?? []).map((product, index) => ({
    id: product.id,
    slug: buildSlug(categoryLabel, product.name, index),
    name: product.name,
    brand: product.brand,
    seller: product.seller,
    price: product.price,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
  }));
}

function mapLiveProducts(rows: ProductDoc[]): ProductRow[] {
  return rows.map((product) => ({
    id: product._id,
    slug: product.slug,
    name: product.name,
    brand: product.brand ?? "",
    seller: product.seller ?? "",
    price: product.price,
    rating: product.rating ?? "",
    reviews: product.reviews ?? "",
    image: product.image,
  }));
}

function parseSlug(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return "";
}

export default function CategoryPage() {
  const params = useParams<{ slug?: string | string[] }>();
  const slug = parseSlug(params.slug);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const convexCategory = convexEnabled ? useQuery(api.categories.getBySlug, slug ? { slug } : "skip") : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const convexProducts = convexEnabled ? useQuery(api.products.getByCategory, slug ? { categorySlug: slug } : "skip") : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const seedDefaults = convexEnabled ? useMutation(api.categories.seedDefaults) : undefined;

  useEffect(() => {
    if (convexEnabled && seedDefaults) {
      void seedDefaults({});
    }
  }, [seedDefaults]);

  useEffect(() => {
    const loadCategories = () => {
      setCustomCategories(readStoredCategories());
    };

    const timer = window.setTimeout(loadCategories, 0);
    window.addEventListener("storage", loadCategories);
    window.addEventListener("fixx-admin-category-updated", loadCategories);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", loadCategories);
      window.removeEventListener("fixx-admin-category-updated", loadCategories);
    };
  }, []);

  const baseCategory = categories.find((item) => categorySlug(item.label) === slug);
  const customCategory = convexEnabled ? undefined : customCategories.find((item) => categorySlug(item.name ?? "") === slug);
  const convexCategoryData = convexCategory && typeof convexCategory === "object" && "_id" in convexCategory ? convexCategory : null;

  const label = convexCategoryData?.name || baseCategory?.label || customCategory?.name || "Category";
  const tagline = convexCategoryData?.tagline || baseCategory?.tagline || customCategory?.hero || "Category details";
  const image = convexCategoryData?.image || baseCategory?.image || "/banners/poco-banner.svg";
  const accent = convexCategoryData?.accent || baseCategory?.accent || "from-[#ecf4ff] to-[#d7e8ff]";
  const products = convexEnabled
    ? Array.isArray(convexProducts) && convexProducts.length > 0
      ? mapLiveProducts(convexProducts as ProductDoc[])
      : mapStaticProducts(label)
    : mapStaticProducts(label);
  const isKnownCategory = Boolean(convexCategoryData || baseCategory || customCategory);

  return (
    <main className="min-h-screen bg-[#f1f3f6] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className={`bg-gradient-to-r ${accent} px-6 py-8 sm:px-8`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Category</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{label}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{tagline}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/category" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                  Back to category admin
                </Link>
                <Link href="/admin/category" className="rounded-full bg-[#ffb54a] px-5 py-3 text-sm font-semibold text-[#172337] shadow-sm transition hover:bg-[#f6a62f]">
                  Create
                </Link>
                <Link href="/admin" className="rounded-full bg-[#2874f0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f5fc1]">
                  Back to admin
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[1.75rem] border border-[#e5eaf2] bg-[#f7f9fc] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Products</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    {isKnownCategory ? `${products.length} live items` : "Category not found"}
                  </h2>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  Category table
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#e5eaf2] bg-white">
                <div className="flex items-center justify-between border-b border-[#e5eaf2] bg-[#f7f9fc] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Slide to browse</span>
                  <span className="normal-case tracking-normal text-slate-400">
                    &larr; swipe &rarr;
                  </span>
                </div>
                {!isKnownCategory ? (
                  <div className="px-5 py-6 text-sm text-slate-500">
                    This category has not been created yet.
                  </div>
                ) : products.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-500">
                    This category was created from the admin page, but no products have been added yet.
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto p-5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {products.map((product) => {
                      const slugValue = product.slug;
                      const imageSrc = product.image || "/login-illustration.png";

                      return (
                        <Link
                          key={product.id}
                          href={`/product/${slugValue}`}
                          className="group flex w-56 shrink-0 flex-col overflow-hidden rounded-[1.6rem] border border-[#e5eaf2] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f9fc]">
                            <Image
                              src={imageSrc}
                              alt={product.name}
                              fill
                              className="object-cover transition duration-300 group-hover:scale-105"
                              sizes="224px"
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-1.5 p-4">
                            <p className="text-xs font-semibold text-slate-400">{product.brand}</p>
                            <h3 className="line-clamp-2 text-sm font-medium leading-5 text-slate-900">{product.name}</h3>
                            <p className="text-xs text-slate-500">{product.seller}</p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <span className="text-base font-semibold text-slate-900">{product.price}</span>
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{product.rating}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-[1.75rem] border border-[#e5eaf2] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Featured image</p>
                <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-[#f7f9fc] p-3">
                  <Image src={image} alt={label} width={640} height={480} className="h-56 w-full rounded-[1.15rem] object-cover" />
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#e5eaf2] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Summary</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[1.25rem] bg-[#f7f9fc] px-4 py-4">
                    <p className="text-sm font-medium text-slate-500">Total products</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{products.length}</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-[#f7f9fc] px-4 py-4">
                    <p className="text-sm font-medium text-slate-500">Route</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">/category/{slug}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
