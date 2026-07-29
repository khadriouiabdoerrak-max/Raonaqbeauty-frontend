"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { products } from "../lib/products";
import { useInView } from "../lib/useInView";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const heroImage = "/images/raonaq-hero-branded.png";
const heroMobileImage = "/images/raonaq-hero-mobile.png";
const lifestyleImage = "/images/raonaq-lifestyle-home.png";
const toolsImage = "/images/raonaq-tools-editorial.png";

const featured = products[0]; // تريو — البطلة

const heroProof = [
  { value: "24–48h", label: "توصيل سريع" },
  { value: "COD", label: "خلصي عند الباب" },
  { value: "4.8/5", label: "تجارب مؤكدة" },
];

const looks = [
  {
    title: "حجم",
    en: "VOLUME",
    image: "/images/raonaq-hair-blowout.png",
    href: "/products/raonaq-volume",
    product: "رونق فوليوم",
    line: "رفع من الجذور · حضور قوي",
  },
  {
    title: "نعومة",
    en: "SMOOTH",
    image: "/images/raonaq-hair-straight.png",
    href: "/products/raonaq-trio",
    product: "رونق تريو",
    line: "انسيابية ولمعان فدارك",
  },
  {
    title: "كثافة",
    en: "SOFT",
    image: "/images/raonaq-hair-curls.png",
    href: "/products/raonaq-air-soft",
    product: "رونق إير سوفت",
    line: "للشعر الكثيف والمجعد",
  },
  {
    title: "يومي",
    en: "DAILY",
    image: "/images/raonaq-hair-waves.png",
    href: "/products/raonaq-air-pink",
    product: "رونق إير بينك",
    line: "ترتيب خفيف قبل الخروج",
  },
];

const faqs = [
  {
    q: "واش نقدر نقلب السلعة قبل ما نخلص؟",
    a: "أكيد. الليفور كيوصل للباب، تفتحي وتتأكدي قدامو، عاد تخلصي. ما كاين حتى دفع مسبق.",
  },
  {
    q: "شحال كياخد التوصيل؟ واش مجاني؟",
    a: "مجاني لجميع مدن المغرب. غالباً بين 24 و 48 ساعة حسب المدينة.",
  },
  {
    q: "كيفاش نختار الأداة المناسبة؟",
    a: "فوليوم للحجم، إير سوفت للكثيف والنعومة، إير بينك لليومي، وتريو إلا بغيتي طقم كامل فباكة وحدة.",
  },
  {
    q: "علاش نطلب من رونق؟",
    a: "براند مغربي لنتيجة احترافية مع حماية الشعر — مجموعة مختارة، مش كتالوج عشوائي، ووعد واضح: تقلبي قبل ما تخلصي.",
  },
];

