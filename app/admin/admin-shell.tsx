"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AdminSidebar from "./admin-sidebar";

type AdminShellProps = {
  adminSession: boolean;
  children: ReactNode;
};

export default function AdminShell({ adminSession, children }: AdminShellProps) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/admin/login";

  return (
    <main className="min-h-screen bg-[#f1f3f6] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className={showSidebar ? "mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[260px_minmax(0,1fr)]" : "mx-auto w-full max-w-6xl"}>
        {showSidebar ? <AdminSidebar adminSession={adminSession} /> : null}
        <div className={showSidebar ? "space-y-6" : ""}>{children}</div>
      </div>
    </main>
  );
}
