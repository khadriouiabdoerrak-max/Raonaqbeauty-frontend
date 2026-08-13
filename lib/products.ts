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
  { t: "WhatsApp", d: "Avant et après la commande." },
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

export function productBeforeAfter(p: Product) {
  return p.gallery.find(
    (g) => g.src.includes("before-after") || /avant|before|après|after/i.test(g.label),
  );
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

export function productCoverClass(src: string, slug?: string) {
  const isDuoPhoto =
    slug === "raonaq-duo" ||
    src.includes("raonaq-duo-woman") ||
    src.includes("raonaq-duo-closeup");
  if (isDuoPhoto) return "object-cover object-[84%_28%]";
  if (src.includes("-tool") || src.includes("-box")) return "bg-white object-contain p-4";
  return "object-cover object-[center_18%]";
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "raonaq-trio",
    name: "TRIO",
    nameFr: "Coffret 3-en-1",
    chips: ["3-en-1", "Lisse · ondule · volume", "Coffret cadeau", "220 V"],
    hairGuide: [
      { label: "Épais / bouclé", setting: "Température moyenne", note: "Mèche par mèche, sans précipitation" },
      { label: "Fin", setting: "Température basse", note: "Ne repassez pas la même mèche" },
      { label: "Mi-long / long", setting: "Moyenne à haute", note: "Terminez à l’air froid" },
      { label: "Quotidien", setting: "Choisissez l’outil du coffret", note: "Brosse, lisseur ou boucleur" },
    ],
    modelNote: "Coffret Raonaq TRIO · 3 outils",
    tag: "Le coffret",
    tagline: "Lisser, onduler et volumiser — un seul écrin.",
    description:
      "TRIO réunit lissage, ondulation et volume dans un écrin unique — résultat salon chez vous, avec protection de la fibre.",
    bestFor: "Pour changer de look sans multiplier les outils",
    result: "Lisse · ondulé · volume — un coffret, trois gestes",
    cardCopy:
      "Un écrin, trois looks : lisse, ondulé, volume. Le bon premier choix si vous voulez tout, sans collectionner les outils.",
    pain: "Un seul outil, puis un autre, puis un troisième — pour chaque look.",
    promise: "Un coffret : lissage, ondulation et volume — résultat salon, chez vous.",
    protectHow:
      "Pas une seule chaleur pour toutes. Choisissez une température moyenne, travaillez mèche par mèche, terminez à l’air froid.",
    styleTime: "Environ 15–25 min sur cheveux épais",
    compareLine: "3 looks dans un coffret",
    features: [
      "Trois looks : lisse, ondulé, volume",
      "Plusieurs températures + air froid",
      "Pensé pour les cheveux marocains",
      "Écrin cadeau Raonaq",
      "220–240 V · Maroc",
    ],
    techTitle: "Trois gestes, un écrin",
    techPoints: [
      "Lisse, ondule et volume — sans trois outils dans le tiroir",
      "Plusieurs températures + air froid pour fixer le geste",
      "Coffret déjà mis en écrin, prêt à offrir",
      "220–240 V · prises marocaines",
    ],
    inBox: ["Brosse air chaud", "Lisseur", "Boucleur", "Coffret", "Guide rapide"],
    howTo: [
      "Lavez et séchez légèrement les cheveux",
      "Choisissez l’outil et la température",
      "Travaillez mèche par mèche, sans forcer",
      "Fixez à l’air froid",
    ],
    faqs: [
      {
        q: "TRIO convient-il aux cheveux épais ?",
        a: "Oui. Commencez à température moyenne et montez seulement si besoin.",
      },
      {
        q: "Pourquoi TRIO plutôt qu’un seul outil ?",
        a: "Trois looks dans un coffret : lisse, ondulé, volume — et un écrin déjà prêt à offrir.",
      },
      ...COMMON_PDP_FAQS,
    ],
    gallery: [
      { src: "/images/raonaq-trio-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-trio-before-after.png", label: "Avant / après" },
      { src: "/images/raonaq-trio-pack.png", label: "L’écrin Raonaq" },
      { src: "/images/raonaq-trio-tools.png", label: "3 outils" },
      { src: "/images/raonaq-hair-straight.png", label: "Lisse" },
      { src: "/images/raonaq-trio-box.png", label: "Ce que vous recevez" },
    ],
    forWho: [
      "Pour changer de look sans multiplier les outils",
      "Pour un cadeau déjà mis en écrin",
      "Pour commencer la collection Raonaq",
    ],
    hair: { thick: "yes", fine: "yes", curly: "yes", daily: "ok", short: "yes", long: "yes" },
    specs: [
      { k: "Tension", v: "220–240 V · Maroc" },
      { k: "Temps", v: "15–25 min selon l’épaisseur" },
      { k: "Finition", v: "Air froid" },
      { k: "Coffret", v: "3 outils" },
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
    nameFr: "Brosse air — sans frisottis",
    chips: ["Sèche + coiffe", "Sans frisottis", "Cheveux épais", "220 V"],
    hairGuide: [
      { label: "Épais", setting: "Température moyenne", note: "Cheveux encore un peu humides" },
      { label: "Bouclé", setting: "Moyenne, mèche par mèche", note: "Des racines aux pointes" },
      { label: "Fin", setting: "Température basse", note: "Sans insister" },
      { label: "Quotidien", setting: "Moyenne légère", note: "Si le frisottis est le sujet, SOFT plutôt que JOUR" },
    ],
    modelNote: "Brosse air Raonaq SOFT",
    tag: "Cheveux épais",
    tagline: "Lisse sans frisottis, en un seul geste.",
    description:
      "SOFT sèche et coiffe le cheveu épais ou bouclé en un seul passage. Moins de frisottis, plus de brillance, plus de contrôle.",
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
      { k: "Temps", v: "12–20 min sur cheveux épais" },
      { k: "Finition", v: "Air froid" },
      { k: "Idéal pour", v: "Densité · frisottis · boucles" },
    ],
    protectHow:
      "Séchage et coiffage en un geste : moins de temps sous la chaleur. Commencez légèrement humide, température moyenne, terminez à l’air froid. N’attendez pas que le cheveu soit complètement sec.",
    styleTime: "Environ 12–20 min sur cheveux épais",
    compareLine: "Lisse sans frisottis, cheveux épais",
    features: [
      "Sèche et coiffe en même temps",
      "Calme le frisottis, ajoute de la brillance",
      "Brosse ronde : un peu de volume avec le lisse",
      "Pensé pour les cheveux marocains denses",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Un brushing calme, sans frisottis",
    techPoints: [
      "Séchage et coiffage en un seul passage — moins de temps sous la chaleur",
      "Aide à réduire les frisottis et pose de la brillance",
      "Température moyenne, mèche par mèche, air froid en finition",
      "220–240 V · prises marocaines",
    ],
    inBox: ["Brosse air chaud", "Guide d’utilisation"],
    howTo: [
      "Commencez sur cheveux encore un peu humides",
      "Travaillez mèche par mèche, des racines aux pointes",
      "Tournez légèrement aux pointes pour le mouvement",
      "Fixez à l’air froid",
    ],
    faqs: [
      {
        q: "Convient-il aux cheveux bouclés ?",
        a: "Oui, surtout encore un peu humides. Travaillez mèche par mèche : le lisse se voit avec de la patience.",
      },
      {
        q: "Va-t-il abîmer les cheveux ?",
        a: "Le geste vise moins de chaleur perdue qu’un sèche-cheveux + brosse. Choisissez la température juste, terminez à l’air froid.",
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
      { src: "/images/raonaq-air-soft-before-after.png", label: "Avant / après · frisottis" },
      { src: "/images/raonaq-air-soft-pack.png", label: "L’écrin Raonaq" },
      { src: "/images/raonaq-air-soft-tool.png", label: "L’outil" },
      { src: "/images/raonaq-hair-curls.png", label: "Lisse sans frisottis" },
      { src: "/images/raonaq-air-soft-box.png", label: "Ce que vous recevez" },
    ],
  },
  {
    id: "p3",
    slug: "raonaq-air-pink",
    name: "JOUR",
    nameFr: "Brosse quotidienne",
    chips: ["Rituel du matin", "Léger", "Air froid", "220 V"],
    hairGuide: [
      { label: "Fin", setting: "Température basse", note: "Ordre et brillance avant de sortir" },
      { label: "Quotidien", setting: "Basse à moyenne", note: "8–15 min" },
      { label: "Court", setting: "Basse", note: "Pour un look net" },
      { label: "Épais / bouclé", setting: "Pas le premier choix", note: "Préférez SOFT ou VOLUME" },
    ],
    modelNote: "Brosse Raonaq JOUR",
    tag: "Chaque jour",
    tagline: "Un look net, avant de partir.",
    description:
      "JOUR pour les matins où le cheveu doit être net, vite : séchage léger, ordre et brillance — sans rendez-vous.",
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
      { k: "Temps", v: "8–15 min au quotidien" },
      { k: "Finition", v: "Air froid" },
      { k: "Idéal pour", v: "Matin · cheveu fin ou moyen" },
    ],
    protectHow:
      "JOUR pour un ordre léger, pas pour lisser un cheveu très dense. Deux températures + air froid : commencez bas, ne repassez pas la même mèche. Cheveu très épais : SOFT ou VOLUME.",
    styleTime: "Environ 8–15 min avant de sortir",
    compareLine: "Rituel du matin, avant de partir",
    features: [
      "Sèche et coiffe en un geste, le matin",
      "Léger en main — avant le bureau",
      "Deux températures + air froid",
      "Cheveu fin à moyen — pas pour une forte densité",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Le rituel du matin, sans rendez-vous",
    techPoints: [
      "Sèche et ordonne en quelques minutes, avant de partir",
      "Léger en main — un look net, sans alourdir",
      "Deux températures + air froid. Commencez toujours plus bas",
      "220–240 V · prises marocaines",
    ],
    inBox: ["Brosse séchoir", "Guide d’utilisation"],
    howTo: [
      "Une légère humidité suffit",
      "Glissez lentement des racines aux pointes",
      "Fixez à l’air froid",
      "Un peigne large en finition, si vous voulez plus de fluide",
    ],
    faqs: [
      {
        q: "Convient-il aux cheveux courts ?",
        a: "Oui, surtout pour l’ordre du quotidien. Cheveu très long : un peu plus de temps, ou VOLUME.",
      },
      {
        q: "Remplace-t-il SOFT ?",
        a: "Non. JOUR est le rituel rapide. SOFT est plus fort sur la densité et le frisottis.",
      },
      {
        q: "Comment arrive la commande ?",
        a: "Livraison gratuite dans tout le Maroc, généralement 24 à 48 h. Nous confirmons par téléphone. Vous payez à la porte, après inspection.",
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
      { src: "/images/raonaq-air-pink-before-after.png", label: "Avant / après" },
      { src: "/images/raonaq-air-pink-pack.png", label: "L’écrin Raonaq" },
      { src: "/images/raonaq-air-pink-tool.png", label: "L’outil" },
      { src: "/images/raonaq-hair-waves.png", label: "Look net, vite" },
      { src: "/images/raonaq-air-pink-box.png", label: "Ce que vous recevez" },
    ],
  },
  {
    id: "p4",
    slug: "raonaq-volume",
    name: "VOLUME",
    nameFr: "Brosse volume",
    chips: ["Volume des racines", "Brushing", "Mi-long / long", "220 V"],
    hairGuide: [
      { label: "Fin / plat", setting: "Température moyenne", note: "Soulevez la mèche deux secondes" },
      { label: "Mi-long / long", setting: "Moyenne à haute", note: "Le lift se voit sur les couches" },
      { label: "Épais", setting: "Haute, mèche par mèche", note: "Terminez à l’air froid" },
      { label: "Très court", setting: "Moins adapté", note: "La forme ovale donne du volume sur la longueur" },
    ],
    modelNote: "Brosse volume Raonaq VOLUME",
    tag: "Volume",
    tagline: "Un brushing, du volume dès les racines.",
    description:
      "VOLUME pour un brushing qui se voit dès la première fois. La brosse ovale soulève les racines et pose de la brillance sur la longueur — chez vous.",
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
      { k: "Temps", v: "15–25 min pour un brushing" },
      { k: "Finition", v: "Air froid aux racines" },
      { k: "Idéal pour", v: "Mi-long / long · volume" },
    ],
    protectHow:
      "Le volume vient du geste, pas de la chaleur maximale : soulevez la mèche deux secondes, glissez lentement, ne repassez pas. Terminez à l’air froid pour fixer le lift.",
    styleTime: "Environ 15–25 min pour un brushing complet",
    compareLine: "Volume des racines, comme au salon",
    features: [
      "Lift des racines grâce à la forme ovale",
      "Séchage et coiffage en un geste",
      "Brillance sur la longueur, volume qui tient",
      "Mi-long à long — trop court, moins de lift",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Du volume dès les racines",
    techPoints: [
      "La forme ovale soulève — ce n’est pas un simple séchage",
      "Séchage et brushing en un geste, brillance sur la longueur",
      "Le lift vient du geste : soulevez, glissez, air froid",
      "220–240 V · prises marocaines",
    ],
    inBox: ["Brosse volume", "Guide d’utilisation"],
    howTo: [
      "Soulevez la mèche deux secondes aux racines",
      "Glissez la brosse lentement vers le bas",
      "Répétez sur les couches",
      "Fixez à l’air froid",
    ],
    faqs: [
      {
        q: "Le volume est-il réel ?",
        a: "Oui, si vous commencez aux racines et soulevez la mèche avant de glisser. La différence se voit sur les couches.",
      },
      {
        q: "Convient-il aux cheveux fins ?",
        a: "Oui. Température plus basse, concentrez-vous sur les racines pour que le volume tienne.",
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
      { src: "/images/raonaq-volume-before-after.png", label: "Avant / après · volume" },
      { src: "/images/raonaq-volume-pack.png", label: "L’écrin Raonaq" },
      { src: "/images/raonaq-volume-tool.png", label: "L’outil" },
      { src: "/images/raonaq-hair-blowout.png", label: "Volume des racines" },
      { src: "/images/raonaq-volume-box.png", label: "Ce que vous recevez" },
    ],
  },
  {
    id: "p5",
    slug: "raonaq-go",
    name: "GO",
    nameFr: "Retouche nomade",
    chips: ["Nomade", "Sans fil", "Sac à main", "Retouche"],
    hairGuide: [
      { label: "Mèches du visage", setting: "Passage léger", note: "3–8 min" },
      { label: "Pointes", setting: "Mèche fine", note: "Laissez refroidir quelques secondes" },
      { label: "Hors de la maison", setting: "Après charge", note: "Bureau, voiture, soirée" },
      { label: "Toute la tête", setting: "Ce n’est pas GO", note: "Choisissez VOLUME ou TRIO" },
    ],
    modelNote: "Raonaq GO · retouche",
    tag: "Nomade",
    tagline: "Une retouche, partout.",
    description:
      "GO est l’outil compact pour une retouche dans le sac, au bureau, en voiture, avant une soirée. Mèches du visage et pointes — sans salon.",
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
      { k: "Alimentation", v: "Charge · sans fil" },
      { k: "Temps", v: "3–8 min pour une retouche" },
      { k: "Usage", v: "Mèches du visage et pointes" },
      { k: "Idéal pour", v: "Sac · voyage · avant une photo" },
    ],
    protectHow:
      "GO pour de petites mèches, pas pour toute la tête. Mèche fine, passage léger, laissez refroidir quelques secondes. Ne repassez pas — la retouche reste légère.",
    styleTime: "Environ 3–8 min pour les mèches du visage",
    compareLine: "Retouche rapide, dans le sac",
    features: [
      "Format sac à main",
      "Mèches du visage et pointes en quelques minutes",
      "Sans fil après charge — bureau, voiture, soirée",
      "Ne remplace pas VOLUME ou TRIO sur toute la tête",
      "Écrin Raonaq et câble de charge",
    ],
    techTitle: "Une retouche, partout",
    techPoints: [
      "Sans fil après charge — sac, bureau, voiture, soirée",
      "Mèches du visage et pointes en quelques minutes",
      "Passage léger : laissez refroidir, ne repassez pas",
      "Ce n’est pas un brushing de toute la tête — VOLUME ou TRIO le font",
    ],
    inBox: ["Raonaq GO", "Câble de charge", "Écrin", "Guide rapide"],
    howTo: [
      "Chargez l’outil avant usage",
      "Prenez de petites mèches",
      "Glissez sur les mèches du visage ou les pointes",
      "Laissez refroidir quelques secondes",
    ],
    faqs: [
      {
        q: "GO convient-il au quotidien ?",
        a: "Oui, pour une retouche légère. Toute la tête et un brushing : TRIO ou VOLUME.",
      },
      {
        q: "Entre-t-il dans un sac ?",
        a: "Oui. Format compact, pensé pour le sac ou le voyage.",
      },
      {
        q: "Comment arrive la commande ?",
        a: "Nous confirmons par téléphone. L’outil arrive chez vous. Vous ouvrez, vous inspectez, puis vous payez. Vous pouvez refuser à la porte.",
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
      { src: "/images/raonaq-go-lifestyle.png", label: "Retouche partout" },
      { src: "/images/raonaq-go-closeup.png", label: "L’outil" },
      { src: "/images/raonaq-go-unboxing.png", label: "L’écrin" },
      { src: "/images/raonaq-go-box.png", label: "Ce que vous recevez" },
    ],
  },
  {
    id: "p6",
    slug: "raonaq-duo",
    name: "DUO",
    nameFr: "2-en-1 lisser & onduler",
    chips: ["2-en-1", "Lisser", "Onduler", "220 V"],
    hairGuide: [
      { label: "Mi-long / long", setting: "Température moyenne", note: "Petites mèches" },
      { label: "Fin", setting: "Basse à moyenne", note: "Pour lisser : glissez lentement" },
      { label: "Épais", setting: "Moyenne", note: "Pour onduler : enroulez, puis laissez refroidir" },
      { label: "Quotidien", setting: "Moyenne", note: "Deux looks, un seul outil" },
    ],
    modelNote: "Raonaq DUO · lisser & onduler",
    tag: "2-en-1",
    tagline: "Lisser ou onduler, un seul outil.",
    description:
      "DUO réunit lissage et ondulations légères. Un look lisse un jour, des waves le lendemain — sans collectionner les outils.",
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
      { k: "Temps", v: "15–25 min selon le look" },
      { k: "Looks", v: "Lisse ou waves légères" },
      { k: "Idéal pour", v: "Mi-long / long" },
    ],
    protectHow:
      "Température moyenne, petites mèches, glissez lentement. Lisse : des racines aux pointes, sans presser. Ondulé : enroulez, laissez refroidir avant de dénouer. Le froid fixe — pas la répétition de chaleur.",
    styleTime: "Environ 15–25 min selon le look",
    compareLine: "Lisser et onduler, un seul outil",
    features: [
      "2-en-1 : lisse ou waves légères",
      "Deux looks, sans deux outils",
      "Petites mèches, température moyenne",
      "Cheveu mi-long à long",
      "220–240 V · prises de la maison",
    ],
    techTitle: "Lisser ou onduler, le même outil",
    techPoints: [
      "Deux looks : lisse un jour, waves le lendemain",
      "Petites mèches, température moyenne, sans presser",
      "Le froid fixe la forme — pas la répétition de chaleur",
      "220–240 V · prises marocaines",
    ],
    inBox: ["Raonaq DUO 2-en-1", "Écrin", "Guide rapide"],
    howTo: [
      "Choisissez la température selon votre cheveu",
      "Lisse : glissez lentement des racines aux pointes",
      "Ondulé : enroulez la mèche, passez sans précipiter",
      "Laissez refroidir pour fixer la forme",
    ],
    faqs: [
      {
        q: "Fait-il vraiment les deux ?",
        a: "Oui. DUO est conçu pour le lissage et des waves légères, le même outil.",
      },
      {
        q: "Convient-il aux débutantes ?",
        a: "Oui. Commencez par de petites mèches et une température moyenne.",
      },
      ...COMMON_PDP_FAQS,
    ],
    voice: { name: "", city: "", text: "" },
    reviews: [],
    price1: 199,
    price2: 279,
    heroImage: "/images/raonaq-duo-woman.png",
    gallery: [
      { src: "/images/raonaq-duo-woman.png", label: "Le résultat" },
      { src: "/images/raonaq-duo-tool.png", label: "L’outil" },
      { src: "/images/raonaq-duo-unboxing.png", label: "L’écrin" },
      { src: "/images/raonaq-duo-closeup.png", label: "Le geste" },
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
