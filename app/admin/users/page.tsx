"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const USERS_STORAGE_KEY = "fixx-users";
const CURRENT_USER_KEY = "fixx-current-user";
const CART_STORAGE_KEY = "fixx-cart";
const WISHLIST_STORAGE_KEY = "fixx-wishlist";

type User = {
  email: string;
  password: string;
  mobile?: string;
  name?: string;
  createdAt?: string;
};

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

function formatDate(value?: string) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "name-asc" | "name-desc" | "email-asc" | "email-desc">("newest");

  useEffect(() => {
    const syncData = () => {
      const nextUsers = readJson<User[]>(USERS_STORAGE_KEY, []);

      setUsers(nextUsers);
      setCartCount(readJson<unknown[]>(CART_STORAGE_KEY, []).length);
      setWishlistCount(readJson<unknown[]>(WISHLIST_STORAGE_KEY, []).length);

      try {
        const raw = window.localStorage.getItem(CURRENT_USER_KEY);
        if (!raw) {
          setCurrentUser("");
          return;
        }

        const parsed = JSON.parse(raw) as { name?: string; email?: string } | string;
        if (typeof parsed === "string") {
          setCurrentUser(parsed);
          return;
        }

        setCurrentUser(parsed.name || parsed.email || "");
      } catch {
        setCurrentUser("");
      }
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

  const sortedUsers = useMemo(() => {
    const copy = [...users];
    switch (sortBy) {
      case "name-asc":
        copy.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        break;
      case "name-desc":
        copy.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
        break;
      case "email-asc":
        copy.sort((a, b) => a.email.localeCompare(b.email));
        break;
      case "email-desc":
        copy.sort((a, b) => b.email.localeCompare(a.email));
        break;
      default:
        copy.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
    }
    return copy;
  }, [users, sortBy]);

  const totalUsers = users.length;
  const withMobile = useMemo(() => users.filter((user) => Boolean(user.mobile)).length, [users]);
  const withName = useMemo(() => users.filter((user) => Boolean(user.name)).length, [users]);
  const latestSignup = sortedUsers[0];

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-gray-900 px-6 py-6 text-white">
        <p className="text-xs font-semibold text-blue-300">Admin / Users</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Registered users</h1>
            <p className="mt-1 text-sm text-gray-300">Customer signups with stored account details.</p>
          </div>
          <Link href="/admin" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">Back</Link>
        </div>
      </div>

      <div className="grid gap-4 border-b bg-gray-50 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total users</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{totalUsers}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">With mobile</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{withMobile}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">With name</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{withName}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Current session</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{currentUser || "No active user"}</p>
          <p className="text-xs text-gray-500">{latestSignup ? `Latest: ${latestSignup.email}` : "No signups yet"}</p>
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-lg border bg-gray-50 p-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500">Accounts</p>
              <h2 className="mt-1 text-xl font-semibold">{totalUsers} registered users</h2>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-500">
              Sort by
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                className="rounded-md border bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="newest">Newest first</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="email-asc">Email A-Z</option>
                <option value="email-desc">Email Z-A</option>
              </select>
            </label>
          </div>

          {sortedUsers.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed bg-white px-4 py-6 text-sm text-gray-500">No users have been saved yet.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {sortedUsers.map((user) => (
                <div key={user.email} className="rounded-lg border bg-white p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-500">User profile</p>
                      <h3 className="mt-1 text-lg font-semibold text-gray-900">{user.name || user.email}</h3>
                      <div className="mt-2 grid gap-1 text-sm text-gray-600 sm:grid-cols-2">
                        <p><span className="font-medium text-gray-900">Email:</span> {user.email}</p>
                        <p><span className="font-medium text-gray-900">Mobile:</span> {user.mobile || "Not added"}</p>
                        <p><span className="font-medium text-gray-900">Joined:</span> {formatDate(user.createdAt)}</p>
                        <p><span className="font-medium text-gray-900">Password:</span> Stored</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                        {user.mobile ? "Mobile linked" : "Email only"}
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Signup record</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">Signals</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-md bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-500">Current session</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{currentUser || "No active user"}</p>
              </div>
              <div className="rounded-md bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-500">Cart items</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{cartCount}</p>
              </div>
              <div className="rounded-md bg-gray-50 px-4 py-3">
                <p className="text-sm text-gray-500">Wishlist items</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{wishlistCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">Info</p>
            <p className="mt-2 text-sm text-gray-600">
              New signups from the login page are stored in <code className="rounded bg-gray-100 px-1">fixx-users</code> and appear here.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
