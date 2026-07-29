"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { products } from "../lib/products";
import { useInView } from "../lib/useInView";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

// Fade-in wrapper
function FadeIn({
  children,
  delay = 0,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      {...props}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const faqs = [
  {
    q: "واش نقدر نقلب السلعة قبل ما نخلص؟",
    a: "أكيد. الليفور كيوصل حتى لباب الدار، تفتحي العلبة وتتأكدي من السلعة قدامو، عاد تخلصي. ما كاين حتى فلوس مسبقة، وما كاين حتى مخاطرة.",
  },
  {
    q: "شحال ديال الوقت باش يوصلني الطلب؟ وواش التوصيل مجاني؟",
    a: "التوصيل مجاني 100% لجميع مدن المغرب. غالباً كيوصلك الطلب بين 24 و 48 ساعة حسب المدينة والمنطقة.",
  },
  {
    q: "واش هاد الأدوات كتصلح لشعري؟",
    a: "نعم. مجموعة رونق مختارة للشعر المغربي — الرطب، الحرش، والمجعد. تقنية الأيونات والكيراتين كتعطي نعومة ولمعان مع حماية من الحرارة.",
  },
  {
    q: "واش السلعة أصلية؟ وعلاش نثق فـ رونق؟",
    a: "رونق بيوتي مركز معتمد للجمال (CMC). كنخدمو بأدوات أصلية مختارة بعناية، والتأكيد الأكبر: تقلبي الطلب بيدك قبل ما تخلصي درهم واحد.",
  },
  {
    q: "كيفاش نطلب؟ واش ساهل؟",
    a: "اختاري المنتج، دخلي الاسم ورقم الهاتف والمدينة والعنوان، وأكدي الطلب. حنا كندوزو التوصيل، ونتا ما تخلصي حتى توصلك السلعة للدار.",
  },
];

const heroImage = "/images/raonaq-hero-premium-v2.png";
const salonResultsImage = "/images/raonaq-salon-results.png";

const hairTypes = [
  {
    label: "حجم",
    labelEn: "Blowout",
    image: "/images/raonaq-hair-blowout.png",
    line: "للّي كتحرك بسرعة… وما كتساومش على النتيجة",
    href: "/products/raonaq-volume",
  },
  {
    label: "ناعم",
    labelEn: "Straight",
    image: "/images/raonaq-hair-straight.png",
    line: "للّي كتشوف البساطة هي الأناقة الحقيقية",
    href: "/products/raonaq-trio",
  },
  {
    label: "كيرلز",
    labelEn: "Curls",
    image: "/images/raonaq-hair-curls.png",
    line: "للّي كتحب الحجم، القوة، والحضور",
    href: "/products/raonaq-air-soft",
  },
  {
    label: "موجات",
    labelEn: "Waves",
    image: "/images/raonaq-hair-waves.png",
    line: "للّي عايشة بين السهولة والأناقة",
    href: "/products/raonaq-air-pink",
  },
];

const testimonials = [
  {
    name: "سارة من كازا",
    text: "وصلني الطلب فنهارو والتغليف كان مرتب. جربت الفرشاة وعطاتني حجم ولمعان بلا ما نمشي للصالون.",
  },
  {
    name: "مريم من طنجة",
    text: "اللي طمّنني أكثر هو أني خلصت ملي شفت السلعة بيدي. الإحساس ديال الثقة فرق كبير.",
  },
  {
    name: "نادية من الرباط",
    text: "الشعر ولى ناعم بسرعة، خصوصا من بعد الدوش. كنصح بها البنات اللي باغين نتيجة واضحة فدارهم.",
  },
];


export default function Home() {
  const { addToCart } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="overflow-x-hidden bg-[#F7F1EC]">

      {/* ══════════ HERO — براند أولاً، صورة مهيمنة، CTA واحد ══════════ */}
      <section className="relative min-h-[88vh] flex items-end md:items-center overflow-hidden bg-[#F7F1EC]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="رونق — نتيجة تصفيف الشعر في المغرب"
            className="hero-media w-full h-full object-cover object-[center_22%]"
          />
          {/* قراءة النص بدون تغطية الصورة بشارات أو كروت */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#F7F1EC]/95 via-[#F7F1EC]/55 to-transparent md:from-[#F7F1EC]/92 md:via-[#F7F1EC]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F1EC] via-transparent to-[#F7F1EC]/30 md:to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-16 pt-28 md:py-28">
          <div className="hero-copy max-w-xl text-right ms-auto" dir="rtl">
            <p className="text-4xl md:text-5xl lg:text-6xl font-black tracking-wide text-[#1C1412]">
              رونق
              <span className="block mt-1 text-lg md:text-xl font-bold text-[#C4A484] tracking-[0.35em]">
                RAONAQ
              </span>
            </p>

            <h1 className="mt-6 text-3xl md:text-5xl font-black leading-[1.2] text-[#1C1412]">
              أدوات تصفيف احترافية…
              <br />
              لنتيجة صالون فدارك
            </h1>

            <p className="mt-5 text-base md:text-lg text-[#1C1412]/70 leading-relaxed max-w-md">
              منتجات مختارة للشعر المغربي، توصيل سريع، وخلصي غير ملي تقلبي السلعة.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="#products"
                className="inline-flex justify-center bg-[#C45B6A] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#B84E5C] transition-colors duration-300"
              >
                شوفي المجموعة
              </Link>
              <p className="text-sm font-bold text-[#C4A484]">
                CMC · توصيل مجاني · الدفع عند الاستلام
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ شريط ثقة Champagne ══════════ */}
      <div className="bg-[#C4A484] text-[#1C1412] py-4 relative z-20">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-base font-black text-center">
          <span>قلبي السلعة قبل الدفع</span>
          <span>توصيل مجاني لكل المغرب</span>
          <span>مركز معتمد للجمال CMC</span>
        </div>
      </div>

      {/* ══════════ نتيجة صالون ══════════ */}
      <section className="relative overflow-hidden bg-[#F7F1EC]">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 45% at 80% 50%, rgba(196,164,132,0.2), transparent), radial-gradient(ellipse 35% 35% at 10% 25%, rgba(196,91,106,0.07), transparent)",
          }}
        />
        <div className="container mx-auto relative z-10 px-4 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
            <div className="salon-copy space-y-6 text-right" dir="rtl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-[#1C1412]">
                نتيجة صالون
                <br />
                <span className="relative inline-block">
                  فدارك
                  <span className="absolute -bottom-1 left-0 right-0 h-[0.35em] -z-10 bg-[#C45B6A]/20" />
                </span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-[#1C1412]/70 md:text-xl">
                أدوات رونق كتعطي حجم، نعومة، ولمعان — بلا موعد وبلا صالون.
              </p>
              <Link
                href="#products"
                className="inline-flex items-center bg-[#C45B6A] text-white px-8 py-3.5 rounded-2xl text-base font-black hover:bg-[#B84E5C] transition-colors duration-300"
              >
                اختاري أداتك
              </Link>
            </div>

            <div className="salon-visual relative">
              <img
                src={salonResultsImage}
                alt="أدوات رونق — نتيجة صالون في المنزل"
                className="mx-auto w-full max-w-3xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ YOUR HAIR AS IT IS ══════════ */}
      <section className="bg-[#F7F1EC] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-12 max-w-2xl text-right md:mb-16" dir="rtl">
              <p className="mb-3 text-sm font-black tracking-widest text-[#C45B6A]">رونق</p>
              <h2 className="text-4xl font-black leading-tight text-[#1C1412] md:text-5xl">
                شعرك… كما هو
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#1C1412]/65 md:text-lg">
                ما خاصكش تبدّلي شعرك باش تستعملي أدواتنا. رونق كيتأقلم معاك —
                كل قوام، كل حجم، وكل شكل كيستحق أدوات كتخدم بصح.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {hairTypes.map((type, i) => (
              <FadeIn key={type.labelEn} delay={i * 80}>
                <Link
                  href={type.href}
                  className="group relative block aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={type.image}
                    alt={type.label}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/60 via-transparent to-[#1C1412]/10" />
                  <span
                    className="absolute left-3 top-8 text-lg font-black tracking-[0.2em] text-white md:left-5 md:top-10 md:text-2xl"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {type.labelEn}
                  </span>
                  <p className="absolute inset-x-3 bottom-4 text-right text-[11px] font-bold leading-snug text-white/95 md:inset-x-5 md:bottom-6 md:text-sm" dir="rtl">
                    {type.line}
                  </p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BEST SELLERS ══════════ */}
      <section id="products" className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-widest text-[#C4A484] uppercase">اختاري اللي يناسبك</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">مجموعة رونق</h2>
              <p className="text-gray-500 text-lg">4 أدوات مختارة للنتيجة فدارك — بلا تعقيد وبلا دفع مسبق</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={i * 100}>
                <div className="group bg-white overflow-hidden border border-[#C4A484]/25 flex flex-col h-full transition-transform duration-500 hover:-translate-y-1">
                  <div className="relative aspect-square overflow-hidden bg-[#F7F1EC]">
                    {product.tag && (
                      <span className="absolute top-4 right-4 bg-[#C45B6A] text-white text-xs font-black px-4 py-1.5 z-10">
                        {product.tag}
                      </span>
                    )}
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-x-4 bottom-4 bg-white/95 px-4 py-3 text-right">
                      <p className="text-xs font-black text-[#C45B6A]">{product.tagline}</p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1" dir="rtl">
                    <div className="flex gap-1 text-yellow-400 text-sm mb-2">
                      {"★".repeat(product.stars)}
                      <span className="text-gray-400 text-xs mr-1 font-medium">({product.reviewCount})</span>
                    </div>
                    <h3 className="font-black text-lg text-[#1C1412] mb-3 leading-snug">{product.name}</h3>
                    <ul className="mb-4 space-y-2 text-sm text-gray-600 flex-1">
                      {product.features.slice(0, 2).map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7F1EC] text-xs font-black text-[#C45B6A]">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-3 mt-auto">
                      <button
                        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price1, quantity: 1, image: product.images[0] })}
                        className="w-full flex justify-between items-center p-3 border border-[#C4A484]/30 hover:border-[#C45B6A] hover:bg-[#F7F1EC] transition-all text-sm font-bold"
                      >
                        <span className="text-[#1C1412]/70">قطعة واحدة</span>
                        <span className="text-[#C45B6A] text-lg">{product.price1} د.م</span>
                      </button>
                      <button
                        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price2, quantity: 2, image: product.images[0] })}
                        className="w-full flex justify-between items-center p-3 bg-[#C45B6A] text-white hover:bg-[#B84E5C] transition-all text-sm font-black"
                      >
                        <span>قطعتين</span>
                        <span className="text-lg">{product.price2} د.م</span>
                      </button>
                      <Link href={`/products/${product.slug}`} className="block text-center text-sm font-black text-[#1C1412]/60 hover:text-[#C45B6A] transition-colors">
                        التفاصيل والصور
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BEFORE / AFTER ══════════ */}
      <section className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <FadeIn className="order-2 md:order-1">
            <BeforeAfterSlider
              src={heroImage}
              beforeLabel="قبل"
              afterLabel="بعد الاستعمال"
            />
          </FadeIn>

          <FadeIn delay={150} className="space-y-6 text-right" dir="rtl">
            <span className="text-sm font-bold tracking-widest text-[#C4A484] uppercase">النتيجة بعينيك</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] leading-tight">شعر أنعم وألمع،<br/>من أول أيام الاستعمال</h2>
            <p className="text-[#1C1412]/65 leading-relaxed text-lg">
              تقنية الأيونات والكيراتين كتخلي الشعرك مرتب، لامع، ومحمي من الحرارة — بلا ما تمشي للصالون.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-[#1C1412]"><span className="text-[#C45B6A] font-black">✓</span> خلصي غير ملي تقلبي السلعة</li>
              <li className="flex items-center gap-3 text-[#1C1412]"><span className="text-[#C45B6A] font-black">✓</span> توصيل مجاني حتى لباب الدار</li>
              <li className="flex items-center gap-3 text-[#1C1412]"><span className="text-[#C45B6A] font-black">✓</span> نتيجة واضحة فاستعمال سهل فدارك</li>
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* ══════════ SOCIAL PROOF ══════════ */}
      <section className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-sm font-bold tracking-widest text-[#C4A484] uppercase">تجارب من المغرب</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">شنو كيقولو على رونق؟</h2>
              <p className="text-[#1C1412]/55 text-lg">الثقة كتبدأ من التوصيل والدفع عند الاستلام</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6" dir="rtl">
            {testimonials.map((testimonial, i) => (
              <FadeIn key={testimonial.name} delay={i * 100}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-sm border border-[#C4A484]/20">
                  <div className="mb-4 flex gap-1 text-xl text-yellow-400">★★★★★</div>
                  <p className="text-gray-700 leading-relaxed">«{testimonial.text}»</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C45B6A]/15 font-black text-[#C45B6A]">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-[#1C1412]">{testimonial.name}</p>
                      <p className="text-xs font-bold text-green-600">عملية شراء مؤكدة</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-sm font-bold tracking-widest text-[#C4A484] uppercase">أجوبة صريحة</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">كلشي واضح قبل ما تطلبي</h2>
              <p className="text-[#1C1412]/55 text-lg">أسئلة البنات اللي كيطلبو من رونق — جواب مباشر</p>
            </div>
          </FadeIn>

          <div className="space-y-3" dir="rtl">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div
                  className={`overflow-hidden transition-colors duration-300 border ${openFaq === i ? "border-[#C45B6A] bg-white" : "border-[#C4A484]/25 bg-white/70 hover:border-[#C4A484]/50"}`}
                >
                  <button
                    className="w-full text-right p-6 flex justify-between items-center gap-4 font-black text-lg text-[#1C1412]"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <span className={`text-[#C45B6A] transition-transform duration-300 shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-56 pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-[#1C1412]/65 leading-relaxed text-base">{faq.a}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
