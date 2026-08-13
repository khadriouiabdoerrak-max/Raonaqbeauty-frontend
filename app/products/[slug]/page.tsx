import type { Metadata } from "next";
import { getProductBySlug, products } from "../../../lib/products";
import { SITE } from "../../../lib/site";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produit introuvable | Raonaq" };

  return {
    title: `${product.name} | Raonaq Beauty`,
    description: `${product.nameFr}. ${product.tagline}. ${product.description}`,
    openGraph: {
      title: `Raonaq ${product.name}`,
      description: product.tagline,
      images: [{ url: product.heroImage }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  const url = `https://${SITE.domain}/products/${product.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Raonaq ${product.name}`,
    image: product.gallery.map((shot) => `https://${SITE.domain}${shot.src}`),
    description: product.description,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: SITE.nameEn,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "MAD",
      price: product.price1,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
