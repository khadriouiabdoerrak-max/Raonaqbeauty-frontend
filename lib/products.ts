export type ProductFaq = { q: string; a: string };

export type ProductShot = {
  src: string;
  label: string;
};

export type ProductReview = {
  name: string;
  city: string;
  text: string;
  rating?: number;
  photo?: string;
};

export type HairFit = "yes" | "ok" | "no";
export type HairTypeId = "thick" | "fine" | "curly" | "daily" | "short" | "long";

export const HAIR_TYPES: { id: HairTypeId; label: string }[] = [
  { id: "thick", label: "Épais" },
  { id: "fine", label: "Fin" },
  { id: "curly", label: "Bouclé" },
  { id: "daily", label: "Quotidien" },
  { id: "short", label: "Court" },
  { id: "long", label: "Mi-long / long" },
];

export type ProductSpec = { k: string; v: string };

export type Product = {
  id: string;
  slug: string;
  /** Nom d’outil style maison : TRIO / VOLUME — le logo reste Raonaq */
  name: string;
  /** Ligne de métier sous le nom */
  nameFr: string;
  chips: string[];
  hairGuide: { label: string; setting: string; note: string }[];
  modelNote: string;
  tag?: string;
  tagline: string;
  description: string;
  bestFor: string;
  result: string;
  cardCopy: string;
  pain: string;
  promise: string;
  forWho: string[];
  hair: Record<HairTypeId, HairFit>;
  specs: ProductSpec[];
  protectHow: string;
  styleTime: string;
  compareLine: string;
  features: string[];
  techTitle: string;
  techPoints: string[];
  inBox: string[];
  howTo: string[];
  faqs: ProductFaq[];
  voice: { name: string; city: string; text: string };
  price1: number;
  price2: number;
  /** Ancien prix affiché barré — seulement si réel */
  priceWas?: number;
  heroImage: string;
  gallery: ProductShot[];
  /** Déposez le fichier dans /public/videos puis renseignez le chemin, ex. /videos/raonaq-trio.mp4 */
  video?: string;
  /** Avis réels uniquement — laissez vide jusqu’aux premiers retours */
  reviews: ProductReview[];
};

export const PDP_PROOF = [
  { t: "Livraison gratuite", d: "Partout au Maroc, généralement 24–48 h." },
  { t: "Paiement à la livraison", d: "Vous inspectez, puis vous payez." },
  { t: "Pièce Raonaq", d: "Écrin maison. Confirmation par téléphone." },
  { t: "WhatsApp", d: "Avant et après la commande. Défaut : remplacement." },
] as const;

/** Bandeau confiance PDP — style Massima, promesse Raonaq (Maroc / COD) */
export const PDP_TRUST_STRIP = [
  { id: "ship", label: "Livraison gratuite", detail: "Maroc · 24–48 h" },
  { id: "cod", label: "Inspectez, puis payez", detail: "Paiement à la livraison" },
  { id: "swap", label: "Remplacement si défaut", detail: "Via WhatsApp" },
  { id: "heat", label: "Protection chaleur", detail: "Cheveu préservé" },
  { id: "support", label: "Support sous 1 jour", detail: "Jour ouvré · WhatsApp" },
] as const;

export const COMMON_PDP_FAQS: ProductFaq[] = [
  {
    q: "Puis-je refuser à la livraison ?",
    a: "Oui. Le livreur attend que vous ouvriez et vérifiiez. Si l’outil ne vous convient pas, vous ne payez pas. Aucun paiement d’avance.",
  },
  {
    q: "L’appareil fonctionne-t-il au Maroc (220 V) ?",
    a: "Oui. Les outils Raonaq sont prévus pour 220–240 V — les prises de la maison, sans adaptateur.",
  },
  {
    q: "Que se passe-t-il en cas de défaut ?",
    a: "Envoyez-nous une photo sur WhatsApp. Nous remplaçons l’appareil. L’inspection à la porte vous protège aussi avant le paiement.",
  },
  {
    q: "Est-ce bien une pièce Raonaq ?",
    a: "Oui. Elle arrive en écrin Raonaq, d’une collection courte. Nous confirmons chaque commande par téléphone avant l’expédition.",
  },
];

export const productThumb = (p: Product): string => p.gallery[0]?.src ?? p.heroImage;

/** % économie si prix barré réel — sinon null (pas de faux rabais) */
export function productSavePercent(p: Product): number | null {
  if (p.priceWas == null || p.priceWas <= p.price1) return null;
  return Math.round((1 - p.price1 / p.priceWas) * 100);
}

