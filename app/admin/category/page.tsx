"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api, convexEnabled } from "../../../lib/convex";
import { catalog, categories, categorySlug, CUSTOM_CATEGORIES_KEY } from "../../store-data";

const CATEGORY_OVERRIDES_KEY = "fixx-admin-category-overrides";
const DELETED_CATEGORIES_KEY = "fixx-admin-category-deleted";

type CategoryDoc = {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  accent: string;
  image: string;
  isDefault: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  hero: string;
  accent: string;
  image: string;
  route: string;
  items: number;
  value: number;
  slug: string;
  isDefault: boolean;
};

type CategoryForm = {
  name: string;
};

function parseMoney(value: string) {
  const normalized = value.replace(/[^\d.]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildBaseRows(): CategoryRow[] {
  return categories.map((category) => {
    const items = catalog[category.label] ?? [];
    const value = items.reduce((sum, item) => sum + parseMoney(item.price), 0);
    const slug = categorySlug(category.label);

    return {
      id: slug,
      name: category.label,
      hero: category.tagline,
      accent: category.accent,
      image: category.image,
      route: `/category/${slug}`,
      items: items.length,
      value,
      slug,
      isDefault: true,
    };
  });
}

function rowFromConvexDoc(doc: CategoryDoc): CategoryRow {
  const items = catalog[doc.name as keyof typeof catalog] ?? [];
  const value = items.reduce((sum, item) => sum + parseMoney(item.price), 0);

  return {
    id: doc._id,
    name: doc.name,
    hero: doc.tagline,
    accent: doc.accent,
    image: doc.image,
    route: `/category/${doc.slug}`,
    items: items.length,
    value,
    slug: doc.slug,
    isDefault: doc.isDefault,
  };
}

function readLocalRows(): CategoryRow[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CUSTOM_CATEGORIES_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Array<Partial<CategoryRow> & { name?: string; hero?: string; route?: string }>;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => typeof item?.name === "string" && item.name.trim().length > 0)
      .map((item) => {
        const name = item.name!.trim();
        const slug = categorySlug(name);
        const route = item.route || `/category/${slug}`;
        return {
          id: route,
          name,
          hero: item.hero?.trim() || "New category created from admin",
          accent: item.accent?.trim() || "from-[#ecf4ff] to-[#d7e8ff]",
          image: item.image?.trim() || "/banners/poco-banner.svg",
          route,
          items: Number.isFinite(item.items) ? Number(item.items) : 0,
          value: Number.isFinite(item.value) ? Number(item.value) : 0,
          slug,
          isDefault: Boolean(item.isDefault),
        };
      });
  } catch {
    return [];
  }
}

function persistLocalRows(nextRows: CategoryRow[]) {
  try {
    window.localStorage.setItem(
      CUSTOM_CATEGORIES_KEY,
      JSON.stringify(
        nextRows.map((row) => ({
          name: row.name,
          hero: row.hero,
          accent: row.accent,
          image: row.image,
          route: row.route,
          items: row.items,
          value: row.value,
          isDefault: false,
        })),
      ),
    );
    window.dispatchEvent(new Event("fixx-admin-category-updated"));
  } catch {
    // Local storage may be unavailable in private browsing modes.
  }
}

type OverrideMap = Record<string, Partial<CategoryRow>>;

function readOverrides(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CATEGORY_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistOverrides(overrides: OverrideMap) {
  try {
    window.localStorage.setItem(CATEGORY_OVERRIDES_KEY, JSON.stringify(overrides));
    window.dispatchEvent(new Event("fixx-admin-category-updated"));
  } catch {
    // ignore
  }
}

function readDeletedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DELETED_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistDeletedSlugs(slugs: string[]) {
  try {
    window.localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new Event("fixx-admin-category-updated"));
  } catch {
    // ignore
  }
}

