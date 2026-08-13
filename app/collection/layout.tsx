import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "La collection Raonaq : TRIO, SOFT, JOUR, VOLUME, GO et DUO. Outils de coiffage — volume, lisse, brillance. Livraison gratuite au Maroc. Inspectez, puis payez.",
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
