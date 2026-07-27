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
    a: "طبعاً! راحتك هي الأهم عندنا. ملي يجيب ليك الليفرور الكوموند حتى لباب الدار، حليها وتأكدي منها مزيان، عاد خلصي."
  },
  {
    q: "شحال ديال الوقت باش يوصلني الطلب؟",
    a: "التوصيل عندنا سريع ومجاني لجميع مدن المغرب. غالباً كيوصلك الطلب ديالك بين 24 حتى 48 ساعة كأقصى تقدير."
  },
  {
    q: "واش هاد المنتجات كتصلح لجميع أنواع الشعر؟",
    a: "أكيد! صممناها بتقنية الأيونات والكيراتين باش تناسب الزغبة الرطبة، الحرشة، والمجعدة. كتخلي الشعر ناعم ولامع بلا ما تضرو بالحرارة."
  },
  {
    q: "واش السلعة أصلية؟",
    a: "رونق بيوتي هو المركز المعتمد للجمال (CMC). جميع منتجاتنا أصلية 100% ومضمونة، وتستعمل في أرقى الصالونات."
  }
];

const heroImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=90";

const proofStats = [
  { value: "+1200", label: "عميلة راضية" },
  { value: "24-48h", label: "توصيل سريع" },
  { value: "COD", label: "الدفع عند الاستلام" },
];

const benefits = [
  "نتيجة صالون فدارك فدقائق",
  "منتجات مختارة للشعر المغربي",
  "قلبي السلعة قبل ما تخلصي",
];

const testimonials = [
  {
    name: "سارة من كازا",
    text: "وصلني الطلب فنهارو والتغليف كان زوين. جربت الفرشاة وعطاتني volume بلا ما نمشي للصالون.",
  },
  {
    name: "مريم من طنجة",
    text: "عجبني بزاف حيث خلصت ملي شفت السلعة. الإحساس ديال الثقة فرق كبير.",
  },
  {
    name: "نادية من الرباط",
    text: "الشعر ولى ناعم بسرعة، خصوصا من بعد الدوش. كنصح بها البنات اللي باغين نتيجة سريعة.",
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
            alt="Raonaq Beauty hair styling result"
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1412]/95 via-[#1C1412]/70 to-[#1C1412]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-transparent to-transparent" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#C45B6A]/30 blur-3xl" />
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#C4A484]/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center relative z-10 py-20">
          <div className="space-y-8 text-right" dir="rtl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
              <span className="text-[#C4A484]">✦</span>
              <span className="text-xs font-bold text-white tracking-wide">Raonaq Beauty — رونق الشعر المغربي</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.15] text-white">
              ستايل صالون <br />
              <span className="text-[#C4A484]">فدارك، بلا صداع</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
              رونق كتجمع ليك أدوات تصفيف مختارة بعناية: تجفيف، فرد، volume ولمعان فدقائق. توصيل سريع فالمغرب والدفع حتى توصلك السلعة.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-xl">
              {proofStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-md">
                  <p className="text-2xl font-black text-[#C4A484]">{stat.value}</p>
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
                اطلبي دابا 
              </Link>
              <Link href="/collection" className="border border-white/25 bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-[#1C1412] transition-all duration-300">
                شوفي المنتجات
              </Link>
            </div>
          </div>

          <div className="hidden lg:block" dir="rtl">
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="absolute -top-4 right-8 rounded-full bg-[#C4A484] px-5 py-2 text-sm font-black text-[#1C1412] shadow-xl">
                العرض الأكثر طلباً
              </div>
              <img
                src={products[0].images[0]}
                alt={products[0].name}
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
              />
              <div className="mt-5 space-y-4 text-white">
                <div>
                  <p className="text-sm font-bold text-[#C4A484]">{products[0].tag}</p>
                  <h2 className="mt-1 text-2xl font-black">{products[0].name}</h2>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-sm text-white/70">3 أدوات فباك واحد، مثالي ليك أو كهدية.</p>
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
          <span className="flex items-center gap-2"><span>🚚</span> التوصيل فابور حتى للدار</span>
          <span className="flex items-center gap-2"><span>💵</span> خلصي حتى توصلك السلعة</span>
          <span className="flex items-center gap-2"><span>✨</span> ستايل premium بلا صالون</span>
        </div>
      </div>

      {/* ══════════ BEST SELLERS ══════════ */}
      <section id="products" className="py-24 bg-[#F7F1EC]">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-sm font-bold tracking-widest text-[#C45B6A] uppercase">اختاري اللي يناسبك</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">مجموعتنا الحصرية</h2>
              <p className="text-gray-500 text-lg">أدوات مصممة خصيصاً لجمال المرأة المغربية</p>
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
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] leading-tight">الفرق واضح،<br/>والنتيجة مضمونة!</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              زلقي بصباعك وشوفي النتيجة. تقنية الأيونات السلبية كتخلي شعرك رطب، لامع، ومحمي من الحرارة. وداعا للشعر المنفوخ والمخبل!
            </p>
            <div className="bg-[#F7F1EC] rounded-2xl p-6 mt-4">
              <h3 className="font-black text-lg mb-3 text-[#C45B6A]">علاش رونق بيوتي؟</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="text-xl">✅</span> نتيجة من أول 5 دقائق</li>
                <li className="flex items-center gap-3"><span className="text-xl">✅</span> حماية تامة من التلف</li>
                <li className="flex items-center gap-3"><span className="text-xl">✅</span> ساهل في الاستعمال بوحدك فدار</li>
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
              <span className="text-sm font-bold tracking-widest text-[#C45B6A] uppercase">تجارب حقيقية</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1412] mt-3 mb-4">شنو قالو البنات على رونق؟</h2>
              <p className="text-gray-500 text-lg">ثقة كتبدأ من أول رسالة وكتكمل مع أول استعمال</p>
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

      {/* ══════════ FAQ (NEW) ══════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-[#1C1412] mb-4">عندك سؤال؟ حنا نجاوبوك</h2>
              <p className="text-gray-500">كلشي واضح وشفاف معانا</p>
            </div>
          </FadeIn>

          <div className="space-y-4" dir="rtl">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div 
                  className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-[#C45B6A] bg-red-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <button 
                    className="w-full text-right p-6 flex justify-between items-center font-black text-lg text-[#1C1412]"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.q}
                    <span className={`text-[#C45B6A] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="py-24 bg-gradient-to-br from-[#1C1412] to-[#3a2925] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #C4A484 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }} />
        <FadeIn className="relative z-10 container mx-auto px-4">
          <span className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-6 animate-pulse">عرض محدود المدى</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">شني كتسناي؟<br/>الكمية قربات تسالي! 🔥</h2>
          <p className="text-gray-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            استفدي دابا من التخفيض. <span className="font-bold text-white">ماتخلصي والو حتى تقلبي سلعتك بيدك!</span> التوصيل فابور لكل المغرب.
          </p>
          <Link href="#products" className="inline-block bg-[#C4A484] text-[#1C1412] px-12 py-5 rounded-2xl font-black text-2xl hover:bg-white transition-all duration-300 shadow-[0_0_40px_rgba(196,164,132,0.4)] hover:scale-105">
            اطلبي دابا بـ 199 درهم
          </Link>
          <p className="mt-8 text-[#C4A484] text-sm font-medium">✅ دفع عند الاستلام &nbsp;&nbsp; 🚚 توصيل فابور &nbsp;&nbsp; 🔒 ضمان الجودة</p>
        </FadeIn>
      </section>

    </div>
  );
}
