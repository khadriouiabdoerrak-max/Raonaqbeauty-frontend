import type { Metadata } from "next";
import { getProductBySlug, products } from "../../../lib/products";
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
  if (!product) return { title: "منتج غير موجود | رونق" };

  return {
    title: `${product.name} | رونق — Raonaq Beauty`,
    description: `${product.tagline}. ${product.description}`,
    openGraph: {
      title: `${product.name} | رونق`,
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
  return <ProductClient product={product} />;
}
