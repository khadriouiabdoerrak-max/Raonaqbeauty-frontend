"use client";

import { useEffect, useState } from "react";

const messages = [
  "توصيل مجاني لجميع مدن المغرب — الدفع عند الاستلام",
  "قلبي السلعة قبل ما تخلصي — ما كاين حتى دفع مسبق",
  "رونق · مركز معتمد للجمال CMC",
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdx((current) => (current + 1) % messages.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#1C1412] text-white text-sm py-2.5 text-center font-medium tracking-wide overflow-hidden">
      <div className="container mx-auto px-4 flex items-center justify-center gap-3">
        <span className="animate-pulse text-[#C4A484]">◆</span>
        <span>{messages[idx]}</span>
        <div className="flex gap-1 mr-4">
          {messages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-[#C45B6A] w-4" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
