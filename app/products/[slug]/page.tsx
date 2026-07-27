// Server Component — يجلب البيانات ويمررها للـ Client
import { getProductBySlug } from "../../../lib/products";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

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
