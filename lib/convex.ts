"use client";

import { ConvexReactClient } from "convex/react";
import { api } from "../convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ?? "";

export const convexEnabled = Boolean(convexUrl);
export const convexClient = convexEnabled ? new ConvexReactClient(convexUrl) : null;
export { api };
