import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrivez à Raonaq depuis Casablanca : WhatsApp, e-mail, ou un message. Nous confirmons la commande par téléphone. Livraison gratuite dans tout le Maroc.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
