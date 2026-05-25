"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-[#dfe5ee] bg-[#172337] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fb3ff]">Fixx Market</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            A clean marketplace-style shopping experience with featured deals, category browsing,
            and quick access to cart, wishlist, and login.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Quick Links</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link href="/" className="block transition hover:text-white">Home</Link>
            <Link href="/cart" className="block transition hover:text-white">Cart</Link>
            <Link href="/wishlist" className="block transition hover:text-white">Wishlist</Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Account</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link href="/login" className="block transition hover:text-white">Login</Link>
            <Link href="/login" className="block transition hover:text-white">Register</Link>
            <span className="block">Orders</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Help</p>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link href="/admin" className="block transition hover:text-white">Admin panel</Link>
            <span className="block">Customer Care</span>
            <span className="block">Shipping & Delivery</span>
            <span className="block">Returns & Refunds</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>2026 Fixx Market. All rights reserved.</p>
          <p>Blue-toned marketplace UI inspired by fast commerce browsing.</p>
        </div>
      </div>
    </footer>
  );
}
