"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { convexRefs } from "../convexRefs";
import { buildSlug, catalog, categories as storeCategories } from "../../store-data";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../../../components/ui/drawer";

type CategoryRow = {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
};

type ProductRow = {
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
  description?: string;
  specification?: string;
  quantity?: string;
  minQuantity?: string;
  badge?: string;
  createdAt: number;
  updatedAt: number;
  source?: "convex" | "fallback";
};

type ProductForm = {
  name: string;
  categorySlug: string;
  price: string;
  oldPrice: string;
  brand: string;
  seller: string;
  rating: string;
  reviews: string;
  shipping: string;
  discount: string;
  images: string[];
  description: string;
  specification: string;
  quantity: string;
  minQuantity: string;
  badge: string;
};

const hasConvex = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

const PRODUCTS_STORAGE_KEY = "fixx-products";

type StoredProduct = {
  name: string;
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
  description?: string;
  specification?: string;
  quantity?: string;
  minQuantity?: string;
  badge?: string;
};

function readLocalProducts(): ProductRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredProduct[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item, index) => ({
      _id: `local-${Date.now()}-${index}`,
      name: item.name,
      slug: item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      categorySlug: item.categorySlug || "uncategorized",
      categoryName: item.categoryName || "Uncategorized",
      price: item.price,
      oldPrice: item.oldPrice,
      brand: item.brand,
      seller: item.seller,
      rating: item.rating,
      reviews: item.reviews,
      shipping: item.shipping,
      discount: item.discount,
      image: item.image,
      images: item.images,
      description: item.description,
      specification: item.specification,
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      badge: item.badge,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source: "local",
    }));
  } catch {
    return [];
  }
}

function persistLocalProducts(products: StoredProduct[]) {
  try {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("fixx-admin-product-updated"));
  } catch {
    // Local storage may be unavailable
  }
}

const emptyForm: ProductForm = {
  name: "",
  categorySlug: "",
  price: "",
  oldPrice: "",
  brand: "",
  seller: "",
  rating: "",
  reviews: "",
  shipping: "",
  discount: "",
  images: [],
  description: "",
  specification: "",
  quantity: "",
  minQuantity: "",
  badge: "",
};

