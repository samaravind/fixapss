"use client";

import { ConvexProvider } from "convex/react";
import type { ReactNode } from "react";
import { convexClient } from "../lib/convex";

export default function AppConvexProvider({ children }: { children: ReactNode }) {
  if (!convexClient) {
    return children;
  }

  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
