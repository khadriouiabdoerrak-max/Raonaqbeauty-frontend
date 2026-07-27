import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <div className="bg-[#F7F1EC] py-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#C45B6A] text-white flex items-center justify-center font-bold text-2xl">R</div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1C1412]">من نحن</h1>
        </div>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          القصة وراء رونق بيوتي — المركز المعتمد (CMC) لمنتجات العناية بالشعر في المغرب
        </p>
      </div>

      {/* Story Section */}
      <section className="py-20 container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
        <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80"
            alt="Raonaq Beauty Story"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-[#1C1412]">قصتنا</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            وُلدت رونق بيوتي من شغف حقيقي بجمال المرأة المغربية. رأينا كيف أن النساء في المغرب يستحققن أفضل أدوات التصفيف الاحترافية، لكن بأسعار في متناول الجميع وبدون مخاطرة.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            لهذا قررنا أن نجمع بين الجودة العالمية والأسعار المنصفة، مع ضمان الدفع عند الاستلام حتى تكوني مطمئنة 100% قبل أن تدفعي أي درهم.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            اليوم، يثق بنا أكثر من 1200 عميلة في جميع أنحاء المغرب، وحصلنا على اعتماد المركز المعتمد للتسويق (CMC) ليؤكد التزامنا بالجودة والمصداقية.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F7F1EC] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-[#1C1412] mb-14">قيمنا</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "💎", title: "الجودة أولاً", desc: "نختار كل منتج بعناية شديدة للتأكد من أنه يلبي معايير الجودة العالمية." },
              { icon: "🤝", title: "الثقة والشفافية", desc: "الدفع عند الاستلام ليس مجرد خيار، بل هو وعد منا بأنك لن تخسري شيئاً." },
              { icon: "❤️", title: "العميلة في قلبنا", desc: "كل قرار نتخذه يبدأ ببسيط: ما الذي يجعل عميلتنا أكثر سعادة؟" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center container mx-auto px-4">
        <h2 className="text-2xl font-black text-[#1C1412] mb-6">جربي الفرق بنفسك</h2>
        <Link href="/collection" className="bg-[#C45B6A] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#a64d5a] transition-colors">
          تسوقي الآن
        </Link>
      </section>
    </div>
  );
}
