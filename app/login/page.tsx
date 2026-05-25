"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const USERS_STORAGE_KEY = "fixx-users";
const CURRENT_USER_KEY = "fixx-current-user";

type User = {
  email: string;
  password: string;
  mobile?: string;
  name?: string;
  createdAt?: string;
};

type CurrentUser = {
  email: string;
  name: string;
};

function readUsers(): User[] {
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as User[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const buttonLabel = useMemo(() => {
    if (mode === "signup") {
      return "Create User";
    }

    return "Login";
  }, [mode]);

  const handleAuth = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage("Please enter your email ID.");
      return;
    }

    const existingUsers = readUsers();
    const match = existingUsers.find((user) => user.email === normalizedEmail);

    if (mode === "login") {
      if (!password.trim()) {
        setMessage("Please enter your password.");
        return;
      }

      if (!match) {
        setMessage("No account found for this email. Please sign up first.");
        return;
      }

      if (match.password !== password) {
        setMessage("Password does not match this email.");
        return;
      }

      const currentUserData: CurrentUser = {
        email: normalizedEmail,
        name: match?.name ?? normalizedEmail,
      };
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUserData));
      window.dispatchEvent(new Event("storage"));
      setMessage("Logged in successfully.");
      setPassword("");
      router.push("/");
      return;
    }

    if (match) {
      setMessage("Account already exists. Please log in instead.");
      return;
    }

    const normalizedMobile = mobile.trim();
    const normalizedName = name.trim();

    if (!normalizedMobile) {
      setMessage("Please enter your mobile number.");
      return;
    }

    if (!normalizedName) {
      setMessage("Please enter your name.");
      return;
    }

    if (!password.trim()) {
      setMessage("Please enter a password.");
      return;
    }

    if (password.trim().length < 6) {
      setMessage("Passwords must be at least 6 characters.");
      return;
    }

    const nextUsers = [
      ...existingUsers,
      {
        email: normalizedEmail,
        password: password.trim(),
        mobile: normalizedMobile,
        name: normalizedName,
        createdAt: new Date().toISOString(),
      },
    ];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    const currentUserData: CurrentUser = {
      email: normalizedEmail,
      name: normalizedName,
    };
    window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUserData));
    window.dispatchEvent(new Event("storage"));
    setMessage("User created successfully.");
    setPassword("");
    setMobile("");
    setName("");
    router.push("/");
  };

  const handleForgotPassword = () => {
    setMessage("Forgot password? Please use the recovery flow.");
  };

  return (
    <main className="min-h-screen bg-[#f1f3f6] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden overflow-hidden rounded-[2.25rem] border border-[#e2e7f0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6 md:p-8 lg:block">
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8fbff] via-white to-[#eef4ff] p-4 sm:min-h-[520px] sm:p-8">
            <div className="absolute inset-0 rounded-[2rem] opacity-40" />
            <div className="relative w-full max-w-[720px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-6">
              <Image
                src="/login-illustration.png"
                alt="Login illustration"
                width={1200}
                height={1200}
                priority
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#e2e7f0] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Login</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Email ID and password</h1>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-full bg-[#f1f5ff] p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "login" ? "bg-[#2874f0] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "signup" ? "bg-[#2874f0] text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleAuth();
            }}
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
                Email ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
              />
            </div>

            {mode === "login" ? (
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
                />
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="mobile" className="mb-2 block text-sm font-medium text-stone-700">
                    Mobile number
                  </label>
                  <div className="flex gap-2">
                    <select
                      defaultValue="+91"
                      className="w-24 rounded-xl border border-slate-300 bg-[#f7f9fc] px-3 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
                    >
                      <option>IN +91</option>
                    </select>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(event) => setMobile(event.target.value)}
                      placeholder="Enter your mobile number"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-stone-700">
                    Password (at least 6 characters)
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-300 bg-[#f7f9fc] px-4 py-3 text-sm outline-none transition focus:border-[#2874f0] focus:bg-white"
                  />
                  <p className="mt-2 text-sm text-slate-500">Passwords must be at least 6 characters.</p>
                </div>
              </>
            )}

            {message ? (
              <p className="rounded-xl bg-[#f7f9fc] px-4 py-3 text-sm text-slate-700">{message}</p>
            ) : null}

            {mode === "login" ? (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-[#2874f0] hover:underline"
              >
                Forgot password?
              </button>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#2874f0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f5fc1]"
            >
              {buttonLabel}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
