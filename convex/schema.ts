import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    tagline: v.string(),
    accent: v.string(),
    image: v.string(),
    isDefault: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    categorySlug: v.string(),
    price: v.string(),
    oldPrice: v.optional(v.string()),
    brand: v.optional(v.string()),
    seller: v.optional(v.string()),
    rating: v.optional(v.string()),
    reviews: v.optional(v.string()),
    shipping: v.optional(v.string()),
    discount: v.optional(v.string()),
    image: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    description: v.optional(v.string()),
    specification: v.optional(v.string()),
    quantity: v.optional(v.string()),
    minQuantity: v.optional(v.string()),
    badge: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]).index("by_categorySlug", ["categorySlug"]),
});
