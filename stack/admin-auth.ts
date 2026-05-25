import type { CurrentServerUser } from "@stackframe/stack";
import { redirect } from "next/navigation";
import { stackServerApp } from "./server";

const ADMIN_ROLE = "admin";
const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function readRole(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") {
    return "";
  }

  const role = (metadata as { role?: unknown }).role;
  return typeof role === "string" ? role.trim().toLowerCase() : "";
}

export function isAdminUser(user: CurrentServerUser | null) {
  if (!user) {
    return false;
  }

  const email = normalizeEmail(user.primaryEmail);
  const metadataRole = readRole(user.serverMetadata) || readRole(user.clientMetadata);

  return metadataRole === ADMIN_ROLE || (configuredAdminEmail ? email === configuredAdminEmail : false);
}

export async function getAdminUser() {
  const user = await stackServerApp.getUser();
  return isAdminUser(user) ? user : null;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
