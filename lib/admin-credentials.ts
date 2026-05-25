export const ADMIN_CREDENTIALS_KEY = "fixx-admin-credentials";
export const ADMIN_AUTH_COOKIE = "fixx-admin-auth";

export type AdminCredentials = {
  email: string;
  password: string;
  updatedAt: string;
};

export function normalizeAdminEmail(value: string) {
  return value.trim().toLowerCase();
}

export function readAdminCredentials(): AdminCredentials | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<AdminCredentials> | null;
    if (!parsed?.email || !parsed?.password) {
      return null;
    }

    return {
      email: normalizeAdminEmail(parsed.email),
      password: parsed.password,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeAdminCredentials(input: { email: string; password: string }) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: AdminCredentials = {
    email: normalizeAdminEmail(input.email),
    password: input.password,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(payload));
}

export function clearAdminCredentials() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_CREDENTIALS_KEY);
}
