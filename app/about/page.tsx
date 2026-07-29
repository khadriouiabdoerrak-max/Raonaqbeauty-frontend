import Link from "next/link";
import { SITE } from "../../lib/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen" dir="rtl">
      <div className="relative overflow-hidden bg-[#1C1412] text-white">
        <img
          src="/images/raonaq-hero-branded.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[center_25%] opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/70 to-[#1C1412]/40" />
        <div className="relative container mx-auto max-w-3xl px-4 py-24 text-right md:py-32">
          <p className="mb-4 text-sm font-black tracking-[0.28em] text-[#C4A484]">رونق · Raonaq</p>
          <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
            براند مغربي لنتيجة صالون فدارك
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/78">
            رونق ماشي كتالوج عشوائي. كنختارو أدوات قليلة وواضحة، كل وحدة عندها دور: حجم، نعومة، لمعان، وحماية للشعر — باش تديري نتيجة مرتبة فدارك وبثقة.
          </p>
        </div>
      </div>

      <section className="py-20 container mx-auto px-4 grid md:grid-cols-2 gap-14 items-center">
        <div className="overflow-hidden aspect-[4/5] bg-pearl-blush">
          <img
            src="/images/raonaq-salon-results.png"
            alt="مجموعة رونق"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <p className="text-sm font-black tracking-[0.24em] text-rosewood">علاش بدات رونق؟</p>
          <h2 className="text-3xl font-black leading-tight text-warm-black md:text-4xl">
            لأن الزبونة المغربية خاصها نتيجة زوينة بلا مخاطرة
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            بزاف ديال البنات كيبغيو شعر مرتب بحال الصالون، ولكن بلا موعد، بلا تنقل، وبلا ما يشريو أدوات كثيرة ما معروفاش. رونق جا باش يبسط الاختيار: أدوات مختارة، وعد واضح، وتجربة شراء فيها الثقة.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            كنخليو الطلب يوصل حتى للدار — تفتحي، تقلبي، وتشوفي السلعة بيدك، عاد تخلصي. الثقة عندنا ماشي جملة فالإعلان، هي جزء من طريقة البيع.
          </p>
          <div className="border-r-4 border-rosewood bg-pearl-blush p-5 text-warm-black">
            <p className="font-black">وعد رونق:</p>
            <p className="mt-2 leading-relaxed text-warm-black/70">{SITE.positioning}</p>
          </div>
        </div>
      </section>

      <section className="bg-pearl-blush py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-black tracking-[0.24em] text-rosewood">الثقة قبل البيع</p>
            <h2 className="mt-3 text-3xl font-black text-warm-black md:text-4xl">علاش رونق كتقدر تكون اختيارك الأول؟</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "اختيار قليل وواضح",
                desc: "ما كنغرقوكش بمنتجات كثيرة. كل أداة عندها نتيجة مفهومة: حجم، نعومة، ترتيب، أو طقم كامل.",
              },
              {
                title: "نتيجة كتبيع راسها",
                desc: "الهدف ماشي غير تسخين الشعر؛ الهدف شعر يبان مرتب، لامع، وحاضر من أول استعمال.",
              },
              {
                title: "شراء بلا خوف",
                desc: "توصيل للدار، تفقدي السلعة، عاد خلصي. هادي هي الثقة اللي كتخلي أول طلب ساهل.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-white p-8 text-right border border-champagne/20 shadow-[0_18px_50px_rgba(28,20,18,0.06)]">
                <h3 className="font-black text-xl mb-3 text-warm-black">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center container mx-auto px-4">
        <p className="text-champagne text-xl font-black mb-2">رونق</p>
        <h2 className="text-2xl font-black text-warm-black mb-3">بداي بالأداة اللي كتشبه شعرك</h2>
        <p className="mx-auto mb-7 max-w-md text-warm-black/60">
          شوفي المجموعة، اختاري النتيجة اللي بغيتي، والطلب كيوصل حتى للدار.
        </p>
        <Link
          href="/collection"
          className="inline-block rounded-full bg-rosewood text-white px-10 py-4 font-black text-lg shadow-[0_14px_36px_rgba(196,91,106,0.28)] hover:bg-rosewood-deep transition-colors"
        >
          شوفي المجموعة
        </Link>
      </section>
    </div>
  );
}
