"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ADMIN_AUTH_COOKIE,
  clearAdminCredentials,
  type AdminCredentials,
  readAdminCredentials,
  writeAdminCredentials,
} from "../../../../lib/admin-credentials";

export default function AdminCredentialsSettingsPage() {
  const router = useRouter();
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(() => readAdminCredentials());
  const [email, setEmail] = useState(() => adminCredentials?.email ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const buttonLabel = useMemo(() => "Save admin credentials", []);

  const handleSave = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail) {
      setMessage("Please enter an admin email.");
      return;
    }

    if (!normalizedPassword) {
      setMessage("Please enter an admin password.");
      return;
    }

    if (normalizedPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (confirmPassword.trim() !== normalizedPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    writeAdminCredentials({ email: normalizedEmail, password: normalizedPassword });
    setAdminCredentials({ email: normalizedEmail, password: normalizedPassword, updatedAt: new Date().toISOString() });
    document.cookie = `${ADMIN_AUTH_COOKIE}=true; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
    setMessage("Admin credentials saved successfully.");
    setPassword("");
    setConfirmPassword("");
    router.push("/admin");
  };

  const handleClear = () => {
    clearAdminCredentials();
    setMessage("Admin credentials cleared.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-[#f1f3f6] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-[2rem] border border-[#dfe5ee] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Admin settings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin credentials</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Create or change the dedicated admin ID and password here. These are the credentials used on the admin
            login page.
          </p>

          <div className="mt-8 grid gap-4">
            <div>
              <label htmlFor="settings-email" className="mb-2 block text-sm font-medium text-stone-700">
                Admin email
              </label>
              <input
                id="settings-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@fixx.com"
                className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="settings-password" className="mb-2 block text-sm font-medium text-stone-700">
                Admin password
              </label>
              <input
                id="settings-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="settings-confirm" className="mb-2 block text-sm font-medium text-stone-700">
                Confirm password
              </label>
              <input
                id="settings-confirm"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-[#172337] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f172a]"
              >
                {buttonLabel}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear saved admin
              </button>
              <Link
                href="/admin/login"
                className="rounded-full border border-[#2874f0] px-5 py-3 text-sm font-semibold text-[#2874f0] transition hover:bg-[#eef4ff]"
              >
                Back to login
              </Link>
            </div>

            <p className="min-h-5 text-sm text-slate-700">{message}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
