"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ADMIN_AUTH_COOKIE,
  clearAdminCredentials,
  normalizeAdminEmail,
  readAdminCredentials,
  writeAdminCredentials,
} from "../../../lib/admin-credentials";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<ReturnType<typeof readAdminCredentials>>(null);
  const [mode, setMode] = useState<"create" | "login">("create");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const resolvedAdminCredentials = mounted ? adminCredentials ?? readAdminCredentials() : null;

  const panelTitle = mode === "create" ? "Create Admin" : "Admin Login";
  const panelHint = mode === "create" ? "Set up the separate admin ID and password here." : "Sign in with the saved admin credentials.";

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);

    if (searchParams.get("logout") === "1") {
      clearAdminCredentials();
      document.cookie = `${ADMIN_AUTH_COOKIE}=; Max-Age=0; path=/`;
      router.replace("/admin/login");
    }
    return () => window.clearTimeout(timer);
  }, [router, searchParams]);

  const handleSaveAdminCredentials = () => {
    const normalizedEmail = normalizeAdminEmail(email);
    const normalizedPassword = password.trim();

    if (!normalizedEmail) {
      setMessage("Please enter the admin email.");
      return;
    }

    if (!normalizedPassword) {
      setMessage("Please enter the admin password.");
      return;
    }

    if (normalizedPassword.length < 6) {
      setMessage("Admin password must be at least 6 characters.");
      return;
    }

    if (confirmPassword.trim() !== normalizedPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    writeAdminCredentials({ email: normalizedEmail, password: normalizedPassword });
    setAdminCredentials({ email: normalizedEmail, password: normalizedPassword, updatedAt: new Date().toISOString() });
    document.cookie = `${ADMIN_AUTH_COOKIE}=true; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
    setMessage("Admin ID and password saved.");
    setPassword("");
    setConfirmPassword("");
    router.push("/admin");
  };

  const handleSubmit = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const credentials = resolvedAdminCredentials;

    if (!normalizedEmail) {
      setMessage("Please enter the admin email.");
      return;
    }

    if (!normalizedPassword) {
      setMessage("Please enter the admin password.");
      return;
    }

    if (!credentials) {
      setMessage("Create the admin ID and password first.");
      return;
    }

    if (normalizedEmail !== credentials.email || normalizedPassword !== credentials.password) {
      setMessage("Invalid admin credentials.");
      return;
    }

    document.cookie = `${ADMIN_AUTH_COOKIE}=true; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
    setMessage("Admin logged in successfully.");
    setPassword("");
    router.push("/admin");
  };

  const handleLogout = () => {
    document.cookie = `${ADMIN_AUTH_COOKIE}=; Max-Age=0; path=/`;
    setAdminCredentials(null);
    setMessage("Admin session cleared.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef2f1] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="absolute right-0 top-0 h-40 w-40 bg-[#e35a66] [clip-path:polygon(100%_0,100%_100%,0_0)] sm:h-48 sm:w-48" />
      <div className="absolute bottom-0 left-0 h-44 w-44 rounded-tr-[999px] bg-[#f4c93d] sm:h-56 sm:w-56" />

      <div className="relative mx-auto max-w-5xl">
        <section className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="flex min-h-[360px] flex-col justify-between bg-[linear-gradient(180deg,#44c1aa_0%,#3bb49d_100%)] px-8 py-10 text-white sm:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/40 text-sm font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">Admin Panel</p>
                <p className="text-xs text-white/75">Fixx Market</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {mode === "create" ? "Welcome Back!" : "Need an admin account?"}
                </p>
                <p className="mt-4 max-w-xs text-sm leading-7 text-white/85">
                  {mode === "create"
                    ? "Create the separate admin ID and password first, then sign in directly to the dashboard."
                    : "Switch to create mode to set up the admin email and password for the first time."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMode(mode === "create" ? "login" : "create")}
                className="inline-flex w-fit items-center justify-center rounded-full border border-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-[#3bb49d]"
              >
                {mode === "create" ? "Sign In" : "Create"}
              </button>
            </div>
          </aside>

          <div className="bg-white px-6 py-10 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-[420px]">
              <div className="text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-[#37b4a2]">{panelTitle}</h1>
                <p className="mt-3 text-sm text-slate-500">{panelHint}</p>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                {["f", "G+", "in"].map((label) => (
                  <div
                    key={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-600"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-slate-400">
                or use your email for registration:
              </p>

              <div className="mt-6 space-y-3">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                  <input
                    id="admin-email"
                    name="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    className="w-full border-0 bg-[#f3f6f5] py-3 pl-10 pr-4 text-sm outline-none ring-1 ring-inset ring-transparent transition placeholder:text-slate-400 focus:ring-[#37b4a2]"
                  />
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">#</span>
                  <input
                    id="admin-password"
                    name="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="w-full border-0 bg-[#f3f6f5] py-3 pl-10 pr-4 text-sm outline-none ring-1 ring-inset ring-transparent transition placeholder:text-slate-400 focus:ring-[#37b4a2]"
                  />
                </div>

                {mode === "create" ? (
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">#</span>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm password"
                      className="w-full border-0 bg-[#f3f6f5] py-3 pl-10 pr-4 text-sm outline-none ring-1 ring-inset ring-transparent transition placeholder:text-slate-400 focus:ring-[#37b4a2]"
                    />
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={mode === "create" ? handleSaveAdminCredentials : handleSubmit}
                  className="mx-auto mt-2 block rounded-full bg-[#37b4a2] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#2ea691]"
                >
                  {mode === "create" ? (resolvedAdminCredentials ? "Update Admin" : "Create Admin") : "Sign In"}
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-slate-500">
                  {resolvedAdminCredentials ? `Saved admin: ${resolvedAdminCredentials.email}` : "No admin ID saved yet"}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-medium text-[#37b4a2] transition hover:text-[#2ea691]"
                >
                  Clear session
                </button>
              </div>

              {message ? (
                <p className="mt-4 rounded-2xl bg-[#f3f6f5] px-4 py-3 text-sm text-slate-700">{message}</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
