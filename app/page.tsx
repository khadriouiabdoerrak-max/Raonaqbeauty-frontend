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
    a: "اختاري المنتج، دخلي الاسم ورقم الهاتف، وأكدي الطلب. حنا كندوزو التوصيل، ونتا ما تخلصي حتى توصلك السلعة للدار.",
  },
];

const heroImage = "/images/raonaq-hero-premium-v2.png";
const featuredImage = "/images/raonaq-hero-hair-styling.png";
const salonResultsImage = "/images/raonaq-salon-results.png";

const proofStats = [
  { value: "عند الباب", label: "خلصي بعد ما تقلبي" },
  { value: "CMC", label: "مركز معتمد للجمال" },
  { value: "مجاني", label: "توصيل لكل المغرب" },
];

const benefits = [
  "ما كاين حتى دفع مسبق",
  "توصيل حتى لباب الدار",
  "نتيجة صالون بلا موعد",
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
    <div className="overflow-x-hidden">

      {/* ══════════ PREMIUM HERO ══════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#1C1412]">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="نتيجة تصفيف الشعر مع رونق بيوتي"
            className="w-full h-full object-cover object-[center_18%] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1412]/95 via-[#1C1412]/70 to-[#1C1412]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-transparent to-transparent" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#C45B6A]/30 blur-3xl" />
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#C4A484]/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center relative z-10 py-20">
          <div className="space-y-8 text-right" dir="rtl">
            <p className="text-2xl md:text-3xl font-black tracking-wide text-[#C4A484]">
              رونق
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.12] text-white">
              الجمال اللي كيبان،
              <br />
              <span className="text-[#C4A484]">من أول تصفيفة فدارك</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
              رونق كتجيب ليك أدوات تصفيف احترافية مختارة للشعر المغربي — حجم، نعومة، ولمعان بلا ما تمشي للصالون.
              والأحسن: ما تخلصي حتى تشوفي السلعة قدامك.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {proofStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-md">
                  <p className="text-xl md:text-2xl font-black text-[#C4A484]">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold text-white/75">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl max-w-xl">
              <div className="grid gap-3 sm:grid-cols-3 text-white">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm font-bold">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C45B6A] text-xs">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="#products" className="bg-[#C45B6A] text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-[#a64d5a] transition-all duration-300 shadow-xl shadow-[#C45B6A]/30 hover:scale-105">
                ابدئي بطلبك
              </Link>
              <Link href="/collection" className="border border-white/25 bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-[#1C1412] transition-all duration-300">
                اكتشفي المجموعة
              </Link>
            </div>
          </div>

          <div className="hidden lg:block" dir="rtl">
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="absolute -top-4 right-8 rounded-full bg-[#C4A484] px-5 py-2 text-sm font-black text-[#1C1412] shadow-xl">
                الاختيار الأول للبنات
              </div>
              <img
                src={featuredImage}
                alt={products[0].name}
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover object-center"
              />
              <div className="mt-5 space-y-4 text-white">
                <div>
                  <p className="text-sm font-bold text-[#C4A484]">{products[0].tag}</p>
                  <h2 className="mt-1 text-2xl font-black">{products[0].name}</h2>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-sm text-white/70">3 أدوات فباك واحد — النتيجة واضحة من أول استعمال.</p>
                  <p className="text-3xl font-black text-[#C4A484]">{products[0].price1} د.م</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ VIP TRUST BAR ══════════ */}
      <div className="bg-[#C4A484] text-[#1C1412] py-5 shadow-lg relative z-20 -mt-2">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-14 text-sm md:text-base font-black text-center">
          <span className="flex items-center gap-2"><span>✓</span> قلبي السلعة قبل الدفع</span>
          <span className="flex items-center gap-2"><span>✓</span> توصيل مجاني لكل المغرب</span>
          <span className="flex items-center gap-2"><span>✓</span> مركز معتمد للجمال CMC</span>
        </div>
      </div>

      {/* ══════════ SALON RESULTS AT HOME ══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F1EC] via-[#faf6f2] to-[#eee4db]">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 75% 55%, rgba(196,164,132,0.22), transparent), radial-gradient(ellipse 40% 40% at 15% 30%, rgba(196,91,106,0.08), transparent)",
          }}
        />
        <div className="container mx-auto relative z-10 px-4 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
            <div className="salon-copy space-y-6 text-right" dir="rtl">
              <p className="text-2xl font-black tracking-wide text-[#C45B6A]">رونق</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-[#1C1412]">
                نتيجة صالون
                <br />
                <span className="relative inline-block">
                  فدارك
                  <span className="absolute -bottom-1 left-0 right-0 h-[0.35em] -z-10 bg-[#C45B6A]/25" />
                </span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-[#1C1412]/70 md:text-xl">
                أدوات رونق كتعطي نتيجة احترافية مع حماية الشعر — حجم، نعومة، ولمعان بلا موعد وبلا صالون.
              </p>
              <Link
                href="#products"
                className="inline-flex items-center gap-2 rounded-full border border-[#1C1412]/20 bg-white/70 px-8 py-3.5 text-base font-black text-[#1C1412] backdrop-blur transition-all duration-300 hover:border-[#C45B6A] hover:bg-[#C45B6A] hover:text-white"
              >
                شوفي المجموعة
              </Link>
            </div>

            <div className="salon-visual relative">
              <img
                src={salonResultsImage}
                alt="أدوات رونق — نتيجة صالون في المنزل"
                className="mx-auto w-full max-w-3xl object-contain drop-shadow-[0_20px_40px_rgba(28,20,18,0.12)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ BEST SELLERS ══════════ */}
      <section id="products" className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-widest text-[#C45B6A] uppercase">اختاري اللي يناسبك</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">مجموعة رونق</h2>
              <p className="text-gray-500 text-lg">4 أدوات مختارة للنتيجة فدارك — بلا تعقيد وبلا دفع مسبق</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={i * 100}>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-[#C4A484]/20 flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden bg-[#F7F1EC]">
                    {product.tag && (
                      <span className="absolute top-4 right-4 bg-[#C45B6A] text-white text-xs font-black px-4 py-1.5 rounded-full z-10 shadow-md">
                        {product.tag}
                      </span>
                    )}
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-right shadow-lg backdrop-blur">
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
                        className="w-full flex justify-between items-center p-3 border-2 border-gray-100 rounded-xl hover:border-[#C45B6A] hover:bg-red-50 transition-all text-sm font-bold"
                      >
                        <span className="text-gray-600">قطعة واحدة</span>
                        <span className="text-[#C45B6A] text-lg">{product.price1} د.م</span>
                      </button>
                      <button
                        onClick={() => addToCart({ id: product.id, name: product.name, price: product.price2, quantity: 2, image: product.images[0] })}
                        className="w-full flex justify-between items-center p-3 bg-[#1C1412] text-white rounded-xl hover:bg-[#C45B6A] transition-all text-sm font-black shadow-lg"
                      >
                        <span>قطعتين 🔥</span>
                        <span className="text-lg">{product.price2} د.م</span>
                      </button>
                      <Link href={`/products/${product.slug}`} className="block text-center text-sm font-black text-[#C45B6A] hover:text-[#1C1412] transition-colors">
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <FadeIn className="order-2 md:order-1">
            <BeforeAfterSlider
              src={heroImage}
              beforeLabel="قبل"
              afterLabel="بعد الاستعمال ✨"
            />
          </FadeIn>

          <FadeIn delay={150} className="space-y-6 text-right" dir="rtl">
            <span className="text-sm font-bold tracking-widest text-[#C45B6A] uppercase">النتيجة بعينيك</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] leading-tight">شعر أنعم وألمع،<br/>من أول أيام الاستعمال</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              تقنية الأيونات والكيراتين كتخلي الشعرك مرتب، لامع، ومحمي من الحرارة — بلا ما تمشي للصالون.
            </p>
            <div className="bg-[#F7F1EC] rounded-2xl p-6 mt-4">
              <h3 className="font-black text-lg mb-3 text-[#C45B6A]">علاش البنات كتختار رونق؟</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="text-[#C45B6A] font-black">✓</span> خلصي غير ملي تقلبي السلعة</li>
                <li className="flex items-center gap-3"><span className="text-[#C45B6A] font-black">✓</span> توصيل مجاني حتى لباب الدار</li>
                <li className="flex items-center gap-3"><span className="text-[#C45B6A] font-black">✓</span> نتيجة واضحة فاستعمال سهل فدارك</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* قسم UGC — سيتم إضافته لاحقاً بفيديوهات حقيقية */}

      {/* ══════════ SOCIAL PROOF ══════════ */}
      <section className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-sm font-bold tracking-widest text-[#C45B6A] uppercase">تجارب من المغرب</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">شنو كيقولو على رونق؟</h2>
              <p className="text-gray-500 text-lg">الثقة كتبدأ من التوصيل والدفع عند الاستلام</p>
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-sm font-bold tracking-widest text-[#C45B6A] uppercase">أجوبة صريحة</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">كلشي واضح قبل ما تطلبي</h2>
              <p className="text-gray-500 text-lg">أسئلة البنات اللي كيطلبو من رونق — جواب مباشر بلا لف ودوران</p>
            </div>
          </FadeIn>

          <div className="space-y-4" dir="rtl">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div 
                  className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-[#C45B6A] bg-[#F7F1EC]/60' : 'border-gray-100 hover:border-[#C4A484]/40'}`}
                >
                  <button 
                    className="w-full text-right p-6 flex justify-between items-center gap-4 font-black text-lg text-[#1C1412]"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <span className={`text-[#C45B6A] transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-56 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 leading-relaxed text-base">{faq.a}</p>
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
