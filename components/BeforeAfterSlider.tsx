"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export default function BeforeAfterSlider({
  src,
  beforeLabel = "Avant",
  afterLabel = "Après",
  className = "",
}: Props) {
  const [pos, setPos] = useState(58);
  const [hint, setHint] = useState(true);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const used = useRef(false);

  const setFromX = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(92, Math.max(8, next)));
  }, []);

  const takeOver = useCallback(
    (clientX: number) => {
      used.current = true;
      setHint(false);
      setFromX(clientX);
    },
    [setFromX],
  );

  useEffect(() => {
    let dir = -1;
    const timer = window.setInterval(() => {
      if (used.current) return;
      setPos((current) => {
        const next = current + dir * 0.35;
        if (next < 38) dir = 1;
        if (next > 68) dir = -1;
        return next;
      });
    }, 40);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Avant et après"
      aria-valuemin={8}
      aria-valuemax={92}
      aria-valuenow={Math.round(pos)}
      className={`relative aspect-[4/5] cursor-ew-resize touch-none select-none overflow-hidden bg-[#F7F1EC] outline-none md:aspect-[5/4] ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        takeOver(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        takeOver(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        used.current = true;
        setHint(false);
        setPos((current) => Math.min(92, Math.max(8, current + (e.key === "ArrowRight" ? 5 : -5))));
      }}
    >
      <img
        src={src}
        alt={beforeLabel}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[100%_center]"
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={src}
          alt={afterLabel}
          draggable={false}
          className="absolute inset-y-0 left-0 h-full max-w-none object-cover object-left"
          style={{ width: `${(100 / pos) * 100}%` }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]"
        style={{ left: `${pos}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white text-[#C45B6A] shadow-2xl"
        style={{ left: `${pos}%` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75 4.5 12l3.75 2.25m7.5-4.5L19.5 12l-3.75 2.25" />
        </svg>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 z-20 min-w-[4.5rem] bg-white px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-[#C45B6A]">
        {afterLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-20 min-w-[4.5rem] bg-[#1C1412]/80 px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-white">
        {beforeLabel}
      </span>

      {hint && (
        <p className="pointer-events-none absolute inset-x-0 bottom-12 z-20 text-center">
          <span className="bg-[#1C1412]/50 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
            Glissez pour voir
          </span>
        </p>
      )}
    </div>
  );
}
