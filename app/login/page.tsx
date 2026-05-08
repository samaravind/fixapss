"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const USERS_STORAGE_KEY = "fixx-users";
const CURRENT_USER_KEY = "fixx-current-user";

type User = {
  email: string;
  password: string;
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setCurrentUser(stored);
      }
    } catch {
      setCurrentUser("");
    }
  }, []);

  const buttonLabel = useMemo(() => {
    return currentUser ? "Logged in" : "Login / Create user";
  }, [currentUser]);

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setMessage("Please enter both email ID and password.");
      return;
    }

    const existingUsers = readUsers();
    const match = existingUsers.find((user) => user.email === normalizedEmail);

    if (match) {
      if (match.password !== password) {
        setMessage("Password does not match this email.");
        return;
      }

      window.localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
      setCurrentUser(normalizedEmail);
      setMessage("Logged in successfully.");
      return;
    }

    const nextUsers = [...existingUsers, { email: normalizedEmail, password }];
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
    window.localStorage.setItem(CURRENT_USER_KEY, normalizedEmail);
    setCurrentUser(normalizedEmail);
    setMessage("User created and logged in.");
  };

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
          Back to shop
        </Link>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Login
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Email ID and password</h1>

          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleLogin();
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
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

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
                className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            {message ? (
              <p className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-700">{message}</p>
            ) : null}

            {currentUser ? (
              <p className="text-sm text-emerald-700">Current user: {currentUser}</p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {buttonLabel}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
