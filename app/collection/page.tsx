"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { products, productThumb, type Product } from "../../lib/products";

const trustBadges = ["توصيل مجاني", "الدفع عند الاستلام", "قلبي السلعة عاد خلصي"];

function addProductToCart(
  product: Product,
  quantity: 1 | 2,
  addToCart: ReturnType<typeof useCart>["addToCart"],
) {
  addToCart({
    id: product.id,
    name: product.name,
    price: quantity === 2 ? product.price2 / 2 : product.price1,
    quantity,
    image: productThumb(product),
  });
}

export default function CollectionPage() {
  const { addToCart } = useCart();
  const list = products;

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <section className="bg-[#1C1412] text-white">
        <div className="container mx-auto px-4 py-8 text-right md:py-20">
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div>
              <h1 className="max-w-3xl text-[1.85rem] font-black leading-tight md:text-6xl">
                نتيجة صالون فدارك، ببراند مغربي واضح
              </h1>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/72 md:text-lg">
                رونق مختصة فـ أدوات الشعر: حجم، نعومة، ولمعان مع حماية. اختاري المنتج اللي يناسب شعرك، وطلبي بثقة: كتقلبي السلعة عاد كتخلصي.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-black md:mt-6 md:text-xs">
                {trustBadges.map((badge) => (
                  <span key={badge} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur md:px-4">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/10 bg-[#F7F1EC] shadow-[0_30px_90px_rgba(0,0,0,0.32)] sm:aspect-[16/10] md:rounded-[34px] lg:aspect-[4/5]">
                <img
                  src="/images/raonaq-lifestyle-home.png"
                  alt="رونق — نتيجة صالون فدارك"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/72 via-[#1C1412]/10 to-transparent" />
                <div className="absolute inset-x-3 bottom-3 rounded-[20px] bg-white/92 p-3 text-right text-[#1C1412] shadow-xl backdrop-blur md:inset-x-4 md:bottom-4 md:rounded-[24px] md:p-4" dir="rtl">
                  <p className="text-[10px] font-black tracking-[0.16em] text-[#C45B6A] md:text-[11px]">RAONAQ PROMISE</p>
                  <p className="mt-1 text-lg font-black md:text-xl">تفتحي · تشوفي · عاد تخلصي</p>
                  <p className="mt-1 text-xs font-bold text-[#1C1412]/58">توصيل مجاني للمغرب + تأكيد الطلب بالهاتف</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-white md:absolute md:-bottom-5 md:left-6 md:right-6 md:mt-0">
                <div className="rounded-2xl border border-white/12 bg-white/12 px-3 py-3 backdrop-blur">حجم</div>
                <div className="rounded-2xl border border-white/12 bg-white/12 px-3 py-3 backdrop-blur">نعومة</div>
                <div className="rounded-2xl border border-white/12 bg-white/12 px-3 py-3 backdrop-blur">لمعان</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-7 text-center md:mb-10">
            <p className="text-xs font-black tracking-[0.22em] text-[#C45B6A] md:text-sm md:tracking-[0.25em]">المنتجات</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#1C1412] md:text-5xl">المنتجات ديال رونق</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#1C1412]/62 md:mt-4 md:text-lg">
              كل منتج بصورة واضحة، شرح صغير، والثمن. التفاصيل الكاملة كتلقايها ملي تكليكي على المنتج.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {list.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#C4A484]/25 bg-white shadow-[0_18px_55px_rgba(28,20,18,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(28,20,18,0.12)]"
              >
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#F7F1EC] to-white">
                    {product.tag && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-[#1C1412] px-3 py-1.5 text-[10px] font-black text-white shadow-lg">
                        {product.tag}
                      </span>
                    )}
                    <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#C45B6A] shadow-lg backdrop-blur">
                      {product.price1} د.م
                    </span>
                    <img
                    src={product.heroImage}
                    alt={product.name}
                      className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105 ${
                        product.heroImage.includes("-tool") || product.heroImage.includes("-box")
                          ? "object-contain p-6"
                          : product.slug === "raonaq-duo"
                            ? "object-cover object-center"
                            : "object-cover"
                      }`}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-4 text-right md:p-5" dir="rtl">
                  <div>
                    <p className="text-[11px] font-black tracking-wide text-[#C45B6A]">{product.bestFor}</p>
                    <Link href={`/products/${product.slug}`} className="block">
                      <h2 className="mt-1 text-2xl font-black leading-tight text-[#1C1412]">{product.name}</h2>
                      <p className="mt-2 text-sm font-black text-[#1C1412]/80">{product.tagline}</p>
                      <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-[#1C1412]/58">{product.cardCopy}</p>
                    </Link>

                    <div className="mt-4 grid gap-2 rounded-2xl bg-[#F7F1EC] p-3 text-xs font-bold text-[#1C1412]/72">
                      <p>✓ توصيل مجاني حتى لباب الدار</p>
                      <p>✓ قلبي السلعة عاد خلصي</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <button
                      onClick={() => addProductToCart(product, 1, addToCart)}
                      className="btn btn-secondary btn-block justify-between gap-3 px-4 py-3 text-right md:px-5"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-[#1C1412]">اطلبي قطعة دابا</span>
                        <span className="block text-[10px] font-bold text-[#1C1412]/55">تأكيد بالهاتف + دفع عند الاستلام</span>
                      </span>
                      <span className="shrink-0 text-lg font-black text-[#C45B6A]">{product.price1} د.م</span>
                    </button>
                    <button
                      onClick={() => addProductToCart(product, 2, addToCart)}
                      className="btn btn-dark btn-block justify-between gap-3 px-4 py-3 text-right md:px-5"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-black">خدي جوج ووفري</span>
                        <span className="block text-[10px] font-bold text-white/65">
                          عرض العائلة أو الهدية · وفري {product.price1 * 2 - product.price2} درهم
                        </span>
                      </span>
                      <span className="shrink-0 text-lg font-black">{product.price2} د.م</span>
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block rounded-full bg-[#F7F1EC] px-4 py-3 text-center text-xs font-black text-[#C45B6A] hover:text-[#1C1412]"
                    >
                      شوفي تفاصيل المنتج وطريقة الاستعمال
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
