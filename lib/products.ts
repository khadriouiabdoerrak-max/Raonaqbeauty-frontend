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
    tag: "الأكثر طلباً",
    tagline: "3 أدوات فباكة وحدة — نتيجة احترافية",
    description:
      "طقم رونق تريو كيجمع 3 أدوات تصفيف فباكة أنيقة. نتيجة صالون فدارك مع حماية من الحرارة — مثالي كمجموعة كاملة أو كهدية.",
    bestFor: "اللي باغية طقم كامل · هدايا · شعر متوسط لطويل",
    result: "فرد، موجات، وحجم — مع حماية للشعر",
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
    tagline: "نعومة ولمعان مع حماية فخطوة وحدة",
    description:
      "فرشاة الهواء الساخن ديال رونق إير سوفت كتجفّف وتصفّف دفعة وحدة. مختارة للشعر الكثيف والمجعد اللي كيحتاج نعومة ولمعان احترافي بلا ما يضعّف الشعر.",
    bestFor: "شعر كثيف · مجعد · باغية نعومة سريعة",
    result: "شعر أهدى، لامع، ومرتب — مع حماية",
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
    tag: "الأناقة اليومية",
    tagline: "ترتيب يومي بلمعان وحماية",
    description:
      "رونق إير بينك للأناقة اليومية: تجفيف وتصفيف خفيف مع نتيجة مرتبة ولامعة — بلا ثقل وبلا ما تضرّي شعرك. مثالية للخروج أو الخدمة.",
    bestFor: "استعمال يومي · شعر خفيف لمتوسط · سهولة",
    result: "شعر مرتب ولامع فدقائق — بلا صالون",
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
    tagline: "حجم ولمعان احترافي من أول تصفيفة",
    description:
      "رونق فوليوم للبنات اللي باغين حجم وحضور بلا موعد. فرشاة بيضاوية كتعطي lift من الجذور ولمعان على الطول — نتيجة صالون مع احترام الشعر.",
    bestFor: "شعر متوسط لطويل · باغية حجم blowout",
    result: "حجم من الجذور ولمعان على الطول",
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
