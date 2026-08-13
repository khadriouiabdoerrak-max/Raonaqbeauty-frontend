"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  afterSrc?: string;
  beforeSrc?: string;
  className?: string;
};

export default function BeforeAfterSlider({
  afterSrc = "/images/raonaq-result-after.png",
  beforeSrc = "/images/raonaq-result-before.png",
  className = "",
}: Props) {
  const [pos, setPos] = useState(84);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const paused = useRef(false);
  const resumeTimer = useRef(0);

  const setFromX = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(88, Math.max(12, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const pauseAt = useCallback(
    (clientX: number) => {
      paused.current = true;
      window.clearTimeout(resumeTimer.current);
      setFromX(clientX);
    },
    [setFromX],
  );

  const release = useCallback(() => {
    dragging.current = false;
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      paused.current = false;
    }, 1200);
  }, []);

  useEffect(() => {
    let dir = -1;
    const timer = window.setInterval(() => {
      if (paused.current || dragging.current) return;
      setPos((current) => {
        const next = current + dir * 0.38;
        if (next <= 16) dir = 1;
        if (next >= 84) dir = -1;
        return next;
      });
    }, 28);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Après et avant"
      aria-valuemin={12}
      aria-valuemax={88}
      aria-valuenow={Math.round(pos)}
      className={`relative aspect-[4/5] cursor-ew-resize touch-none select-none overflow-hidden bg-[#F7F1EC] outline-none ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        pauseAt(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        pauseAt(e.clientX);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        paused.current = true;
        setPos((current) => Math.min(88, Math.max(12, current + (e.key === "ArrowRight" ? 5 : -5))));
        release();
      }}
    >
      <img src={beforeSrc} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={afterSrc}
          alt=""
          draggable={false}
          className="absolute inset-y-0 left-0 h-full max-w-none object-cover"
          style={{ width: `${(100 / pos) * 100}%` }}
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90" style={{ left: `${pos}%` }} />
      <div
        className="pointer-events-none absolute top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white text-[#C45B6A] shadow-[0_6px_20px_rgba(28,20,18,0.16)]"
        style={{ left: `${pos}%` }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75 4.5 12l3.75 2.25m7.5-4.5L19.5 12l-3.75 2.25" />
        </svg>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 z-20 text-[9px] font-medium uppercase tracking-[0.22em] text-white drop-shadow-[0_1px_3px_rgba(28,20,18,0.55)]">
        Après
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-20 text-[9px] font-medium uppercase tracking-[0.22em] text-white drop-shadow-[0_1px_3px_rgba(28,20,18,0.55)]">
        Avant
      </span>
    </div>
  );
}
