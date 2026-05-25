import { catalog, categories, categorySlug, type Product } from "../../store-data";

type CategoryDoc = {
  name: string;
  slug: string;
};

type CreateCategoryFn = (input: { name: string; description?: string }) => Promise<{ slug: string } | null | undefined>;

type CreateProductFn = (input: {
  name: string;
  categorySlug: string;
  price: string;
  oldPrice?: string;
  brand?: string;
  seller?: string;
  rating?: string;
  reviews?: string;
  shipping?: string;
  discount?: string;
  image?: string;
  badge?: string;
}) => Promise<unknown>;

function toDescription(categoryName: string) {
  const item = categories.find((entry) => entry.label === categoryName);
  return item?.tagline || `Imported from the storefront catalog`;
}

function toProductInput(product: Product, categorySlugValue: string) {
  return {
    name: product.name,
    categorySlug: categorySlugValue,
    price: product.price,
    oldPrice: product.oldPrice,
    brand: product.brand,
    seller: product.seller,
    rating: product.rating,
    reviews: product.reviews,
    shipping: product.shipping,
    discount: product.discount,
    image: product.image,
    badge: product.badge,
  };
}

export async function seedStorefrontCatalog({
  existingCategories,
  createCategory,
  createProduct,
}: {
  existingCategories: CategoryDoc[];
  createCategory: CreateCategoryFn;
  createProduct: CreateProductFn;
}) {
  const slugByCategory = new Map(existingCategories.map((category) => [category.name, category.slug]));

  for (const category of categories) {
    if (!slugByCategory.has(category.label)) {
      const created = await createCategory({ name: category.label, description: category.tagline });
      if (created?.slug) {
        slugByCategory.set(category.label, created.slug);
      } else {
        slugByCategory.set(category.label, categorySlug(category.label));
      }
    }
  }

  for (const [categoryName, products] of Object.entries(catalog)) {
    const resolvedSlug = slugByCategory.get(categoryName) ?? categorySlug(categoryName);
    for (const product of products) {
      await createProduct(toProductInput(product, resolvedSlug));
    }
  }
}

export function getStorefrontCategoryDescription(categoryName: string) {
  return toDescription(categoryName);
}
