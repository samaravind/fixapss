import { buildSlug, catalog, type Product } from "../page";
import CheckoutClient from "./checkout-client";

function findProductBySlug(slug: string): Product | null {
  for (const [category, items] of Object.entries(catalog)) {
    for (let index = 0; index < items.length; index += 1) {
      const product = items[index];
      if (buildSlug(category, product.name, index) === slug) {
        return product;
      }
    }
  }

  return null;
}

type CheckoutPageProps = {
  searchParams?: Promise<{ slug?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = (await searchParams) ?? {};
  const slug = params.slug ?? "";
  const product = slug ? findProductBySlug(slug) : null;

  return <CheckoutClient slug={slug} initialProduct={product} />;
}
