"use client";

import { useEffect, useState } from "react";

const messages = [
  "Raonaq — le salon, chez vous",
  "Volume · lisse · brillance, avec protection",
  "Ouvrez, inspectez, puis payez — livraison gratuite au Maroc",
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
    <div className="overflow-hidden bg-warm-black py-2.5 text-center text-sm font-medium tracking-wide text-white">
      <div className="container mx-auto flex items-center justify-center gap-3 px-4">
        <span className="text-champagne">◆</span>
        <span>{messages[idx]}</span>
      </div>
    </div>
  );
}
