"use client";

import { useEffect, useState } from "react";

const messages = [
  "أدوات رونق — نتيجة صالون في المنزل",
  "نتيجة احترافية مع حماية الشعر — حجم، نعومة، ولمعان",
  "قلبي السلعة قبل ما تخلصي — توصيل مجاني لكل المغرب",
];

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIdx((current) => (current + 1) % messages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-warm-black text-white text-sm py-2.5 text-center font-medium tracking-wide overflow-hidden">
      <div className="container mx-auto px-4 flex items-center justify-center gap-3">
        <span className="text-champagne">◆</span>
        <span>{messages[idx]}</span>
      </div>
    </div>
  );
}
