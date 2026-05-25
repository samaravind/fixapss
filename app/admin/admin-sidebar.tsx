import Link from "next/link";

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

function IconPackage() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3.5 7.5 12 3l8.5 4.5L12 12 3.5 7.5Z" strokeLinejoin="round" />
      <path d="M3.5 7.5V16.5L12 21l8.5-4.5V7.5" strokeLinejoin="round" />
      <path d="M12 12v9" strokeLinecap="round" />
    </svg>
  );
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: IconPackage },
  { label: "Category", href: "/admin/category", icon: IconPackage },
  { label: "Products", href: "/admin/products", icon: IconBag },
  { label: "Users", href: "/admin/users", icon: IconUsers },
];

export default function AdminSidebar({ adminSession }: { adminSession: boolean }) {
  return (
    <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
      <div className="rounded-[2rem] border border-[#dfe5ee] bg-[#172337] p-5 text-white shadow-[0_18px_60px_rgba(15,23,42,0.14)] lg:h-full">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white font-bold text-[#172337]">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Admin Panel</p>
            <p className="text-xs text-slate-300">Fixx Market</p>
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fb3ff]">Session</p>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {adminSession ? (
              <>
                <p className="font-semibold text-white">Authenticated admin</p>
                <p className="text-slate-300">Signed in for admin access</p>
                <Link href="/admin/login?logout=1" className="inline-flex font-semibold text-[#8fb3ff] transition hover:text-white">
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <p className="font-semibold text-white">Not signed in</p>
                <Link href="/admin/login" className="inline-flex font-semibold text-[#8fb3ff] transition hover:text-white">
                  Admin login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fb3ff]">Quick links</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <Link href="/" className="block transition hover:text-white">
              Back to store
            </Link>
            <Link href="/admin/settings/admin-credentials" className="block transition hover:text-white">
              Admin credentials
            </Link>
            <Link href="/admin/login" className="block transition hover:text-white">
              Admin login
            </Link>
            <Link href="/cart" className="block transition hover:text-white">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