/** Bandeau galerie PDP — accroche + offre seule (le nom reste dans le panneau achat) */
export function productGalleryBanner(p: Product) {
  const save = productSavePercent(p);
  return {
    hook: p.compareLine || p.tagline,
    saveLabel: save != null ? `Économisez ${save}%` : null,
    accent: save == null ? (p.tag ?? "Livraison gratuite") : null,
  };
}

export function productBeforeAfter(_p?: Product) {
  return {
    after: "/images/raonaq-result-after.png",
    before: "/images/raonaq-result-before.png",
  };
}

export function productStoryCards(p: Product) {
  const woman = p.gallery[0];
  const tool =
    p.gallery.find((g) => g.src.includes("-tool") || g.src.includes("-tools") || g.src.includes("-closeup")) ??
    p.gallery[3] ??
    p.gallery[1];
  const hair =
    p.gallery.find((g) => g.src.includes("-hair-")) ?? p.gallery[4] ?? p.gallery.at(-1);
  return [
    { src: woman?.src ?? p.heroImage, title: p.chips[0] ?? p.compareLine, line: p.promise },
    { src: tool?.src ?? p.heroImage, title: p.chips[1] ?? "L’outil", line: p.protectHow },
    { src: hair?.src ?? p.heroImage, title: p.chips[2] ?? p.result, line: p.bestFor },
  ];
}

