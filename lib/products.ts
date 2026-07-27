// بيانات المنتجات الكاملة
export type Product = {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  tag?: string;
  tagline: string;
  description: string;
  features: string[];
  price1: number;
  price2: number;
  images: string[];
  stars: number;
  reviewCount: number;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "raonaq-trio",
    name: "رونق تريو — ENZO Supercare PRO EN-3311",
    nameFr: "Raonaq TRIO — ENZO Supercare PRO EN-3311",
    tag: "الأكثر مبيعاً 🏆",
    tagline: "3 أدوات احترافية في علبة هدايا واحدة",
    description:
      "طقم تصفيف الشعر الأكثر مبيعاً في المغرب. يحتوي على 3 أدوات احترافية في علبة هدايا فاخرة مثالية لك ولمن تحبين. تقنية الأيونات السلبية تحمي شعرك من الحرارة وتمنحه لمعاناً استثنائياً.",
    features: [
      "3 أدوات تصفيف احترافية في علبة واحدة",
      "تقنية Supercare لحماية الشعر من الحرارة",
      "درجات حرارة متعددة تناسب جميع أنواع الشعر",
      "تصميم فاخر مثالي كهدية",
      "كيراتين مدمج لشعر ناعم ولامع",
    ],
    price1: 199,
    price2: 279,
    images: [
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&q=85",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=85",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=900&q=85",
    ],
    stars: 5,
    reviewCount: 312,
  },
  {
    id: "p2",
    slug: "raonaq-air-soft",
    name: "رونق إير سوفت — ENZO yougee كيراتين",
    nameFr: "Raonaq AIR Soft — ENZO yougee Keratin Hot Air Brush",
    tag: "مميز جداً ✨",
    tagline: "فرشاة هواء ساخن بتقنية الكيراتين",
    description:
      "استمتعي بتجربة صالون فاخر في منزلك. فرشاة الهواء الساخن بتقنية الكيراتين تمنح شعرك النعومة والحجم في خطوة واحدة. مثالية للشعر الكثيف والمجعد.",
    features: [
      "تقنية الكيراتين لشعر ناعم ولامع",
      "هواء ساخن ودافئ وبارد في آن واحد",
      "فرشاة مستديرة للحجم المثالي",
      "تقليل وقت التجفيف بنسبة 60%",
      "مناسبة لجميع أنواع الشعر",
    ],
    price1: 199,
    price2: 279,
    images: [
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=85",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=900&q=85",
    ],
    stars: 5,
    reviewCount: 198,
  },
  {
    id: "p3",
    slug: "raonaq-air-pink",
    name: "رونق إير بينك — ENZO EN-8220",
    nameFr: "Raonaq AIR Pink — ENZO EN-8220 Hair Dryer Brush",
    tag: "عرض محدود ⏳",
    tagline: "مجفف الشعر الفرشاة الوردي الأنيق",
    description:
      "الجمال يبدأ من التفاصيل. مجفف الفرشاة الوردي الأنيق يجمع بين التصفيف والتجفيف في خطوة واحدة. تصميم عصري أنثوي بقدرة احترافية.",
    features: [
      "تصميم وردي أنيق وعصري",
      "يجفف ويصفف الشعر في آن واحد",
      "تقنية أيونات سلبية تحمي الشعر",
      "خفيف الوزن وسهل الاستخدام",
      "2 درجات حرارة + هواء بارد",
    ],
    price1: 199,
    price2: 279,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=900&q=85",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=85",
    ],
    stars: 5,
    reviewCount: 147,
  },
  {
    id: "p4",
    slug: "raonaq-volume",
    name: "رونق فوليوم — Revlon One-Step",
    nameFr: "Raonaq VOLUME — Revlon One-Step Volumiser",
    tag: "الأكثر طلباً 🔥",
    tagline: "حجم مثالي وبريق استثنائي في خطوة واحدة",
    description:
      "الأداة التي يحبها الملايين حول العالم. Revlon One-Step تمنح شعرك الحجم المثالي واللمعان الاستثنائي في خطوة واحدة فقط. قولي وداعاً للأيام السيئة للشعر!",
    features: [
      "الأداة الأكثر مبيعاً عالمياً",
      "حجم ولمعان في خطوة واحدة",
      "تقنية Oval Brush لشعر ناعم",
      "مناسبة للشعر المتوسط والطويل",
      "تقليل التجعد بنسبة 70%",
    ],
    price1: 199,
    price2: 279,
    images: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85",
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=900&q=85",
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&q=85",
    ],
    stars: 5,
    reviewCount: 489,
  },
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
