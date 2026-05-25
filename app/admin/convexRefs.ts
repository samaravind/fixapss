import { api } from "../../convex/_generated/api";

export const convexRefs = {
  categories: {
    getAll: api.categories.getAll,
    getBySlug: api.categories.getBySlug,
    create: api.categories.create,
    update: api.categories.update,
    remove: api.categories.remove,
    seedDefaults: api.categories.seedDefaults,
  },
  products: {
    getAll: api.products.getAll,
    getByCategory: api.products.getByCategory,
    create: api.products.create,
    update: api.products.update,
    remove: api.products.remove,
    seedDefaults: api.products.seedDefaults,
  },
} as const;
