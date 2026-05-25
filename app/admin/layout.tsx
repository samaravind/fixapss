import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { ADMIN_AUTH_COOKIE } from "../../lib/admin-session";
import AdminShell from "./admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get(ADMIN_AUTH_COOKIE)?.value === "true";

  return <AdminShell adminSession={adminSession}>{children}</AdminShell>;
}