const voices = [
  {
    city: "الدار البيضاء",
    name: "سارة",
    text: "عطاتني حجم ولمعان بلا صالون، والشعر ما حسّيتوش تقيل. الطلب وصل فنهارو.",
  },
  {
    city: "طنجة",
    name: "مريم",
    text: "خلصت غير ملي شفت السلعة بيدي. هاد الثقة هي اللي خلّاتني نطلب براحتي.",
  },
  {
    city: "الرباط",
    name: "نادية",
    text: "نعومة ولمعان من بعد الدوش بسرعة. كنستعملها تقريبا كل صباح بلا ما نفكّر فالصالون.",
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const addOne = (id: string, name: string, price: number, image: string, qty = 1) => {
    addToCart({ id, name, price, quantity: qty, image });
  };

  return (
    <div className="overflow-x-hidden bg-[#F7F1EC]">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[calc(100svh-112px)] overflow-hidden bg-[#1C1412] md:min-h-[100svh]">
        <picture>
          <source srcSet={heroMobileImage} media="(max-width: 767px)" />
          <img
            src={heroImage}
            alt="أدوات رونق — نتيجة صالون في المنزل"
            className="hero-media absolute inset-0 h-full w-full object-cover object-[center_top] md:object-[center_18%]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/62 to-[#1C1412]/5" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#1C1412]/45 to-transparent md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#1C1412]/75 via-[#1C1412]/25 to-transparent hidden md:block" />

        <div className="relative z-10 flex min-h-[calc(100svh-112px)] w-full items-end md:min-h-[100svh]">
          <div className="container mx-auto px-4 pb-8 pt-20 md:pb-24 md:pt-40">
            <div className="hero-copy me-auto max-w-xl text-right text-white" dir="rtl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black text-[#F7F1EC] backdrop-blur-md md:text-sm">
                <span className="h-2 w-2 rounded-full bg-[#C4A484]" />
                براند مغربي لأدوات الشعر الاحترافية
              </div>

              <p className="mb-3 text-3xl font-black tracking-[0.08em] text-[#C4A484] md:text-5xl">رونق</p>
              <h1 className="max-w-[10ch] text-4xl font-black leading-[1.08] md:max-w-none md:text-7xl">
                نتيجة صالون
                <br />
                فدارك
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-xl">
                حجم، نعومة، ولمعان مع حماية للشعر — أدوات مختارة للبنات اللي بغاو نتيجة احترافية بلا موعد.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center md:max-w-md">
                {heroProof.map((item) => (
                  <div key={item.label} className="border border-white/14 bg-white/10 px-2 py-3 backdrop-blur-md">
                    <p className="text-sm font-black text-[#C4A484] md:text-lg">{item.value}</p>
                    <p className="mt-1 text-[10px] font-bold text-white/75 md:text-xs">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 max-w-md border border-white/14 bg-[#F7F1EC]/95 p-4 text-[#1C1412] shadow-2xl backdrop-blur-md">
                <p className="text-xs font-black text-[#C45B6A]">الأكثر طلباً اليوم</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xl font-black">{featured.name}</p>
                    <p className="mt-1 text-xs font-bold text-[#1C1412]/55">3 أدوات فباكة وحدة · قلبي قبل الدفع</p>
                  </div>
                  <p className="shrink-0 text-3xl font-black text-[#C45B6A]">
                    {featured.price1}
                    <span className="mr-1 text-sm">د.م</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => addOne(featured.id, featured.name, featured.price1, featured.images[0])}
                  className="bg-[#C45B6A] px-10 py-4 text-base font-black text-white transition-colors hover:bg-[#a64d5a] md:text-lg"
                >
                  طلبي الأكثر طلباً
                </button>
                <Link
                  href="#shop"
                  className="border border-white/35 px-8 py-4 text-center text-base font-black text-white transition-colors hover:bg-white hover:text-[#1C1412] md:text-lg"
                >
                  شوفي المجموعة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 border border-[#C4A484]/30 bg-[#1C1412]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden" dir="rtl">
        <button
          onClick={() => addOne(featured.id, featured.name, featured.price1, featured.images[0])}
          className="flex w-full items-center justify-between bg-[#C45B6A] px-4 py-3 text-white"
        >
          <span className="text-right">
            <span className="block text-sm font-black">طلبي رونق تريو</span>
            <span className="block text-[10px] font-bold text-white/75">الدفع عند الاستلام</span>
          </span>
          <span className="text-xl font-black">{featured.price1} د.م</span>
        </button>
      </div>

      {/* وعد واحد */}
      <div className="border-b border-[#1C1412]/10 bg-[#C4A484]">
        <div
          className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-4 text-center text-sm font-black text-[#1C1412] md:text-base"
          dir="rtl"
        >
          <span>أدوات رونق — نتيجة صالون في المنزل</span>
          <span className="hidden text-[#1C1412]/35 sm:inline">|</span>
          <span>قلبي قبل ما تخلصي</span>
          <span className="hidden text-[#1C1412]/35 sm:inline">|</span>
          <span>توصيل مجاني لكل المغرب</span>
        </div>
      </div>

      {/* ═══════════════ المنتج البطلة ═══════════════ */}
      <section className="relative overflow-hidden bg-[#F7F1EC]" id="featured">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
            <FadeIn className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src={featured.images[0]}
                  alt={featured.name}
                  className="mx-auto w-full max-w-lg object-contain drop-shadow-[0_30px_60px_rgba(28,20,18,0.12)]"
                />
              </div>
            </FadeIn>

            <FadeIn delay={120} className="order-1 space-y-6 text-right lg:order-2" >
              <div dir="rtl">
                <p className="text-sm font-black tracking-[0.25em] text-[#C45B6A]">الاختيار الذكي</p>
                <p className="mt-4 text-3xl font-black text-[#C4A484]">رونق</p>
                <h2 className="mt-1 text-4xl font-black leading-tight text-[#1C1412] md:text-5xl">
                  {featured.name}
                </h2>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-[#1C1412]/65">
                  طقم واحد كيجمع الفرد، الويفي، والحجم فباكة مرتبة — نتيجة صالون فدارك مع حماية للشعر، ليك أو كهدية.
                </p>

                <ul className="mt-6 space-y-2 text-[#1C1412]/75">
                  {featured.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium md:text-base">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#1C1412]/45">ابتداءً من</p>
                    <p className="text-4xl font-black text-[#C45B6A]">
                      {featured.price1}
                      <span className="mr-1 text-lg font-bold">د.م</span>
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      addOne(featured.id, featured.name, featured.price1, featured.images[0])
                    }
                    className="bg-[#C45B6A] px-8 py-4 text-base font-black text-white transition-colors hover:bg-[#a64d5a]"
                  >
                    طلبي دابا
                  </button>
                  <Link
                    href={`/products/${featured.slug}`}
                    className="px-2 py-4 text-base font-bold text-[#1C1412] underline-offset-4 hover:underline"
                  >
                    شوفي التفاصيل
                  </Link>
                </div>

                <p className="mt-4 text-sm text-[#1C1412]/50">
                  عرض قطعتين بـ {featured.price2} د.م — كتوفري{" "}
                  {featured.price1 * 2 - featured.price2} درهم
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ النتيجة ═══════════════ */}
      <section className="relative min-h-[70vh] overflow-hidden bg-[#1C1412]" id="looks">
        <img
          src={lifestyleImage}
          alt="تصفيف فدارك مع رونق"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-50"
        />
        <div className="absolute inset-0 bg-[#1C1412]/55" />
        <div className="relative z-10 flex min-h-[70vh] items-center">
          <div className="container mx-auto px-4 py-20" dir="rtl">
            <FadeIn>
              <div className="max-w-lg text-right text-white">
                <p className="text-sm font-black tracking-[0.25em] text-[#C4A484]">أدوات رونق</p>
                <h2 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
                  نتيجة صالون
                  <br />
                  في المنزل
                </h2>
                <p className="mt-5 text-lg text-white/75">
                  حجم، نعومة، ولمعان — نتيجة احترافية مع حماية الشعر، بلا موعد وبلا صالون.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ اختاري الستايل ═══════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-12 max-w-xl text-right md:mb-16" dir="rtl">
              <p className="text-sm font-black tracking-[0.25em] text-[#C45B6A]">اختاري</p>
              <h2 className="mt-3 text-4xl font-black text-[#1C1412] md:text-5xl">
                شنو بغيتي يبان؟
              </h2>
              <p className="mt-4 text-lg text-[#1C1412]/60">
                كل نتيجة عندها أداتها — اختاري الحجم، النعومة، أو اللمعان اللي كيشبهك.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {looks.map((look, i) => (
              <FadeIn key={look.en} delay={i * 70}>
                <Link href={look.href} className="group relative block aspect-[3/4] overflow-hidden">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/80 via-[#1C1412]/10 to-transparent" />
                  <span
                    className="absolute left-3 top-8 text-base font-black tracking-[0.22em] text-white/90 md:left-4 md:top-10 md:text-xl"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {look.en}
                  </span>
                  <div className="absolute inset-x-3 bottom-4 text-right md:inset-x-4 md:bottom-5" dir="rtl">
                    <p className="text-lg font-black text-white md:text-xl">{look.title}</p>
                    <p className="mt-1 text-[11px] font-medium text-white/80 md:text-sm">{look.line}</p>
                    <p className="mt-2 text-[10px] font-black tracking-wide text-[#C4A484] md:text-xs">
                      {look.product}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ المجموعة ═══════════════ */}
      <section id="shop" className="bg-[#F7F1EC] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-14 text-center" dir="rtl">
              <p className="text-sm font-black tracking-[0.25em] text-[#C45B6A]">المجموعة</p>
              <h2 className="mt-3 text-4xl font-black text-[#1C1412] md:text-5xl">أربع أدوات. هوية واحدة.</h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-[#1C1412]/60">
                مختارة لنتيجة احترافية مع حماية الشعر · 199 د.م · خلصي عند الباب
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={i * 90}>
                <article className="group flex h-full flex-col overflow-hidden border border-[#C4A484]/25 bg-white shadow-[0_18px_55px_rgba(28,20,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(28,20,18,0.12)]">
                  <Link
                    href={`/products/${product.slug}`}
                    className="block flex-1"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#F7F1EC] to-white">
                      {product.tag && (
                        <span className="absolute right-3 top-3 z-10 bg-[#1C1412] px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                          {product.tag}
                        </span>
                      )}
                      <span className="absolute bottom-3 left-3 z-10 bg-white/90 px-3 py-1.5 text-xs font-black text-[#C45B6A] shadow-lg backdrop-blur">
                        {product.price1} د.م
                      </span>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 text-right" dir="rtl">
                      <p className="text-[11px] font-black tracking-wide text-[#C45B6A]">
                        {product.bestFor}
                      </p>
                      <h3 className="mt-1 text-2xl font-black leading-tight text-[#1C1412]">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm font-black text-[#1C1412]/80">
                        {product.tagline}
                      </p>
                      <p className="mt-3 min-h-[44px] text-sm leading-relaxed text-[#1C1412]/58">
                        {product.result}
                      </p>
                      <p className="mt-4 text-xs font-black text-[#C45B6A]">
                        اضغطي على الكارت وشوفي التفاصيل
                      </p>
                    </div>
                  </Link>

                  <div className="space-y-2 px-5 pb-5 pt-1" dir="rtl">
                    <button
                      onClick={() =>
                        addOne(product.id, product.name, product.price1, product.images[0], 1)
                      }
                      className="flex w-full items-center justify-between rounded-full border border-[#1C1412]/12 bg-white px-5 py-3 text-right transition-colors hover:border-[#C45B6A] hover:bg-[#F7F1EC]"
                    >
                      <span className="text-sm font-black text-[#1C1412]">طلبي قطعة</span>
                      <span className="text-lg font-black text-[#C45B6A]">{product.price1} د.م</span>
                    </button>
                    <button
                      onClick={() =>
                        addOne(product.id, product.name, product.price2, product.images[0], 2)
                      }
                      className="flex w-full items-center justify-between rounded-full bg-[#1C1412] px-5 py-3 text-right text-white shadow-[0_12px_30px_rgba(28,20,18,0.18)] transition-colors hover:bg-[#C45B6A]"
                    >
                      <span>
                        <span className="block text-sm font-black">عرض قطعتين</span>
                        <span className="block text-[10px] font-bold text-white/65">وفري 119 درهم</span>
                      </span>
                      <span className="text-lg font-black">{product.price2} د.م</span>
                    </button>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ الثقة ═══════════════ */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden bg-[#1C1412]">
            <img
              src={toolsImage}
              alt="أدوات رونق — نتيجة صالون في المنزل"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
          <div className="flex items-center bg-[#F7F1EC] px-6 py-16 md:px-14 md:py-24" dir="rtl">
            <FadeIn>
              <div className="max-w-md space-y-6 text-right">
                <p className="text-sm font-black tracking-[0.25em] text-[#C45B6A]">الثقة</p>
                <h2 className="text-4xl font-black leading-tight text-[#1C1412] md:text-5xl">
                  ما تخلصي حتى
                  <br />
                  تشوفي بديك
                </h2>
                <p className="text-lg leading-relaxed text-[#1C1412]/65">
                  رونق كيبني الثقة من أول طلب: نتيجة احترافية، حماية للشعر، والطلب كيوصل للدار — تقلبيه، وعاد تخلصي.
                </p>
                <div className="space-y-3 pt-2 text-[#1C1412]/80">
                  {[
                    "توصيل مجاني حتى لباب الدار",
                    "تفتحي وتتأكدي قدام الليفور",
                    "خلصي غير إلا عجبك",
                  ].map((line) => (
                    <p key={line} className="flex items-center gap-3 font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C45B6A]" />
                      {line}
                    </p>
                  ))}
                </div>
                <Link
                  href="#shop"
                  className="mt-4 inline-block bg-[#1C1412] px-8 py-4 font-black text-white transition-colors hover:bg-[#C45B6A]"
                >
                  ابدئي الطلب
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ أصوات ═══════════════ */}
      <section className="bg-[#F7F1EC] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-12 text-center" dir="rtl">
              <p className="text-sm font-black tracking-[0.25em] text-[#C45B6A]">من المغرب</p>
              <h2 className="mt-3 text-4xl font-black text-[#1C1412] md:text-5xl">كلمات البنات</h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3" dir="rtl">
            {voices.map((v, i) => (
              <FadeIn key={v.name} delay={i * 100}>
                <blockquote className="flex h-full flex-col border border-[#C4A484]/30 bg-white p-7">
                  <p className="flex-1 text-base leading-relaxed text-[#1C1412]/75">«{v.text}»</p>
                  <footer className="mt-8">
                    <p className="font-black text-[#1C1412]">{v.name}</p>
                    <p className="text-sm text-[#C45B6A]">{v.city}</p>
                  </footer>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <div className="mb-12 text-center" dir="rtl">
              <p className="text-sm font-black tracking-[0.25em] text-[#C45B6A]">أسئلة</p>
              <h2 className="mt-3 text-4xl font-black text-[#1C1412] md:text-5xl">قبل ما تطلبي</h2>
            </div>
          </FadeIn>

          <div className="space-y-2" dir="rtl">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <FadeIn key={faq.q} delay={i * 50}>
                  <div className={`border transition-colors ${open ? "border-[#C45B6A] bg-[#F7F1EC]/60" : "border-[#1C1412]/10"}`}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 p-5 text-right text-lg font-black text-[#1C1412]"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                    >
                      {faq.q}
                      <span className={`shrink-0 text-[#C45B6A] transition-transform ${open ? "rotate-180" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </button>
                    <div className={`overflow-hidden px-5 transition-all ${open ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                      <p className="leading-relaxed text-[#1C1412]/65">{faq.a}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ ختام ═══════════════ */}
      <section className="relative overflow-hidden bg-[#1C1412] py-24 text-center text-white md:py-32">
        <img
          src={heroImage}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_15%] opacity-25"
        />
        <div className="absolute inset-0 bg-[#1C1412]/70" />
        <div className="relative z-10 container mx-auto max-w-xl px-4" dir="rtl">
          <p className="text-4xl font-black tracking-wide text-[#C4A484]">رونق</p>
          <h2 className="mt-5 text-4xl font-black md:text-5xl">نتيجة صالون فدارك</h2>
          <p className="mt-4 text-lg text-white/70">
            أدوات رونق — حجم · نعومة · لمعان مع حماية الشعر
          </p>
          <Link
            href="/collection"
            className="mt-10 inline-block bg-[#C45B6A] px-12 py-4 text-lg font-black text-white transition-colors hover:bg-[#a64d5a]"
          >
            شوفي المجموعة
          </Link>
        </div>
      </section>
    </div>
  );
}