function CategoryPanel() {
  const baseRows = useMemo(() => buildBaseRows(), []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const convexRows = convexEnabled ? useQuery(api.categories.getAll, undefined) : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const seedDefaults = convexEnabled ? useMutation(api.categories.seedDefaults) : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const createCategory = convexEnabled ? useMutation(api.categories.create) : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateCategory = convexEnabled ? useMutation(api.categories.update) : undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deleteCategory = convexEnabled ? useMutation(api.categories.remove) : undefined;

  const [localRows, setLocalRows] = useState<CategoryRow[]>([]);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [deletedSlugs, setDeletedSlugs] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState<CategoryRow | null>(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<CategoryForm>({ name: "" });
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);

  useEffect(() => {
    if (!convexEnabled) {
      const loadCategories = () => {
        setLocalRows(readLocalRows());
        setOverrides(readOverrides());
        setDeletedSlugs(readDeletedSlugs());
      };

      const timer = window.setTimeout(loadCategories, 0);
      window.addEventListener("storage", loadCategories);
      window.addEventListener("fixx-admin-category-updated", loadCategories);

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("storage", loadCategories);
        window.removeEventListener("fixx-admin-category-updated", loadCategories);
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (convexEnabled && seedDefaults) {
      void seedDefaults({});
    }
  }, [seedDefaults]);

  const rows = useMemo(() => {
    if (convexEnabled) {
      const convexList = Array.isArray(convexRows) ? convexRows.map((doc) => rowFromConvexDoc(doc as CategoryDoc)) : [];
      return convexList.length > 0 ? convexList.sort((a, b) => a.name.localeCompare(b.name)) : baseRows;
    }

    const activeBaseRows = baseRows
      .filter((row) => !deletedSlugs.includes(row.slug))
      .map((row) => {
        const override = overrides[row.slug];
        return override
          ? { ...row, ...override, isDefault: true }
          : row;
      });

    return [...activeBaseRows, ...localRows].sort((a, b) => a.name.localeCompare(b.name));
  }, [baseRows, convexRows, localRows, deletedSlugs, overrides]);

  const totalValue = useMemo(() => rows.reduce((sum, row) => sum + row.value, 0), [rows]);

  function resetForm() {
    setForm({ name: "" });
    setEditingRow(null);
    setShowForm(false);
  }

  function startCreate() {
    setMessage("");
    setEditingRow(null);
    setForm({ name: "" });
    setShowForm(true);
  }

  function startEdit(row: CategoryRow) {
    setMessage("");
    setEditingRow(row);
    setForm({ name: row.name });
    setShowForm(true);
  }

  function saveCategoryLocally(name: string) {
    const slug = categorySlug(name);
    const route = `/category/${slug}`;

    if (editingRow && editingRow.isDefault) {
      const currentOverrides = { ...overrides };
      currentOverrides[editingRow.slug] = { name, slug };
      setOverrides(currentOverrides);
      persistOverrides(currentOverrides);
      setMessage("Category updated.");
      resetForm();
      return;
    }

    const existsInBase = baseRows.some((row) => row.slug === slug && !deletedSlugs.includes(row.slug));
    const existsInLocal = localRows.some((row) => row.slug === slug && row.id !== editingRow?.id);

    if (existsInBase || existsInLocal) {
      setMessage("That category already exists.");
      return;
    }

    const nextRows = editingRow
      ? localRows.map((row) =>
          row.id === editingRow.id
            ? { ...row, name, slug }
            : row,
        )
      : [
          ...localRows,
          {
            id: route,
            name,
            hero: "New category created from admin",
            accent: "from-[#ecf4ff] to-[#d7e8ff]",
            image: "/banners/poco-banner.svg",
            route,
            items: 0,
            value: 0,
            slug,
            isDefault: false,
          },
        ];

    setLocalRows(nextRows);
    persistLocalRows(nextRows);
    setMessage(editingRow ? "Category updated." : "Category created.");
    resetForm();
  }

  async function handleSaveCategory() {
    const name = form.name.trim();
    console.log("[Category] handleSaveCategory called, name:", name, "convexEnabled:", convexEnabled, "editingRow:", editingRow?.id);

    if (!name) {
      setMessage("Please enter a category name.");
      return;
    }

    if (convexEnabled) {
      if (!createCategory || !updateCategory) {
        setMessage("Category actions are not ready yet.");
        return;
      }

      try {
        if (editingRow) {
          await updateCategory({
            id: editingRow.id,
            name,
            tagline: "Category details",
            accent: editingRow.accent || "from-[#ecf4ff] to-[#d7e8ff]",
            image: editingRow.image || "/banners/poco-banner.svg",
          });
          setMessage("Category updated.");
        } else {
          await createCategory({
            name,
            tagline: "New category created from admin",
            accent: "from-[#ecf4ff] to-[#d7e8ff]",
            image: "/banners/poco-banner.svg",
          });
          setMessage("Category created.");
        }

        resetForm();
      } catch (error) {
        console.error("[Category] Save error:", error);
        setMessage(error instanceof Error ? error.message : "Something went wrong.");
      }

      return;
    }

    saveCategoryLocally(name);
  }

  function confirmDelete() {
    setDeleteTarget(null);
    const row = deleteTarget;
    if (!row) return;

    if (convexEnabled) {
      if (!deleteCategory) {
        setMessage("Category delete is not ready yet.");
        return;
      }

      (async () => {
        try {
          await deleteCategory({ id: row.id });
          setMessage("Category deleted.");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Something went wrong.");
        }
      })();

      return;
    }

    if (row.isDefault) {
      const currentDeleted = [...deletedSlugs, row.slug];
      setDeletedSlugs(currentDeleted);
      persistDeletedSlugs(currentDeleted);
      setMessage("Category deleted.");
      return;
    }

    const nextRows = localRows.filter((item) => item.id !== row.id);
    setLocalRows(nextRows);
    persistLocalRows(nextRows);
    setMessage("Category deleted.");
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  async function handleDeleteCategory(row: CategoryRow) {
    setDeleteTarget(row);
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-gray-900 px-6 py-6 text-white">
        <p className="text-xs font-semibold text-blue-300">Admin / Category</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Category management</h1>
            <p className="mt-1 text-sm text-gray-300">Browse, create, and manage categories.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Back</Link>
            <Link href="/super-admin/settings/branding" className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10">Branding</Link>
            <button type="button" onClick={startCreate} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Create</button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-lg border bg-gray-50 p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500">Categories</p>
              <h2 className="mt-1 text-xl font-semibold">{rows.length} categories</h2>
            </div>
            <p className="text-sm text-gray-500">Total value Rs. {totalValue.toFixed(2)}</p>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border bg-white">
            <div className="grid grid-cols-[1.2fr_0.6fr_0.9fr_0.8fr_0.6fr] gap-4 border-b bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
              <span>Category</span>
              <span>Items</span>
              <span>Value</span>
              <span>Open</span>
              <span>Action</span>
            </div>
            <div className="divide-y">
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-[1.2fr_0.6fr_0.9fr_0.8fr_0.6fr] gap-4 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{row.name}</p>
                    <p className="text-xs text-gray-500">{row.hero}</p>
                  </div>
                  <span className="text-gray-600">{row.items}</span>
                  <span className="text-gray-600">Rs. {row.value.toFixed(2)}</span>
                  <Link href={row.route} className="font-medium text-blue-600">View</Link>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => startEdit(row)} className="font-medium text-gray-600 hover:text-blue-600">Edit</button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteCategory(row)}
                      className="font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">Quick links</p>
            <div className="mt-3 space-y-1">
              {rows.map((row) => (
                <Link key={row.id} href={row.route} className="block rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  {row.name}
                </Link>
              ))}
            </div>
          </div>

          {showForm ? (
            <div className="rounded-lg border bg-white p-4">
              <p className="text-xs font-semibold text-gray-500">{editingRow ? "Edit category" : "Add category"}</p>
              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Category name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="Example: Fashion"
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={resetForm} className="rounded-md border px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="button" onClick={() => { console.log("[Category] Create button clicked"); handleSaveCategory(); }} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    {editingRow ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">Status</p>
            <p className="mt-2 text-sm text-gray-600">
              {convexEnabled ? "Connected to Convex" : "Using local browser storage"}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-700">{message}</p>
          </div>
        </aside>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <p className="text-sm font-medium text-gray-900">
              Are you sure you want to delete "{deleteTarget.name}"?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={cancelDelete} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">No</button>
              <button type="button" onClick={confirmDelete} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Yes</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function AdminCategoryPage() {
  return <CategoryPanel />;
}
