import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merci — commande enregistrée",
  robots: { index: false, follow: false },
};

/** Thank-you = page marque seule (sans header / footer boutique). */
export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[100dvh]">{children}</div>;
}
