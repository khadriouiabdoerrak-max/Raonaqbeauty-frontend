"use client";

import { useRef, useState, useCallback } from "react";

type Props = {
  src: string;               // نفس الصورة كاتستعمل للطرفين
  beforeLabel?: string;
  afterLabel?: string;
  beforeFilter?: string;     // CSS filter للجهة "قبل"
};

export default function BeforeAfterSlider({
  src,
  beforeLabel = "قبل",
  afterLabel = "بعد",
  beforeFilter = "grayscale(80%) brightness(0.85) contrast(0.9) blur(1.2px)",
}: Props) {
  const [pos, setPos] = useState(45); // تبدأ من اليمين (قبل) أكبر
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-3xl shadow-2xl cursor-ew-resize select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onMouseMove={(e) => { if (dragging.current) move(e.clientX); }}
      onTouchMove={(e) => { e.preventDefault(); move(e.touches[0].clientX); }}
      onTouchStart={(e) => move(e.touches[0].clientX)}
    >
      {/* AFTER side — full color (underneath, full width) */}
      <img
        src={src}
        alt={afterLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
      />

      {/* BEFORE side — filtered (clipped from right) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ right: `${100 - pos}%`, left: 0 }}
      >
        <img
          src={src}
          alt={beforeLabel}
          draggable={false}
          className="absolute inset-0 h-full object-cover object-top"
          style={{
            width: `${(100 / pos) * 100}%`,
            maxWidth: "none",
            filter: beforeFilter,
          }}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_12px_3px_rgba(255,255,255,0.6)] pointer-events-none"
        style={{ left: `${pos}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-white/80 z-10 transition-transform hover:scale-110"
        style={{ left: `${pos}%` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#C45B6A" strokeWidth={2.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
        </svg>
      </div>

      {/* Labels */}
      <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
        {beforeLabel}
      </div>
      <div className="absolute top-5 left-5 flex items-center gap-2 bg-[#C45B6A]/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse" />
        {afterLabel}
      </div>

      {/* Instruction hint (fades after use) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80 text-xs font-medium bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full pointer-events-none">
        ← زلقي بصباعك لتشوفي الفرق →
      </div>
    </div>
  );
}