function parseMoney(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toComparablePrice(value: string) {
  const parsed = parseMoney(value);
  return parsed > 0 ? parsed : 0;
}

function getFallbackProducts(): ProductRow[] {
  return Object.entries(catalog).flatMap(([category, items]) =>
    items.map((item, index) => ({
      _id: `${category}-${index}`,
      name: item.name,
      slug: buildSlug(category, item.name, index),
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      categoryName: category,
      price: item.price,
      oldPrice: item.oldPrice,
      brand: item.brand,
      seller: item.seller,
      rating: item.rating,
      reviews: item.reviews,
      shipping: item.shipping,
      discount: item.discount,
      image: item.image,
      images: undefined,
      description: undefined,
      specification: undefined,
      quantity: undefined,
      minQuantity: undefined,
      badge: item.badge,
      createdAt: 0,
      updatedAt: 0,
      source: "fallback",
    })),
  );
}

function ConvexProductsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const convexCategories = useQuery(convexRefs.categories.getAll) as CategoryRow[] | undefined;
  const allProducts = useQuery(convexRefs.products.getAll) as ProductRow[] | undefined;
  const categoryProducts = useQuery(
    convexRefs.products.getByCategory,
    initialCategory === "all" ? "skip" : { categorySlug: initialCategory },
  ) as ProductRow[] | undefined;

  const createProduct = useMutation(convexRefs.products.create);
  const updateProduct = useMutation(convexRefs.products.update);
  const deleteProduct = useMutation(convexRefs.products.remove);
  const seedCategories = useMutation(convexRefs.categories.seedDefaults);
  const seedProducts = useMutation(convexRefs.products.seedDefaults);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [localProducts, setLocalProducts] = useState<ProductRow[]>(() => readLocalProducts());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategory = initialCategory;
  const categoryList = convexCategories ?? [];
  const nextCategorySlug = activeCategory === "all" ? categoryList[0]?.slug ?? "" : activeCategory;
  const fallbackProducts = useMemo(() => getFallbackProducts(), []);
  const visibleProducts = useMemo(() => {
    const liveProducts = allProducts ?? [];
    const hasLiveData = liveProducts.length > 0;
    const base = hasLiveData ? liveProducts : [...fallbackProducts, ...localProducts];

    if (activeCategory === "all") {
      return base;
    }

    const resolvedCategoryProducts = categoryProducts ?? [];
    if (hasLiveData && resolvedCategoryProducts.length > 0) {
      return resolvedCategoryProducts;
    }

    return base.filter((product) => product.categorySlug === activeCategory);
  }, [activeCategory, allProducts, categoryProducts, fallbackProducts, localProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return visibleProducts;
    const query = searchQuery.toLowerCase();
    return visibleProducts.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      (product.brand ?? "").toLowerCase().includes(query) ||
      (product.seller ?? "").toLowerCase().includes(query) ||
      product.categoryName.toLowerCase().includes(query)
    );
  }, [visibleProducts, searchQuery]);

  const selectedProduct = useMemo(
    () => filteredProducts.find((product) => product._id === selectedId) ?? null,
    [filteredProducts, selectedId],
  );

  function resetForm() {
    setSelectedId(null);
    setForm({
      ...emptyForm,
      categorySlug: nextCategorySlug,
    });
  }

  function openCreateDrawer() {
    resetForm();
    setShowDrawer(true);
  }

  function openEditDrawer(product: ProductRow) {
    setSelectedId(product._id);
    setForm({
      name: product.name,
      categorySlug: product.categorySlug,
      price: product.price,
      oldPrice: product.oldPrice ?? "",
      brand: product.brand ?? "",
      seller: product.seller ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
      shipping: product.shipping ?? "",
      discount: product.discount ?? "",
      images: product.images ?? (product.image ? [product.image] : []),
      description: product.description ?? "",
      specification: product.specification ?? "",
      quantity: product.quantity ?? "",
      minQuantity: product.minQuantity ?? "",
      badge: product.badge ?? "",
    });
    setShowDrawer(true);
  }

  function handleImagesSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function saveLocalProducts(products: ProductRow[]) {
    const stored: StoredProduct[] = products
      .filter((p) => p.source === "local")
      .map((p) => ({
        name: p.name,
        categorySlug: p.categorySlug,
        categoryName: p.categoryName,
        price: p.price,
        oldPrice: p.oldPrice,
        brand: p.brand,
        seller: p.seller,
        rating: p.rating,
        reviews: p.reviews,
        shipping: p.shipping,
        discount: p.discount,
        image: p.image,
        images: p.images,
        description: p.description,
        specification: p.specification,
        quantity: p.quantity,
        minQuantity: p.minQuantity,
        badge: p.badge,
      }));
    persistLocalProducts(stored);
    setLocalProducts(products.filter((p) => p.source === "local"));
  }

  async function handleSubmit() {
    const images = form.images.filter(Boolean);
    const payload = {
      name: form.name.trim(),
      categorySlug: form.categorySlug.trim(),
      price: form.price.trim(),
      oldPrice: form.oldPrice.trim(),
      brand: form.brand.trim(),
      seller: form.seller.trim(),
      rating: form.rating.trim(),
      reviews: form.reviews.trim(),
      shipping: form.shipping.trim(),
      discount: form.discount.trim(),
      image: images[0] ?? "",
      images: images.length > 0 ? images : undefined,
      description: form.description.trim(),
      specification: form.specification.trim(),
      quantity: form.quantity.trim(),
      minQuantity: form.minQuantity.trim(),
      badge: form.badge.trim(),
    };

    if (!payload.name || !payload.price) {
      setStatus("Product name and price are required.");
      return;
    }

    setIsSaving(true);
    setStatus("");

    const categoryName = categoryList.find((c) => c.slug === payload.categorySlug)?.name || payload.categorySlug;

    try {
      if (selectedProduct) {
        if (selectedProduct.source === "convex") {
          await updateProduct({
            id: selectedProduct._id,
            ...payload,
            oldPrice: payload.oldPrice || undefined,
            brand: payload.brand || undefined,
            seller: payload.seller || undefined,
            rating: payload.rating || undefined,
            reviews: payload.reviews || undefined,
            shipping: payload.shipping || undefined,
            discount: payload.discount || undefined,
            image: payload.image || undefined,
            images: payload.images,
            description: payload.description || undefined,
            specification: payload.specification || undefined,
            quantity: payload.quantity || undefined,
            minQuantity: payload.minQuantity || undefined,
            badge: payload.badge || undefined,
          });
        } else {
          const allLocal = [...localProducts];
          const idx = allLocal.findIndex((p) => p._id === selectedProduct._id);
          if (idx >= 0) {
            allLocal[idx] = {
              ...allLocal[idx],
              ...payload,
              images: payload.images,
              categoryName,
              slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
              updatedAt: Date.now(),
            };
            saveLocalProducts(allLocal);
          }
        }
        setStatus(`Updated ${payload.name}.`);
      } else {
        try {
          await createProduct({
            ...payload,
            oldPrice: payload.oldPrice || undefined,
            brand: payload.brand || undefined,
            seller: payload.seller || undefined,
            rating: payload.rating || undefined,
            reviews: payload.reviews || undefined,
            shipping: payload.shipping || undefined,
            discount: payload.discount || undefined,
            image: payload.image || undefined,
            images: payload.images,
            description: payload.description || undefined,
            specification: payload.specification || undefined,
            quantity: payload.quantity || undefined,
            minQuantity: payload.minQuantity || undefined,
            badge: payload.badge || undefined,
          });
        } catch {
          const newProduct: ProductRow = {
            _id: `local-${Date.now()}`,
            name: payload.name,
            slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            categorySlug: payload.categorySlug,
            categoryName,
            price: payload.price,
            oldPrice: payload.oldPrice || undefined,
            brand: payload.brand || undefined,
            seller: payload.seller || undefined,
            rating: payload.rating || undefined,
            reviews: payload.reviews || undefined,
            shipping: payload.shipping || undefined,
            discount: payload.discount || undefined,
            image: payload.image || undefined,
            images: payload.images,
            description: payload.description || undefined,
            specification: payload.specification || undefined,
            quantity: payload.quantity || undefined,
            minQuantity: payload.minQuantity || undefined,
            badge: payload.badge || undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            source: "local",
          };
          saveLocalProducts([...localProducts, newProduct]);
        }
        setStatus(`Created ${payload.name}.`);
      }

      resetForm();
      setShowDrawer(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: ProductRow) {
    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }

    if (product.source === "convex") {
      await deleteProduct({ id: product._id });
    } else {
      saveLocalProducts(localProducts.filter((p) => p._id !== product._id));
    }

    if (selectedId === product._id) {
      resetForm();
    }
  }

  async function handleSeed() {
    setIsSeeding(true);
    setStatus("");

    try {
      await seedCategories();
      await seedProducts();
      setStatus("Seeded the storefront catalog into Convex.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to seed products.");
    } finally {
      setIsSeeding(false);
    }
  }

  const totalProducts = filteredProducts.length;
  const totalValue = useMemo(() => filteredProducts.reduce((sum, product) => sum + parseMoney(product.price), 0), [filteredProducts]);
  const totalDiscounted = useMemo(
    () => filteredProducts.filter((product) => Boolean(product.discount)).length,
    [filteredProducts],
  );

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-gray-900 px-6 py-6 text-white">
        <p className="text-xs font-semibold text-blue-300">Admin / Products</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Product management</h1>
            <p className="mt-1 text-sm text-gray-300">Create, edit, and manage products.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
              Back
            </Link>
            <button
              type="button"
              onClick={openCreateDrawer}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={handleSeed}
              disabled={isSeeding}
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSeeding ? "Seeding..." : "Seed"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border bg-gray-50 p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500">Products</p>
              <h2 className="mt-1 text-xl font-semibold">{totalProducts} products</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>Value Rs. {totalValue.toFixed(2)}</span>
              <span>{totalDiscounted} discounted</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-gray-600">
              Category
              <select
                value={activeCategory}
                onChange={(event) => {
                  const nextCategory = event.target.value;
                  router.replace(nextCategory === "all" ? "/admin/products" : `/admin/products?category=${nextCategory}`);
                }}
                className="ml-2 rounded-md border bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All</option>
                {categoryList.map((category) => (
                  <option key={category._id} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              className="rounded-md border bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 w-56"
            />
            <Link href="/admin/category" className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100">
              Categories
            </Link>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr] gap-4 border-b bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
              <span>Product</span>
              <span>Price</span>
              <span>MRP</span>
              <span>Action</span>
            </div>
            <div className="divide-y">
              {filteredProducts.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500">
                  {searchQuery ? "No products match your search." : "No products available."}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product._id} className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr] gap-4 px-4 py-3 text-sm">
                    <div className="min-w-0">
                      <Link href={`/product/${product.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500">{product.seller || "Assured seller"}</p>
                    </div>
                    <span className="font-medium text-gray-900">{product.price}</span>
                    <span className="text-gray-400 line-through">{product.oldPrice || "-"}</span>
                    <div className="flex items-center gap-3">
                      <Link href={`/product/${product.slug}`} className="font-medium text-blue-600">View</Link>
                      {product.source !== "fallback" ? (
                        <>
                          <button type="button" onClick={() => openEditDrawer(product)} className="font-medium text-gray-600 hover:text-blue-600">Edit</button>
                          <button type="button" onClick={() => handleDelete(product)} className="font-medium text-red-600 hover:text-red-700">Delete</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <aside>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">Quick links</p>
            <div className="mt-3 space-y-1">
              {categoryList.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => router.replace(`/admin/products?category=${category.slug}`)}
                  className="block w-full rounded-md bg-gray-50 px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Drawer direction="right" open={showDrawer} onOpenChange={(open) => { if (!open) setShowDrawer(false); }}>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{selectedProduct ? "Edit product" : "Create product"}</DrawerTitle>
            <DrawerDescription>Fill in the product details below.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pb-6 overflow-y-auto max-h-[70vh]">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Product name"
                className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
                className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                {storeCategories.map((cat) => (
                  <option key={cat.label} value={cat.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="Rs. 0"
                  className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">MRP</label>
                <input
                  type="text"
                  value={form.oldPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, oldPrice: e.target.value }))}
                  placeholder="Rs. 0"
                  className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  placeholder="0"
                  className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Min. Quantity</label>
                <input
                  type="number"
                  value={form.minQuantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, minQuantity: e.target.value }))}
                  placeholder="1"
                  className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Images</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-dashed bg-gray-50 px-3 py-2 text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500"
                >
                  Add images
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImagesSelect} className="hidden" />
              </div>
              {form.images.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {form.images.map((img, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-md border">
                      <img src={img} alt={`Preview ${index + 1}`} className="h-24 w-full object-contain bg-gray-50" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-1 top-1 hidden rounded-full bg-red-600 p-1 text-white group-hover:block"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP. You can select multiple files.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Product description..."
                rows={3}
                className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Specification</label>
              <textarea
                value={form.specification}
                onChange={(e) => setForm((prev) => ({ ...prev, specification: e.target.value }))}
                placeholder="Product specifications..."
                rows={3}
                className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div>
            {status ? (
              <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{status}</div>
            ) : null}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : selectedProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function LocalProductsPanel() {
  const [localProducts, setLocalProducts] = useState<ProductRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [customCategories, setCustomCategories] = useState<{label: string; slug: string}[]>([]);

  useEffect(() => {
    setLocalProducts(readLocalProducts());

    try {
      const raw = window.localStorage.getItem("fixx-admin-category-rows");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const custom = parsed
            .filter((c: any) => c && c.name)
            .map((c: any) => ({
              label: c.name.trim(),
              slug: c.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
            }));
          setCustomCategories(custom);
        }
      }
    } catch {}
  }, []);

  const categoryList = useMemo(() => {
    const staticCats = storeCategories.map(c => ({
      label: c.label,
      slug: c.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    }));
    return [...staticCats, ...customCategories];
  }, [customCategories]);


  const fallbackProducts = useMemo(() => getFallbackProducts(), []);
  const allProducts = [...fallbackProducts, ...localProducts];
  const filteredProducts = useMemo(() => {
    let list = allProducts;
    if (initialCategory !== "all") {
      list = list.filter((p) => p.categorySlug === initialCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand ?? "").toLowerCase().includes(q) ||
          (p.seller ?? "").toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allProducts, initialCategory, searchQuery]);

  const totalValue = useMemo(() => filteredProducts.reduce((sum, p) => sum + parseMoney(p.price), 0), [filteredProducts]);
  const totalDiscounted = useMemo(() => filteredProducts.filter((p) => Boolean(p.discount)).length, [filteredProducts]);

  const selectedProduct = useMemo(
    () => filteredProducts.find((p) => p._id === selectedId) ?? null,
    [filteredProducts, selectedId],
  );

  function resetForm() {
    setSelectedId(null);
    setForm({ ...emptyForm, categorySlug: initialCategory === "all" ? "" : initialCategory });
  }

  function openCreateDrawer() { resetForm(); setShowDrawer(true); }
  function openEditDrawer(product: ProductRow) {
    setSelectedId(product._id);
    setForm({
      name: product.name,
      categorySlug: product.categorySlug,
      price: product.price,
      oldPrice: product.oldPrice ?? "",
      brand: product.brand ?? "",
      seller: product.seller ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
      shipping: product.shipping ?? "",
      discount: product.discount ?? "",
      images: product.images ?? (product.image ? [product.image] : []),
      description: product.description ?? "",
      specification: product.specification ?? "",
      quantity: product.quantity ?? "",
      minQuantity: product.minQuantity ?? "",
      badge: product.badge ?? "",
    });
    setShowDrawer(true);
  }

  function handleImagesSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function handleSubmit() {
    const images = form.images.filter(Boolean);
    const payload = {
      name: form.name.trim(),
      categorySlug: form.categorySlug.trim(),
      price: form.price.trim(),
      oldPrice: form.oldPrice.trim(),
      brand: form.brand.trim(),
      seller: form.seller.trim(),
      rating: form.rating.trim(),
      reviews: form.reviews.trim(),
      shipping: form.shipping.trim(),
      discount: form.discount.trim(),
      image: images[0] ?? "",
      images: images.length > 0 ? images : undefined,
      description: form.description.trim(),
      specification: form.specification.trim(),
      quantity: form.quantity.trim(),
      minQuantity: form.minQuantity.trim(),
      badge: form.badge.trim(),
    };
    if (!payload.name || !payload.price) { setStatus("Product name and price are required."); return; }

    setIsSaving(true);
    setStatus("");

    const categoryName = categoryList.find(c => c.slug === payload.categorySlug)?.label || payload.categorySlug;

    if (selectedProduct) {
      const updated = localProducts.map((p) =>
        p._id === selectedProduct._id ? { ...p, ...payload, images: payload.images, categoryName, updatedAt: Date.now() } : p,
      );
      const stored = updated.map(({ _id, slug, createdAt, updatedAt, source, ...rest }) => rest);
      persistLocalProducts(stored);
      setLocalProducts(updated);
      setStatus(`Updated ${payload.name}.`);
    } else {
      const newProduct: ProductRow = {
        _id: `local-${Date.now()}`,
        name: payload.name,
        slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        categorySlug: payload.categorySlug,
        categoryName: categoryName,
        price: payload.price,
        oldPrice: payload.oldPrice || undefined,
        brand: payload.brand || undefined,
        seller: payload.seller || undefined,
        rating: payload.rating || undefined,
        reviews: payload.reviews || undefined,
        shipping: payload.shipping || undefined,
        discount: payload.discount || undefined,
        image: payload.image || undefined,
        images: payload.images,
        description: payload.description || undefined,
        specification: payload.specification || undefined,
        quantity: payload.quantity || undefined,
        minQuantity: payload.minQuantity || undefined,
        badge: payload.badge || undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        source: "local",
      };
      const updated = [...localProducts, newProduct];
      const stored = updated.map(({ _id, slug, createdAt, updatedAt, source, ...rest }) => rest);
      persistLocalProducts(stored);
      setLocalProducts(updated);
      setStatus(`Created ${payload.name}.`);
    }

    resetForm();
    setShowDrawer(false);
    setIsSaving(false);
  }

  function handleDelete(product: ProductRow) {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;
    const updated = localProducts.filter((p) => p._id !== product._id);
    const stored = updated.map(({ _id, slug, createdAt, updatedAt, source, ...rest }) => rest);
    persistLocalProducts(stored);
    setLocalProducts(updated);
    if (selectedId === product._id) resetForm();
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-gray-900 px-6 py-6 text-white">
        <p className="text-xs font-semibold text-blue-300">Admin / Products</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Product management</h1>
            <p className="mt-1 text-sm text-gray-300">Create, edit, and manage products.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Back</Link>
            <button type="button" onClick={openCreateDrawer} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create</button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border bg-gray-50 p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500">Products</p>
              <h2 className="mt-1 text-xl font-semibold">{filteredProducts.length} products</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span>Value Rs. {totalValue.toFixed(2)}</span>
              <span>{totalDiscounted} discounted</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search..."
              className="rounded-md border bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 w-64"
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr] gap-4 border-b bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
              <span>Product</span>
              <span>Price</span>
              <span>MRP</span>
              <span>Action</span>
            </div>
            <div className="divide-y">
              {filteredProducts.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500">
                  {searchQuery ? "No products match your search." : "No products available. Click Create to add one."}
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product._id} className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr] gap-4 px-4 py-3 text-sm">
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900">{product.name}</span>
                      <p className="text-xs text-gray-500">{product.seller || "Assured seller"}</p>
                    </div>
                    <span className="font-medium text-gray-900">{product.price}</span>
                    <span className="text-gray-400 line-through">{product.oldPrice || "-"}</span>
                    <div className="flex items-center gap-3">
                      <Link href={`/product/${product.slug}`} className="font-medium text-blue-600">View</Link>
                      {product.source !== "fallback" ? (
                        <>
                          <button type="button" onClick={() => openEditDrawer(product)} className="font-medium text-gray-600 hover:text-blue-600">Edit</button>
                          <button type="button" onClick={() => handleDelete(product)} className="font-medium text-red-600 hover:text-red-700">Delete</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <Drawer direction="right" open={showDrawer} onOpenChange={(open) => { if (!open) setShowDrawer(false); }}>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{selectedProduct ? "Edit product" : "Create product"}</DrawerTitle>
            <DrawerDescription>Fill in the product details below.</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 px-4 pb-6 overflow-y-auto max-h-[70vh]">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
              <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
                className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select category</option>
                {categoryList.map((cat) => (
                  <option key={cat.label} value={cat.slug}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                <input type="text" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Rs. 0" className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">MRP</label>
                <input type="text" value={form.oldPrice} onChange={(e) => setForm((prev) => ({ ...prev, oldPrice: e.target.value }))} placeholder="Rs. 0" className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))} placeholder="0" className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Min. Quantity</label>
                <input type="number" value={form.minQuantity} onChange={(e) => setForm((prev) => ({ ...prev, minQuantity: e.target.value }))} placeholder="1" className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Images</label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md border border-dashed bg-gray-50 px-3 py-2 text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500">Add images</button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImagesSelect} className="hidden" />
              </div>
              {form.images.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {form.images.map((img, index) => (
                    <div key={index} className="group relative overflow-hidden rounded-md border">
                      <img src={img} alt={`Preview ${index + 1}`} className="h-24 w-full object-contain bg-gray-50" />
                      <button type="button" onClick={() => handleRemoveImage(index)} className="absolute right-1 top-1 hidden rounded-full bg-red-600 p-1 text-white group-hover:block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="mt-1 text-xs text-gray-400">JPG, PNG, WEBP. You can select multiple files.</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Product description..." rows={3} className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Specification</label>
              <textarea value={form.specification} onChange={(e) => setForm((prev) => ({ ...prev, specification: e.target.value }))} placeholder="Product specifications..." rows={3} className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none" />
            </div>
            {status ? <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{status}</div> : null}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowDrawer(false)} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isSaving ? "Saving..." : selectedProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default function AdminProductsPage() {
  return hasConvex ? <ConvexProductsPanel /> : <LocalProductsPanel />;
}
