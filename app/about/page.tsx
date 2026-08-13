import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "../../lib/site";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "رونق براند مغربي لنتيجة صالون فدارك. أدوات مختارة للحجم والنعومة واللمعان، مع حماية الشعر، وثقة من الباب: تقلبي عاد تخلصي.",
};

const principles = [
  {
    n: "01",
    title: "مجموعة قصيرة",
    text: "ما كنبيعوش كتالوج. كل أداة داخلة لأن عندها دور واضح: حجم، نعومة، لمعان، أو طقم كامل.",
  },
  {
    n: "02",
    title: "نتيجة قبل الموديل",
    text: "الزبونة كتشري شنو غادي يبان فشعرها، ماشي رقم تقني. لذلك الوعود بالدارجة، والنتيجة هي البطلة.",
  },
  {
    n: "03",
    title: "حماية الشعر",
    text: "الحرارة بلا حماية كتضر. كنختارو أدوات كتخدم بذكاء — باش التصفيف يبقى يومي، ماشي مرة وتندمي.",
  },
  {
    n: "04",
    title: "ثقة من الباب",
    text: "فالمغرب، الثقة كتتبنى فاليد. الطلب كيوصل، كتفتحي، كتقلبي، وعاد كتخلصي. بلا دفع مسبق.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F7F1EC]" dir="rtl">
      <section className="relative min-h-[72vh] overflow-hidden bg-[#1C1412] text-white md:min-h-[85vh]">
        <img
          src="/images/raonaq-lifestyle-home.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/55 to-[#1C1412]/30" />
        <div className="relative flex min-h-[72vh] items-end md:min-h-[85vh]">
          <div className="container mx-auto max-w-4xl px-4 pb-16 pt-28 md:pb-24 md:pt-40">
            <p className="text-[11px] font-black tracking-[0.42em] text-[#C4A484]">RAONAQ · المغرب</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.12] md:text-6xl">
              براند مغربي.
              <br />
              نتيجة صالون فدارك.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/72 md:text-lg">
              رونق اتولدات من حاجة بسيطة: الزبونة المغربية باغية شعر مرتب، لامع، وحاضر — بلا موعد، بلا صالون، وبلا ما تخلصي قبل ما تشوفي السلعة.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto grid items-center gap-12 px-4 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <div className="overflow-hidden bg-[#F7F1EC]">
            <img
              src="/images/raonaq-salon-results.png"
              alt="نتيجة رونق على الشعر"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>
          <div className="max-w-lg">
            <p className="text-[11px] font-black tracking-[0.28em] text-[#C45B6A]">القصة</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#1C1412] md:text-4xl">
              ماشي براند مستورد كيتكلم من بعيد
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-[#1C1412]/65">
              بزاف ديال البنات كيشريو أداة… وعاد كيلقاو راسهم محتاجين وحدة أخرى، ولا كيخافو يخلّصو قبل ما يشوفو شنو جاهم. السوق عامر، والثقة قليلة.
            </p>
            <p className="mt-4 text-[15px] leading-8 text-[#1C1412]/65">
              رونق جا من الدار البيضاء باش يقصّر الطريق: أدوات قليلة، كل وحدة عندها نتيجة، والتوصيل حتى لباب الدار. تقلبي قدام الليفور. عاد تخلصي.
            </p>
            <p className="mt-8 border-r-2 border-[#C4A484] pr-5 text-lg font-black leading-relaxed text-[#1C1412]">
              «تفتحي · تقلبي · عاد تخلصي»
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#C4A484]/20 bg-[#F7F1EC]">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-xl">
            <p className="text-[11px] font-black tracking-[0.28em] text-[#C45B6A]">المنهج</p>
            <h2 className="mt-3 text-3xl font-black text-[#1C1412] md:text-4xl">
              كيفاش كنبنو رونق
            </h2>
          </div>
          <ol className="mt-12 grid gap-px bg-[#C4A484]/20 sm:grid-cols-2">
            {principles.map((item) => (
              <li key={item.n} className="bg-[#F7F1EC] p-8 md:p-10">
                <p className="text-[11px] font-black tracking-[0.28em] text-[#C4A484]">{item.n}</p>
                <h3 className="mt-4 text-xl font-black text-[#1C1412]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#1C1412]/60">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#1C1412] text-white">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="text-[11px] font-black tracking-[0.28em] text-[#C4A484]">من المغرب</p>
            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              الدار البيضاء،
              <br />
              والتوصيل للمغرب كامل
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-8 text-white/60">
              الطلب كيتأكّد بالهاتف، كيتجهّز، وكيوصل غالباً بين 24 و 48 ساعة. التوصيل مجاني. ما كاين حتى دفع مسبق — الليفور كيستنى حتى تتأكدي.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { k: "مجاني", v: "التوصيل" },
              { k: "24–48س", v: "غالباً التوصيل" },
              { k: "عند الباب", v: "القلب والدفع" },
            ].map((stat) => (
              <div key={stat.v} className="border border-white/10 px-5 py-6 text-center">
                <p className="text-2xl font-black text-[#C4A484]">{stat.k}</p>
                <p className="mt-2 text-xs font-bold text-white/50">{stat.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto max-w-2xl px-4 py-20 text-center md:py-24">
          <p className="text-[11px] font-black tracking-[0.42em] text-[#C4A484]">RAONAQ</p>
          <h2 className="mt-4 text-3xl font-black text-[#1C1412] md:text-4xl">
            اختاري الأداة اللي كتشبه شعرك
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#1C1412]/55">
            {SITE.tagline}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/collection" className="btn btn-primary btn-lg">
              شوفي المجموعة
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              تواصلي معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
