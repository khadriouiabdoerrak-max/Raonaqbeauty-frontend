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
        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center max-w-2xl">
          <p className="text-[#C4A484] text-3xl font-black mb-4">رونق</p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">من نحن</h1>
          <p className="text-white/75 text-lg leading-relaxed">
            أدوات رونق — نتيجة صالون في المنزل. نتيجة احترافية مع حماية الشعر، وثقة من أول طلب.
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
          <h2 className="text-3xl font-black text-warm-black">الهوية</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            رونق براند مغربي لأدوات تصفيف تحمي الشعر وتعطي نتيجة احترافية: حجم، نعومة، ولمعان —
            بلا ما تحتاجي موعد ولا زيارة صالون.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            كنختارو كل أداة بعناية، وكنخليو الطلب يوصل حتى للدار — تفتحي، تقلبي، وعاد تخلصي. هاد
            الوعد هو أساس الثقة ديالنا.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">{SITE.positioning}</p>
        </div>
      </section>

      <section className="bg-pearl-blush py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-warm-black mb-14">علاش رونق؟</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "نتيجة احترافية",
                desc: "حجم، نعومة، ولمعان كيبانو — بنفس الإحساس اللي كتقلّبي عليه من الصالون، فدارك.",
              },
              {
                title: "حماية للشعر",
                desc: "ماشي غير تصفيف. كنختارو أدوات كتخدم بذكاء مع الشعر المغربي وبلا ما تضعّفو.",
              },
              {
                title: "ثقة بلا لف",
                desc: "الدفع عند الاستلام مش خيار ثانوي — هو وعد: ما تخلصي حتى تشوفي السلعة.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-white p-8 text-right border border-champagne/20">
                <h3 className="font-black text-xl mb-3 text-warm-black">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center container mx-auto px-4">
        <p className="text-champagne text-xl font-black mb-2">رونق</p>
        <h2 className="text-2xl font-black text-warm-black mb-6">جرّبي الفرق بنفسك</h2>
        <Link
          href="/collection"
          className="inline-block bg-rosewood text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-rosewood-deep transition-colors"
        >
          شوفي المجموعة
        </Link>
      </section>
    </div>
  );
}
