import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "رونق — بيت مغربي لنتيجة صالون فدارك. مجموعة قصيرة للحجم والنعومة واللمعان، مع حماية الشعر، وثقة من الباب.",
};

const stills = [
  { src: "/images/raonaq-hair-blowout.png", alt: "حجم من الجذور" },
  { src: "/images/raonaq-hair-straight.png", alt: "نعومة ولمعان" },
  { src: "/images/raonaq-hair-curls.png", alt: "كثافة مرتّبة" },
] as const;

export default function AboutPage() {
  return (
    <div className="bg-[#F7F1EC]" dir="rtl">
      {/* مجلة — الصورة كاملة، النص فجنب، بلا طبقة كحلة */}
      <section className="bg-[#F7F1EC]">
        <div className="grid min-h-[calc(100svh-7.5rem)] lg:grid-cols-2">
          <div className="relative min-h-[70vw] overflow-hidden bg-[#E8DFD6] sm:min-h-[420px] lg:min-h-full">
            <img
              src="/images/raonaq-salon-results.png"
              alt="نتيجة رونق على الشعر"
              className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
            />
          </div>

          <div className="flex items-center bg-[#F7F1EC]">
            <div className="mx-auto w-full max-w-lg px-6 py-16 md:px-14 md:py-24 lg:py-28">
              <p className="text-[11px] font-medium tracking-[0.38em] text-[#C4A484]">RAONAQ</p>
              <h1 className="mt-6 text-[2.75rem] font-black leading-[1.05] text-[#1C1412] md:text-6xl lg:text-7xl">
                رونق
              </h1>
              <p className="mt-6 max-w-sm text-xl font-black leading-snug text-[#1C1412] md:text-2xl">
                النتيجة ما خاصهاش موعد.
              </p>
              <span className="mt-8 block h-px w-16 bg-[#C4A484]" />
              <p className="mt-8 max-w-md text-[15px] font-medium leading-8 text-[#1C1412]/62">
                حجم، نعومة، لمعان — فدارك، مع حماية الشعر. مجموعة قصيرة لأن المعيار عالي. كل أداة داخلة للبيت عندها دور. الباقي ما كيدخلش.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* بيان البيت — مساحة، جملة وحدة، بلا شرح طويل */}
      <section className="bg-white">
        <div className="container mx-auto max-w-3xl px-6 py-24 text-center md:py-36">
          <p className="text-[11px] font-medium tracking-[0.38em] text-[#C4A484]">البيان</p>
          <blockquote className="mt-8 text-3xl font-black leading-[1.25] text-[#1C1412] md:text-5xl md:leading-[1.2]">
            الشعر هو أول حضور.
            <br />
            ما خاصوش يستنى موعد.
          </blockquote>
          <p className="mx-auto mt-10 max-w-lg text-[15px] font-medium leading-8 text-[#1C1412]/58">
            الصالون كيعطي نتيجة. الدار خاصها تعطي نفس الحضور — بلا انتظار. رونق اتبنات على هاد الفكرة، من الدار البيضاء، للمرأة اللي باغية تبان جاهزة من بيتها.
          </p>
        </div>
      </section>

      {/* لوكبوك — الشعر هو البطلة، ماشي الكتالوج */}
      <section className="bg-[#F7F1EC] px-3 py-3 md:px-4 md:py-4">
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:min-h-[720px]">
            <img
              src={stills[0].src}
              alt={stills[0].alt}
              className="h-full w-full object-cover object-[center_20%]"
            />
            <p className="absolute bottom-5 right-5 text-[11px] font-medium tracking-[0.28em] text-white">
              VOLUME
            </p>
          </div>
          <div className="grid gap-3 md:gap-4">
            {stills.slice(1).map((still) => (
              <div key={still.src} className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[350px]">
                <img
                  src={still.src}
                  alt={still.alt}
                  className="h-full w-full object-cover object-[center_22%]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المعيار — اختيار، ماشي مبادئ مرقّمة */}
      <section className="bg-white">
        <div className="container mx-auto grid items-center gap-12 px-6 py-20 md:gap-20 md:py-32 lg:grid-cols-2">
          <div className="order-2 max-w-md lg:order-1">
            <p className="text-[11px] font-medium tracking-[0.38em] text-[#C4A484]">المعيار</p>
            <h2 className="mt-5 text-3xl font-black leading-tight text-[#1C1412] md:text-5xl">
              ما كنزيدوش.
              <br />
              كنختارو.
            </h2>
            <p className="mt-6 text-[15px] font-medium leading-8 text-[#1C1412]/60">
              الكتالوج الطويل كيضعّف العين. حنا كنخليو غير اللي كتحمي الشعر وكتعطي حضور من أول استعمال: حجم، نعومة، لمعان، أو طقم كامل.
            </p>
            <ul className="mt-10 space-y-5">
              {[
                { t: "النتيجة قبل الموديل", d: "الزبونة كتشري شنو غادي يبان، ماشي رقم تقني." },
                { t: "حماية فالتصفيف", d: "الحرارة بلا عقل كتضر. الأداة خاصها تخدم بذكاء." },
                { t: "الاحترام فاليد", d: "التفتحي، تقلبي، عاد تخلصي. هادشي أدب البيت." },
              ].map((line) => (
                <li key={line.t} className="border-r border-[#C4A484]/50 pr-5">
                  <p className="text-sm font-black text-[#1C1412]">{line.t}</p>
                  <p className="mt-1 text-sm font-medium leading-7 text-[#1C1412]/50">{line.d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 overflow-hidden bg-[#F7F1EC] lg:order-2">
            <img
              src="/images/raonaq-tools-editorial.png"
              alt="أدوات رونق"
              className="aspect-[4/5] h-full w-full object-cover object-[center_30%] md:aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* الأصل — الصورة كتبان، ماشي مغسولة بالأسود */}
      <section className="relative min-h-[78vh] overflow-hidden bg-[#1C1412] md:min-h-[88vh]">
        <img
          src="/images/raonaq-lifestyle-home.png"
          alt="رونق فدارك"
          className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/15 to-transparent" />
        <div className="relative flex min-h-[78vh] items-end md:min-h-[88vh]">
          <div className="container mx-auto px-6 pb-12 md:pb-16">
            <p className="text-[11px] font-medium tracking-[0.38em] text-[#C4A484]">CASABLANCA</p>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight text-white md:text-5xl">
              من الدار البيضاء،
              <br />
              للمغرب كامل.
            </h2>
          </div>
        </div>
      </section>

      {/* طقس الباب — سطر واحد، بلا علب إحصائيات */}
      <section className="bg-[#F7F1EC]">
        <div className="container mx-auto max-w-2xl px-6 py-24 text-center md:py-32">
          <span className="mx-auto block h-px w-12 bg-[#C4A484]" />
          <p className="mt-10 text-2xl font-black leading-snug text-[#1C1412] md:text-4xl">
            تفتحي · تقلبي · عاد تخلصي
          </p>
          <p className="mx-auto mt-6 max-w-md text-[15px] font-medium leading-8 text-[#1C1412]/55">
            الطلب كيوصل لباب الدار. كتشوفي السلعة. عاد كتخالسي. الاحترام كيتبنى فاليد — ماشي فالكرت.
          </p>
          <span className="mx-auto mt-10 block h-px w-12 bg-[#C4A484]" />
        </div>
      </section>

      {/* خاتمة هادئة — زر واحد */}
      <section className="bg-white">
        <div className="container mx-auto max-w-xl px-6 py-24 text-center md:py-32">
          <h2 className="text-3xl font-black leading-tight text-[#1C1412] md:text-5xl">
            اختاري حضورك.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-[15px] font-medium leading-8 text-[#1C1412]/50">
            أربعة نتائج. نفس المعيار. الأداة اللي كتشبه شعرك.
          </p>
          <Link
            href="/collection"
            className="btn btn-primary btn-lg mt-10 min-w-[220px]"
          >
            شوفي المجموعة
          </Link>
        </div>
      </section>
    </div>
  );
}
