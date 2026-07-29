// كتالوج رونق — براند أولاً، الموديل التقني ثانوي
export type Product = {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  modelNote: string;
  tag?: string;
  tagline: string;
  description: string;
  bestFor: string;
  result: string;
  features: string[];
  inBox: string[];
  howTo: string[];
  price1: number;
  price2: number;
  images: string[];
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "raonaq-trio",
    name: "رونق تريو",
    nameFr: "Raonaq TRIO",
    modelNote: "طقم Supercare PRO · EN-3311",
    tag: "الباكة الكاملة",
    tagline: "كل الستايلات فطقم واحد",
    description:
      "رونق تريو هو الطقم اللي كيخليك تبدلي اللوك وقت ما بغيتي: فرد ناعم، ويفي مرتب، أو حجم خفيف. باكة أنيقة لنتيجة صالون فدارك مع حماية من الحرارة — ليك أو كهدية.",
    bestFor: "للي باغية كلشي فباكة وحدة",
    result: "فرد ناعم، ويفي مرتب، وحجم لامع مع حماية",
    features: [
      "3 أدوات تصفيف فباكة واحدة",
      "حماية من الحرارة مع درجات متعددة",
      "نتيجة احترافية لمعظم أنواع الشعر المغربي",
      "تغليف مرتب كهدية",
      "استعمال ساهل فدارك بلا موعد",
    ],
    inBox: ["3 أدوات تصفيف", "باكة هدية", "دليل استعمال سريع"],
    howTo: [
      "غسّلي وجفّفي الشعر شوية قبل التصفيف",
      "اختاري الدرجة المناسبة لنوع شعرك",
      "صفّفي خصلة بخصلة بضغط خفيف",
      "كمّلي بهواء بارد باش تثبّتي النتيجة",
    ],
    price1: 199,
    price2: 279,
    images: [
      "/images/raonaq-trio.png",
      "/images/raonaq-trio-angle.png",
      "/images/raonaq-trio-tools.png",
      "/images/raonaq-trio-original.png",
    ],
  },
  {
    id: "p2",
    slug: "raonaq-air-soft",
    name: "رونق إير سوفت",
    nameFr: "Raonaq AIR Soft",
    modelNote: "فرشاة هواء ساخن بالكيراتين",
    tag: "للشعر الكثيف",
    tagline: "ينعّم ويصفّف فخطوة وحدة",
    description:
      "رونق إير سوفت كتخدم على الشعر الكثيف والمجعد بلا تعب: كتعاون على التجفيف والتصفيف فخطوة وحدة، وكتخلي الشعر أهدأ، لامع، ومرتب بلا نفشة.",
    bestFor: "للشعر الكثيف والمجعد",
    result: "نعومة، لمعان، وتحكم أكثر بلا نفشة",
    features: [
      "تجفيف وتصفيف فنفس الوقت",
      "نعومة ولمعان احترافي",
      "فرشاة مستديرة للحجم",
      "خفيف وسهل التحكم",
      "مناسب للاستعمال اليومي بلا ضرر",
    ],
    inBox: ["فرشاة الهواء الساخن", "دليل استعمال"],
    howTo: [
      "بدئي على شعر منديل شوية الرطوبة",
      "مرّري الفرشاة من الجذور للأطراف",
      "دوّري شوية على الأطراف باش الحجم",
      "ثبّتي بالهواء البارد فآخر خطوة",
    ],
    price1: 199,
    price2: 279,
    images: [
      "/images/raonaq-air-soft.png",
      "/images/raonaq-air-soft-tool.png",
      "/images/raonaq-air-soft-box.png",
      "/images/raonaq-air-soft-original.png",
    ],
  },
  {
    id: "p3",
    slug: "raonaq-air-pink",
    name: "رونق إير بينك",
    nameFr: "Raonaq AIR Pink",
    modelNote: "مجفف-فرشاة · EN-8220",
    tag: "للاستعمال اليومي",
    tagline: "لوك مرتب فدقائق",
    description:
      "رونق إير بينك للنهارات اللي بغيتي فيها شعرك يبان مرتب بسرعة: تجفيف وتصفيف خفيف بلمعان، بلا ثقل وبلا موعد صالون.",
    bestFor: "للترتيب السريع قبل الخروج",
    result: "شعر مرتب، خفيف، ولامع فدقائق",
    features: [
      "يجفّف ويصفّف دفعة وحدة",
      "خفيف وسهل على اليد",
      "درجتين حرارة + هواء بارد للحماية",
      "تصميم أنيق للاستخدام اليومي",
      "مناسب للمبتدئات",
    ],
    inBox: ["مجفف-فرشاة", "دليل استعمال"],
    howTo: [
      "شوية رطوبة كافية قبل ما تبدئي",
      "مرّري ببطء من الجذور للأطراف",
      "استعملي الهواء البارد للتثبيت",
      "كمّلي بمشط واسع الأسنان إلا بغيتي انسيابية أكثر",
    ],
    price1: 199,
    price2: 279,
    images: [
      "/images/raonaq-air-pink.png",
      "/images/raonaq-air-pink-tool.png",
      "/images/raonaq-air-pink-box.png",
      "/images/raonaq-air-pink-original.png",
    ],
  },
  {
    id: "p4",
    slug: "raonaq-volume",
    name: "رونق فوليوم",
    nameFr: "Raonaq VOLUME",
    modelNote: "فرشاة الحجم One-Step",
    tag: "للحجم",
    tagline: "براشينغ بحجم ولمعة",
    description:
      "رونق فوليوم للبنات اللي باغين حضور من أول تصفيفة. الفرشاة البيضاوية كترفع الشعر من الجذور وكتعطي لمعة على الطول — براشينغ فدارك بلا صالون.",
    bestFor: "للي باغية حجم واضح من الجذور",
    result: "رفع، نعومة، ولمعان على الطول",
    features: [
      "حجم واضح من الجذور",
      "تصفيف فخطوة وحدة",
      "فرشاة بيضاوية لملمس أملس ولامع",
      "مثالية للشعر المتوسط والطويل",
      "نتيجة صالون فدارك مع حماية",
    ],
    inBox: ["فرشاة الحجم", "دليل استعمال"],
    howTo: [
      "بدئي من الجذور ورفعي الخصلة لفوق",
      "جرّي الفرشاة ببطء للأسفل",
      "كرّري على الطبقات باش الحجم يبان",
      "ثبّتي بالهواء البارد",
    ],
    price1: 199,
    price2: 279,
    images: [
      "/images/raonaq-volume.png",
      "/images/raonaq-volume-tool.png",
      "/images/raonaq-volume-box.png",
      "/images/raonaq-volume-original.png",
    ],
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const UPSELL = {
  id: "raonaq-luma-serum",
  name: "رونق لمعان",
  nameFr: "Raonaq LUMA Serum",
  description:
    "سيروم خفيف كيثبّت التصفيف وكيزيد اللمعان بعد أداة رونق — حماية إضافية بلا ما يثقّل الشعر.",
  price: 99,
  compareAt: 149,
  image: "/images/raonaq-salon-results.png",
};
