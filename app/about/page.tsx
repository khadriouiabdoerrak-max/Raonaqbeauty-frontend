import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: "La maison",
  description:
    "Raonaq est une maison marocaine de coiffage. Une collection courte pour le volume, le lisse et la brillance, avec protection du cheveu. Vous inspectez, puis vous payez.",
};

const trust = [
  {
    title: "Inspectez, puis payez",
    text: "Le livreur attend à la porte. Vous ouvrez, vous voyez l’outil, puis vous payez. Aucun paiement d’avance.",
  },
  {
    title: "Livraison gratuite au Maroc",
    text: "Depuis Casablanca, vers toutes les villes. Généralement 24 à 48 h — sans frais de livraison.",
  },
  {
    title: "Une collection courte",
    text: "Pas un catalogue au hasard. Chaque outil entre parce qu’il a un résultat clair : volume, lisse, ou brillance.",
  },
  {
    title: "Protection du cheveu",
    text: "Le résultat ne compte que si la fibre reste intacte. Des outils pensés pour un coiffage que l’on peut répéter.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="bg-[#F7F1EC]">
      <section className="container mx-auto px-4 pb-12 pt-14 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium tracking-[0.42em] text-[#C4A484]">
            RAONAQ · {SITE.city}
          </p>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.15] text-[#1C1412] md:text-6xl">
            Une maison marocaine.
            <br />
            Le salon, chez vous.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-8 text-[#1C1412]/60 md:text-base">
            Raonaq est une collection courte d’outils de coiffage — volume, lisse et brillance, avec protection. Sans rendez-vous. La confiance est à la porte : vous voyez, puis vous payez.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-[11px] font-medium text-[#1C1412]/70">
            {["Paiement à la livraison", "Livraison gratuite", "Casablanca"].map((badge) => (
              <span key={badge} className="border border-[#C4A484]/35 bg-white px-4 py-2">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="overflow-hidden bg-[#E8DFD6]">
          <img
            src="/images/raonaq-salon-results.png"
            alt="Résultat Raonaq — volume et lisse, à la maison"
            className="aspect-[16/10] w-full object-cover object-[center_18%] md:aspect-[21/9]"
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:gap-16 md:py-24 lg:grid-cols-2">
          <div className="max-w-lg">
            <p className="text-[11px] font-medium tracking-[0.32em] text-[#C45B6A]">L’HISTOIRE</p>
            <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-[#1C1412] md:text-5xl">
              Le salon donne un résultat.
              <br />
              La maison doit donner la même présence.
            </h2>
            <p className="mt-6 text-[15px] leading-8 text-[#1C1412]/60">
              Raonaq est née au Maroc pour celle qui veut être prête chez elle — sans attendre un rendez-vous. Nous ne ramassons pas des outils partout. Une collection courte, un critère : un résultat professionnel, et la protection du cheveu.
            </p>
            <p className="mt-4 text-[15px] leading-8 text-[#1C1412]/60">
              Siège à Casablanca. Livraison dans tout le Maroc. Le respect est dans la main : vous ouvrez, vous inspectez, puis vous payez.
            </p>
          </div>
          <div className="overflow-hidden bg-[#F7F1EC]">
            <img
              src="/images/raonaq-lifestyle-home.png"
              alt="Coiffer chez soi avec Raonaq"
              className="aspect-[4/5] w-full object-cover object-[center_22%] lg:aspect-[5/6]"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">CONFIANCE</p>
          <h2 className="font-display mt-4 text-3xl font-semibold text-[#1C1412] md:text-5xl">
            Comment nous protégeons la commande
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-8 text-[#1C1412]/55">
            Au Maroc, la confiance ne vient pas d’un slogan. Elle vient de la porte, de l’outil dans la main, d’une maison claire.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {trust.map((item) => (
            <article key={item.title} className="border border-[#C4A484]/25 bg-white px-6 py-8 md:px-8">
              <h3 className="text-lg font-semibold text-[#1C1412]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#1C1412]/55">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1C1412] text-white">
        <div className="container mx-auto max-w-2xl px-4 py-16 text-center md:py-20">
          <p className="text-[11px] font-medium tracking-[0.42em] text-[#C4A484]">LA PROMESSE</p>
          <p className="font-display mt-5 text-3xl font-semibold leading-snug md:text-5xl">
            Ouvrez · inspectez · puis payez
          </p>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-8 text-white/55">
            Nous confirmons la commande par téléphone avant l’expédition. L’outil arrive à votre porte. Vous le voyez. Puis vous réglez.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto max-w-xl px-4 py-16 text-center md:py-24">
          <h2 className="font-display text-3xl font-semibold leading-tight text-[#1C1412] md:text-4xl">
            L’outil qui ressemble à votre cheveu
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-8 text-[#1C1412]/50">
            Une collection courte. Le même critère. Livraison gratuite dans tout le Maroc.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/collection" className="btn btn-primary btn-lg min-w-[200px]">
              Voir la collection
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg min-w-[200px]">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