export function productCoverClass(src: string, _slug?: string) {
  if (
    src.includes("-tool") ||
    src.includes("-tools") ||
    src.includes("-box") ||
    src.includes("-pack") ||
    src.includes("-unboxing")
  ) {
    return "bg-[#F7F1EC] object-contain p-3";
  }
  return "object-contain object-center";
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "raonaq-trio",
    name: "TRIO",
    nameFr: "3-en-1 Lisse, Sèche & Volume",
    chips: ["3-en-1", "Lisse · ondule · volume", "Coffret cadeau", "220 V"],
    hairGuide: [
      { label: "Épais / bouclé", setting: "Cran 2 ou 3", note: "Chaleur moyenne à haute. Mèche par mèche, sans précipiter." },
      { label: "Fin", setting: "Cran 1", note: "Le cran le plus bas. Ne repassez pas la même mèche." },
      { label: "Mi-long / long", setting: "Cran 2 + air froid", note: "Le cran froid fixe le look — pas une chaleur plus haute." },
      { label: "Quotidien", setting: "Un outil à la fois", note: "Brosse, lisseur ou boucleur — selon le look du jour." },
    ],
    modelNote: "Coffret Raonaq TRIO · 3 outils",
    tag: "Le coffret",
    tagline: "Lisser, onduler et volumiser — un seul écrin.",
    description:
      "TRIO est un coffret de trois outils : une brosse air chaud (1000 W, 3 crans), un lisseur céramique et un boucleur céramique. Vous lissez, vous ondulez ou vous donnez du volume — chez vous, sur 220–240 V, sans collectionner les appareils. Écran LED sur le lisseur. Câble rotatif. Air froid pour fixer.",
    bestFor: "Pour changer de look sans multiplier les outils",
    result: "Lisse · ondulé · volume — un coffret, trois gestes",
    cardCopy:
      "Un écrin, trois looks : lisse, ondulé, volume. Le bon premier choix si vous voulez tout, sans collectionner les outils.",
    pain: "Un seul outil, puis un autre, puis un troisième — pour chaque look.",
    promise: "Un coffret : lissage, ondulation et volume — résultat salon, chez vous.",
    protectHow:
      "La brosse a 3 crans (chaleur et vitesse). Le lisseur et le boucleur se règlent à l’écran. Commencez toujours au cran le plus bas. Mèche par mèche. Terminez à l’air froid.",
    styleTime: "Environ 15–25 min sur cheveux épais",
    compareLine: "3 looks dans un coffret",
    features: [
      "Brosse 1000 W + lisseur + boucleur, un seul écrin",
      "3 crans sur la brosse · LED sur le lisseur",
      "Céramique pour un passage plus glissant",
      "Air froid pour fixer · câble rotatif",
      "220–240 V · prises marocaines",
    ],
    techTitle: "Trois gestes, un écrin",
    techPoints: [
      "La brosse sèche et coiffe (1000 W, 3 crans). Le lisseur lisse. Le boucleur onde.",
      "Céramique + LED : vous voyez le cran, vous ne devinez pas.",
      "Air froid en finition. Câble rotatif, environ 2,5 m.",
      "220–240 V · prises de la maison, sans adaptateur.",
    ],
    inBox: ["Brosse air chaud", "Lisseur", "Boucleur", "Coffret", "Guide rapide"],
    howTo: [
      "Cheveux lavés, légèrement séchés. Démêlez.",
      "Choisissez l’outil. Cran 1 pour commencer.",
      "Mèche par mèche, sans forcer. Un seul outil à la fois.",
      "Fixez à l’air froid.",
    ],
    faqs: [
      {
        q: "Quelle chaleur sur TRIO ?",
        a: "La brosse a 3 crans. Cran 1 pour le cheveu fin, 2 au quotidien, 3 seulement si le cheveu est très dense. Lisseur et boucleur : commencez bas, montez d’un cran si le cheveu ne réagit pas. Toujours l’air froid à la fin.",
      },
      {
        q: "TRIO convient-il aux cheveux épais ?",
        a: "Oui. Cran 2, puis 3 seulement si besoin. Mèche par mèche.",
      },
      {
        q: "Pourquoi TRIO plutôt qu’un seul outil ?",
        a: "Trois looks dans un coffret : lisse, ondulé, volume — et un écrin déjà prêt à offrir.",
      },
      ...COMMON_PDP_FAQS,
    ],
    gallery: [
      { src: "/images/raonaq-trio-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-trio-collage.png", label: "Ce qu’on aime" },
      { src: "/images/raonaq-trio-before-after.png", label: "Avant / après" },
      { src: "/images/raonaq-trio-howto.png", label: "Comment faire" },
    ],
    forWho: [
      "Pour changer de look sans multiplier les outils",
      "Pour un cadeau déjà mis en écrin",
      "Pour commencer la collection Raonaq",
    ],
    hair: { thick: "yes", fine: "yes", curly: "yes", daily: "ok", short: "yes", long: "yes" },
    specs: [
      { k: "Tension", v: "220–240 V · Maroc" },
      { k: "Brosse air", v: "1000 W · 3 crans chaleur/vitesse" },
      { k: "Lisseur & boucleur", v: "Céramique · écran LED" },
      { k: "Finition", v: "Air froid" },
      { k: "Câble", v: "Rotatif, environ 2,5 m" },
      { k: "Temps", v: "15–25 min selon l’épaisseur" },
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 199,
    price2: 279,
    heroImage: "/images/raonaq-trio-woman.png",
  },
  {
    id: "p2",
    slug: "raonaq-air-soft",
    name: "SOFT",
    nameFr: "Brosse Air Kératine",
    chips: ["Sèche + coiffe", "Sans frisottis", "Cheveux épais", "220 V"],
    hairGuide: [
      { label: "Épais", setting: "Cran 2", note: "Cheveux encore un peu humides. Le lisse vient du passage, pas du cran max." },
      { label: "Bouclé", setting: "Cran 2, mèche par mèche", note: "Des racines aux pointes. Patience plutôt que chaleur haute." },
      { label: "Fin", setting: "Cran 1", note: "Le cran bas. Sans insister sur la même mèche." },
      { label: "Quotidien", setting: "Cran 1 ou 2 + air froid", note: "Frisottis : SOFT. Look du matin léger : JOUR." },
    ],
    modelNote: "Brosse air Raonaq SOFT",
    tag: "Cheveux épais",
    tagline: "Lisse sans frisottis, en un seul geste.",
    description:
      "SOFT est une brosse air chaud à revêtement kératine : elle sèche et lisse le cheveu épais ou bouclé en un passage. Deux crans de chaleur + air froid. Moins de frisottis après la douche, plus de brillance, sur 220–240 V. Ce n’est pas JOUR (trop léger sur la densité) ni VOLUME (le lift des racines).",
    bestFor: "Cheveux épais qui gonflent vite",
    result: "Moins de frisottis · brillance douce · plus de tenue",
    cardCopy:
      "Pour le cheveu qui gonfle après la douche. SOFT sèche et lisse en même temps — un look calme, sans recommencer.",
    pain: "Le cheveu sort de la douche dense et gonflé. Le coiffage dure, et le volume revient dans la journée.",
    promise: "Séchage et coiffage ensemble — douceur et brillance, sans frisottis.",
    forWho: [
      "Cheveux épais ou bouclés",
      "Frisottis après la douche",
      "Un lisse sans des heures de coiffage",
    ],
    hair: { thick: "yes", fine: "ok", curly: "yes", daily: "ok", short: "ok", long: "yes" },
    specs: [
      { k: "Tension", v: "220–240 V · Maroc" },
      { k: "Chaleur", v: "2 crans + air froid" },
      { k: "Geste", v: "Sèche et lisse en un passage" },
      { k: "Revêtement", v: "Kératine" },
      { k: "Temps", v: "12–20 min sur cheveux épais" },
    ],
    protectHow:
      "Cran 1 d’abord. Cran 2 si le cheveu est dense et encore un peu humide. Air froid pour caler le lisse. N’attendez pas que le cheveu soit complètement sec — SOFT travaille mieux légèrement humide.",
    styleTime: "Environ 12–20 min sur cheveux épais",
    compareLine: "Lisse sans frisottis, cheveux épais",
    features: [
      "Sèche et coiffe en même temps",
      "2 crans + air froid · revêtement kératine",
      "Calme le frisottis, pose de la brillance",
      "Pensé pour le cheveu marocain dense",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Un brushing calme, sans frisottis",
    techPoints: [
      "Un passage : séchage et lissage — moins de temps sous la chaleur qu’un sèche-cheveux + brosse.",
      "Deux crans. Cran 1 pour le fin, cran 2 pour l’épais. Air froid en finition.",
      "Revêtement kératine : le cheveu glisse, le frisottis se calme.",
      "220–240 V · prises marocaines.",
    ],
    inBox: ["Brosse air chaud", "Guide d’utilisation"],
    howTo: [
      "Cheveux encore un peu humides — pas ruisselants, pas secs.",
      "Cran 1, puis 2 si besoin. Mèche par mèche, racines aux pointes.",
      "Tournez légèrement aux pointes pour un lisse vivant.",
      "Air froid pour fixer.",
    ],
    faqs: [
      {
        q: "Quelle chaleur sur SOFT ?",
        a: "Deux crans + air froid. Cran 1 pour le cheveu fin. Cran 2 pour l’épais ou le bouclé, encore un peu humide. L’air froid cale le lisse.",
      },
      {
        q: "Convient-il aux cheveux bouclés ?",
        a: "Oui, surtout encore un peu humides. Travaillez mèche par mèche : le lisse se voit avec de la patience.",
      },
      {
        q: "Va-t-il abîmer les cheveux ?",
        a: "Un seul outil au lieu de deux. Moins de temps sous la chaleur. Choisissez le cran juste, terminez à l’air froid.",
      },
      {
        q: "Combien de temps pour coiffer ?",
        a: "Souvent moins qu’un sèche-cheveux et une brosse séparés. Comptez 12–20 min sur cheveux épais.",
      },
      ...COMMON_PDP_FAQS,
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 199,
    price2: 279,
    heroImage: "/images/raonaq-air-soft-woman.png",
    gallery: [
      { src: "/images/raonaq-air-soft-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-soft-collage.png", label: "Ce qu’on aime" },
      { src: "/images/raonaq-soft-before-after.png", label: "Avant / après" },
      { src: "/images/raonaq-soft-howto.png", label: "Comment faire" },
    ],
  },
  {
    id: "p3",
    slug: "raonaq-air-pink",
    name: "JOUR",
    nameFr: "Brosse Séchoir Quotidienne",
    chips: ["Rituel du matin", "Léger", "Air froid", "220 V"],
    hairGuide: [
      { label: "Fin", setting: "Cran 1", note: "Le cran bas. Ordre et brillance avant de sortir." },
      { label: "Quotidien", setting: "Cran 1 ou 2", note: "8–15 min. Air froid avant de partir." },
      { label: "Court", setting: "Cran 1", note: "Pour un look net, sans alourdir." },
      { label: "Épais / bouclé", setting: "Pas JOUR", note: "Densité forte : SOFT. Volume des racines : VOLUME." },
    ],
    modelNote: "Brosse Raonaq JOUR",
    tag: "Chaque jour",
    tagline: "Un look net, avant de partir.",
    description:
      "JOUR est la brosse du matin : elle sèche légèrement, ordonne et pose un peu de brillance en 8 à 15 minutes. Deux crans + air froid. Cheveu fin à moyen, 220–240 V. Pas faite pour une forte densité — là, c’est SOFT ou VOLUME.",
    bestFor: "Le rituel du matin, avant le bureau",
    result: "Ordre rapide · brillance légère · look net",
    cardCopy:
      "Pour les jours où vous voulez un cheveu net en quelques minutes : séchage léger, ordre, un peu de brillance.",
    pain: "Le matin passe trop vite. Vous sortez avec un cheveu encore indécis.",
    promise: "Un rituel simple : sécher, ordonner, briller — puis partir.",
    forWho: [
      "Un look net chaque matin",
      "Un premier outil, facile à prendre en main",
      "Sans alourdir le cheveu",
    ],
    hair: { thick: "no", fine: "yes", curly: "no", daily: "yes", short: "yes", long: "ok" },
    specs: [
      { k: "Tension", v: "220–240 V · Maroc" },
      { k: "Chaleur", v: "2 crans + air froid" },
      { k: "Geste", v: "Sèche et ordonne, le matin" },
      { k: "Temps", v: "8–15 min avant de sortir" },
      { k: "Idéal pour", v: "Cheveu fin à moyen" },
    ],
    protectHow:
      "Cran 1 d’abord. Cran 2 seulement si le cheveu ne s’ordonne pas. Air froid avant de partir. Ne repassez pas la même mèche. Cheveu très épais : SOFT ou VOLUME.",
    styleTime: "Environ 8–15 min avant de sortir",
    compareLine: "Rituel du matin, avant de partir",
    features: [
      "Sèche et coiffe en un geste, le matin",
      "2 crans + air froid",
      "Léger en main — avant le bureau",
      "Cheveu fin à moyen — pas pour une forte densité",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Le rituel du matin, sans rendez-vous",
    techPoints: [
      "Sèche et ordonne en 8 à 15 minutes, avant de partir.",
      "Deux crans. Cran 1 au quotidien. Cran 2 si besoin. Air froid pour caler.",
      "Léger en main — un look net, sans alourdir.",
      "220–240 V · prises marocaines.",
    ],
    inBox: ["Brosse séchoir", "Guide d’utilisation"],
    howTo: [
      "Une légère humidité suffit.",
      "Cran 1. Glissez lentement des racines aux pointes.",
      "Air froid avant de sortir.",
      "Un peigne large en finition, si vous voulez plus de fluide.",
    ],
    faqs: [
      {
        q: "Quelle chaleur sur JOUR ?",
        a: "Deux crans + air froid. Cran 1 pour le cheveu fin et le quotidien. Cran 2 seulement si le cheveu résiste. L’air froid fixe avant de partir.",
      },
      {
        q: "Convient-il aux cheveux courts ?",
        a: "Oui, surtout pour l’ordre du quotidien. Cheveu très long : un peu plus de temps, ou VOLUME.",
      },
      {
        q: "Remplace-t-il SOFT ?",
        a: "Non. JOUR est le rituel rapide. SOFT est plus fort sur la densité et le frisottis.",
      },
      ...COMMON_PDP_FAQS,
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 199,
    price2: 279,
    heroImage: "/images/raonaq-air-pink-woman.png",
    gallery: [
      { src: "/images/raonaq-air-pink-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-jour-collage.png", label: "Ce qu’on aime" },
      { src: "/images/raonaq-jour-before-after.png", label: "Avant / après" },
      { src: "/images/raonaq-jour-howto.png", label: "Comment faire" },
    ],
  },
  {
    id: "p4",
    slug: "raonaq-volume",
    name: "VOLUME",
    nameFr: "Brosse Volume One-Step",
    chips: ["Volume des racines", "Brushing", "Mi-long / long", "220 V"],
    hairGuide: [
      { label: "Fin / plat", setting: "Cran 1", note: "Soulevez la mèche deux secondes aux racines, puis glissez." },
      { label: "Mi-long / long", setting: "Cran 2 + air froid", note: "Le lift se voit sur les couches. Fixez au cran froid." },
      { label: "Épais", setting: "Cran 2, mèche par mèche", note: "Le volume vient du geste, pas du cran le plus haut d’emblée." },
      { label: "Très court", setting: "Moins adapté", note: "La forme ovale a besoin de longueur pour soulever." },
    ],
    modelNote: "Brosse volume Raonaq VOLUME",
    tag: "Volume",
    tagline: "Un brushing, du volume dès les racines.",
    description:
      "VOLUME sèche, coiffe et soulève en un geste. Brosse ovale 1100 W, ions, 2 crans de chaleur + air froid, 220–240 V. Les poils nylon + touffes démêlent ; le bord arrondi lève les racines et pose de la brillance sur la longueur — un brushing chez vous, sans rendez-vous.",
    bestFor: "Du volume net et de la brillance sur la longueur",
    result: "Lift des racines · douceur · présence salon",
    cardCopy:
      "Si le cheveu retombe, VOLUME soulève les racines et laisse la longueur lisse et brillante.",
    pain: "Le cheveu paraît plat. Le brushing salon coûte cher, et prend un rendez-vous.",
    promise: "Un brushing chez vous : volume des racines, douceur, présence.",
    forWho: [
      "Cheveu plat qui a besoin de lift",
      "Un brushing sans rendez-vous",
      "Cheveu mi-long à long",
    ],
    hair: { thick: "ok", fine: "yes", curly: "ok", daily: "ok", short: "no", long: "yes" },
    specs: [
      { k: "Tension", v: "220–240 V · Maroc" },
      { k: "Puissance", v: "1100 W" },
      { k: "Chaleur", v: "2 crans + air froid" },
      { k: "Technologie", v: "Ions · brosse ovale" },
      { k: "Temps", v: "15–25 min pour un brushing" },
    ],
    protectHow:
      "Cran 1 pour le cheveu fin. Cran 2 pour l’épais. Soulevez deux secondes aux racines, glissez, ne repassez pas. Air froid pour caler le lift. Le volume vient du geste, pas du cran maximum.",
    styleTime: "Environ 15–25 min pour un brushing complet",
    compareLine: "Volume des racines, comme au salon",
    features: [
      "1100 W · sèche, coiffe et volumise en un geste",
      "2 crans + air froid · technologie ions",
      "Brosse ovale : lift dès les racines",
      "Mi-long à long — trop court, moins de lift",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Du volume dès les racines",
    techPoints: [
      "1100 W et une brosse ovale : ce n’est pas un simple séchage — c’est un brushing.",
      "Deux crans + air froid. Ions pour moins de frisottis, plus de brillance.",
      "Poils nylon et touffes : démêler, soulever, contrôler.",
      "220–240 V · prises marocaines, sans adaptateur.",
    ],
    inBox: ["Brosse volume", "Guide d’utilisation"],
    howTo: [
      "Cheveux essorés. Séparez en mèches.",
      "Cran 1. Soulevez deux secondes aux racines.",
      "Glissez lentement. Cran 2 seulement si le cheveu est dense.",
      "Air froid aux racines pour caler le lift.",
    ],
    faqs: [
      {
        q: "Quelle chaleur sur VOLUME ?",
        a: "Deux crans + air froid. Cran 1 pour le cheveu fin ou plat. Cran 2 pour l’épais, mèche par mèche. L’air froid aux racines fixe le volume. Ne commencez pas au cran le plus haut.",
      },
      {
        q: "Le volume est-il réel ?",
        a: "Oui, si vous commencez aux racines et soulevez la mèche avant de glisser. La différence se voit sur les couches.",
      },
      {
        q: "Convient-il aux cheveux fins ?",
        a: "Oui. Cran 1, concentrez-vous sur les racines pour que le volume tienne.",
      },
      {
        q: "Pourquoi VOLUME ?",
        a: "Un brushing de présence, sans salon. Sur mi-long et long, le lift se voit dès les racines. Et vous inspectez avant de payer.",
      },
      ...COMMON_PDP_FAQS,
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 199,
    price2: 279,
    heroImage: "/images/raonaq-volume-woman.png",
    gallery: [
      { src: "/images/raonaq-volume-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-volume-collage.png", label: "Ce qu’on aime" },
      { src: "/images/raonaq-volume-before-after.png", label: "Avant / après" },
      { src: "/images/raonaq-volume-howto.png", label: "Comment faire" },
    ],
  },
  {
    id: "p5",
    slug: "raonaq-go",
    name: "GO",
    nameFr: "Mini Styler Nomade",
    chips: ["Nomade", "Sans fil", "Sac à main", "Retouche"],
    hairGuide: [
      { label: "Mèches du visage", setting: "1 passage", note: "Chaleur douce. 3–8 min. Laissez refroidir." },
      { label: "Pointes", setting: "Mèche fine", note: "Un seul glissement. Ne repassez pas." },
      { label: "Hors de la maison", setting: "Après charge", note: "Bureau, voiture, soirée — sans prise." },
      { label: "Toute la tête", setting: "Pas GO", note: "Brushing complet : VOLUME ou TRIO." },
    ],
    modelNote: "Raonaq GO · retouche",
    tag: "Nomade",
    tagline: "Une retouche, partout.",
    description:
      "GO est le lisseur compact sans fil : une retouche des mèches du visage et des pointes, 3 à 8 minutes, après charge. Chaleur douce, un passage. Il tient dans le sac. Il ne fait pas un brushing de toute la tête — ça, c’est VOLUME ou TRIO.",
    bestFor: "Une retouche rapide, hors de la maison",
    result: "Ordre rapide · pointes nettes · look présent",
    cardCopy:
      "Léger, portable. Pour les mèches qui gonflent ou retombent dans la journée. Le bon choix pour le sac.",
    pain: "Vous partez coiffée. Puis les mèches du visage retombent — et rien dans le sac.",
    promise: "Une retouche partout — sans rentrer à la maison.",
    forWho: [
      "Un outil compact dans le sac",
      "Une retouche avant le bureau ou une soirée",
      "Mèches du visage et pointes",
    ],
    hair: { thick: "no", fine: "yes", curly: "no", daily: "yes", short: "yes", long: "ok" },
    specs: [
      { k: "Alimentation", v: "Sans fil après charge" },
      { k: "Chaleur", v: "Douce · un passage" },
      { k: "Temps", v: "3–8 min pour une retouche" },
      { k: "Usage", v: "Mèches du visage et pointes" },
      { k: "Format", v: "Sac · voyage · soirée" },
    ],
    protectHow:
      "Chargez la veille. Petites mèches seulement. Un passage, laissez refroidir quelques secondes. Ne repassez pas. Toute la tête : ce n’est pas GO.",
    styleTime: "Environ 3–8 min pour les mèches du visage",
    compareLine: "Retouche rapide, dans le sac",
    features: [
      "Sans fil après charge — sac, bureau, voiture",
      "Chaleur douce, un passage",
      "Mèches du visage et pointes en 3–8 min",
      "Ne remplace pas VOLUME ou TRIO sur toute la tête",
      "Écrin Raonaq et câble de charge",
    ],
    techTitle: "Une retouche, partout",
    techPoints: [
      "Sans fil après charge — vous corrigez sans rentrer à la maison.",
      "Chaleur douce. Un passage. Le cheveu refroidit, la retouche tient.",
      "Mèches du visage et pointes — pas un brushing de toute la tête.",
      "Format sac. Écrin et câble dans la boîte.",
    ],
    inBox: ["Raonaq GO", "Câble de charge", "Écrin", "Guide rapide"],
    howTo: [
      "Chargez l’outil avant de sortir.",
      "Petites mèches seulement — visage ou pointes.",
      "Un passage, sans presser.",
      "Laissez refroidir quelques secondes.",
    ],
    faqs: [
      {
        q: "Quelle chaleur sur GO ?",
        a: "Une chaleur douce, un seul passage. Ce n’est pas un lisseur de toute la tête : pas de cran haut à chercher. Laissez refroidir. Si le cheveu résiste, ce n’est pas le bon outil — prenez TRIO ou VOLUME.",
      },
      {
        q: "GO convient-il au quotidien ?",
        a: "Oui, pour une retouche légère. Toute la tête et un brushing : TRIO ou VOLUME.",
      },
      {
        q: "Entre-t-il dans un sac ?",
        a: "Oui. Format compact, pensé pour le sac ou le voyage.",
      },
      ...COMMON_PDP_FAQS,
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 199,
    price2: 279,
    heroImage: "/images/raonaq-go-woman.png",
    gallery: [
      { src: "/images/raonaq-go-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-go-catalog.png", label: "L’outil" },
      { src: "/images/raonaq-go-inside.png", label: "La tech" },
      { src: "/images/raonaq-go-battery.png", label: "USB-C" },
      { src: "/images/raonaq-go-kit.png", label: "L’écrin" },
    ],
  },
  {
    id: "p6",
    slug: "raonaq-duo",
    name: "DUO",
    nameFr: "2-en-1 Lisse & Ondule",
    chips: ["2-en-1", "Lisser", "Onduler", "220 V"],
    hairGuide: [
      { label: "Mi-long / long", setting: "Cran 2", note: "Petites mèches. Lisse ou waves — le même cran pour commencer." },
      { label: "Fin", setting: "Cran 1", note: "Lisser : glissez lentement. Onduler : enroulez, puis laissez refroidir." },
      { label: "Épais", setting: "Cran 2", note: "Onduler : enroulez, attendez, dénouez à froid." },
      { label: "Quotidien", setting: "Cran 1 ou 2", note: "Deux looks, un seul outil. Commencez toujours au cran bas." },
    ],
    modelNote: "Raonaq DUO · lisser & onduler",
    tag: "2-en-1",
    tagline: "Lisser ou onduler, un seul outil.",
    description:
      "DUO est un 2-en-1 : lisser un jour, onduler le lendemain, le même outil. Plusieurs crans de chaleur — commencez au plus bas. Petites mèches, 220–240 V. Le froid fixe la forme, pas un second passage plus chaud.",
    bestFor: "Lisser et onduler avec un seul outil",
    result: "Lisser & onduler · look lisse ou ondulé",
    cardCopy:
      "Lisse un jour, waves le lendemain — le même outil. Pratique, sans occuper tout le tiroir.",
    pain: "Vous voulez alterner lisse et ondulé, mais trop d’outils prennent place et temps.",
    promise: "Un outil, deux looks : lisse net ou waves légères.",
    forWho: [
      "Lisse et ondulations, un seul choix",
      "Cheveu mi-long à long",
      "Un outil compact, deux gestes",
    ],
    hair: { thick: "ok", fine: "yes", curly: "ok", daily: "ok", short: "ok", long: "yes" },
    specs: [
      { k: "Tension", v: "220–240 V · Maroc" },
      { k: "Chaleur", v: "Plusieurs crans — commencez au plus bas" },
      { k: "Looks", v: "Lisse ou waves légères" },
      { k: "Temps", v: "15–25 min selon le look" },
      { k: "Idéal pour", v: "Mi-long / long" },
    ],
    protectHow:
      "Cran 1 d’abord. Cran 2 si le cheveu est plus dense. Lisse : glissez sans presser. Ondulé : enroulez, laissez refroidir avant de dénouer. Le froid fixe — pas la répétition de chaleur.",
    styleTime: "Environ 15–25 min selon le look",
    compareLine: "Lisser et onduler, un seul outil",
    features: [
      "2-en-1 : lisse ou waves légères",
      "Plusieurs crans — commencez au cran 1",
      "Petites mèches, sans presser",
      "Cheveu mi-long à long",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Lisser ou onduler, le même outil",
    techPoints: [
      "Deux looks : lisse un jour, waves le lendemain — un seul outil dans le tiroir.",
      "Cran 1 pour le fin. Cran 2 pour plus de densité. Toujours le cran bas d’abord.",
      "Le froid fixe la forme — pas un second passage plus chaud.",
      "220–240 V · prises marocaines.",
    ],
    inBox: ["Raonaq DUO 2-en-1", "Écrin", "Guide rapide"],
    howTo: [
      "Cran 1 pour commencer. Petites mèches.",
      "Lisse : glissez lentement des racines aux pointes.",
      "Ondulé : enroulez, passez sans précipiter.",
      "Laissez refroidir pour fixer la forme.",
    ],
    faqs: [
      {
        q: "Quelle chaleur sur DUO ?",
        a: "Plusieurs crans. Cran 1 pour le cheveu fin. Cran 2 si le cheveu est plus dense. Lisse et waves commencent au même cran bas. Le froid fixe — n’augmentez pas la chaleur pour « tenir mieux ».",
      },
      {
        q: "Fait-il vraiment les deux ?",
        a: "Oui. DUO est conçu pour le lissage et des waves légères, le même outil.",
      },
      {
        q: "Convient-il aux débutantes ?",
        a: "Oui. Petites mèches, cran 1, puis montez seulement si besoin.",
      },
      ...COMMON_PDP_FAQS,
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 599,
    price2: 999,
    priceWas: 1000,
    heroImage: "/images/raonaq-duo-woman.png",
    gallery: [
      { src: "/images/raonaq-duo-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-duo-catalog.png", label: "L’outil" },
      { src: "/images/raonaq-duo-showcase.png", label: "Lisser et onduler" },
      { src: "/images/raonaq-duo-love.png", label: "Ce qu’on aime" },
      { src: "/images/raonaq-duo-ba.png", label: "Avant / après" },
      { src: "/images/raonaq-duo-steps.png", label: "Comment faire" },
      { src: "/images/raonaq-duo-looks.png", label: "Les looks" },
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const UPSELL = {
  id: "raonaq-luma-serum",
  name: "LUMA",
  nameFr: "Sérum Raonaq LUMA",
  description:
    "Un sérum léger pour fixer le coiffage et ajouter de la brillance — sans alourdir.",
  price: 99,
  compareAt: 149,
  image: "/images/raonaq-salon-results.png",
};
