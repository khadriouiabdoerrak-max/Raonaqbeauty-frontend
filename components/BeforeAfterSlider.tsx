"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  afterSrc?: string;
  beforeSrc?: string;
  className?: string;
};

type Gesture = "idle" | "pending" | "drag" | "scroll";

export default function BeforeAfterSlider({
  afterSrc = "/images/raonaq-result-after.webp",
  beforeSrc = "/images/raonaq-result-before.webp",
  className = "",
}: Props) {
  const [pos, setPos] = useState(84);
  const [held, setHeld] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const gesture = useRef<Gesture>("idle");
  const startX = useRef(0);
  const startY = useRef(0);
  const pointerId = useRef<number | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setFromX = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(88, Math.max(12, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const clearResume = () => {
    if (resumeTimer.current != null) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  };

  const endDrag = useCallback(() => {
    if (gesture.current !== "drag" && gesture.current !== "pending") {
      gesture.current = "idle";
      pointerId.current = null;
      return;
    }
    const wasDrag = gesture.current === "drag";
    gesture.current = "idle";
    pointerId.current = null;
    if (!wasDrag) return;
    clearResume();
    resumeTimer.current = setTimeout(() => setHeld(false), 2500);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (pointerId.current != null && e.pointerId !== pointerId.current) return;

      if (gesture.current === "pending") {
        const dx = e.clientX - startX.current;
        const dy = e.clientY - startY.current;
        const ax = Math.abs(dx);
        const ay = Math.abs(dy);
        if (ax < 8 && ay < 8) return;
        // Vertical intent → leave the page scroll alone
        if (ay >= ax) {
          gesture.current = "scroll";
          return;
        }
        gesture.current = "drag";
        clearResume();
        setHeld(true);
        const el = box.current;
        if (el && pointerId.current != null) {
          try {
            el.setPointerCapture(pointerId.current);
          } catch {
            /* ignore */
          }
        }
        setFromX(e.clientX);
        return;
      }

      if (gesture.current === "drag") {
        setFromX(e.clientX);
      }
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId.current != null && e.pointerId !== pointerId.current) return;
      endDrag();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      clearResume();
    };
  }, [endDrag, setFromX]);

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Après et avant"
      aria-valuemin={12}
      aria-valuemax={88}
      aria-valuenow={Math.round(pos)}
      className={`relative aspect-[4/5] cursor-ew-resize select-none overflow-hidden bg-[#F7F1EC] outline-none touch-pan-y ${className}`}
      onPointerDown={(e) => {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        gesture.current = "pending";
        pointerId.current = e.pointerId;
        startX.current = e.clientX;
        startY.current = e.clientY;
      }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        clearResume();
        setHeld(true);
        setPos((current) => Math.min(88, Math.max(12, current + (e.key === "ArrowRight" ? 5 : -5))));
        resumeTimer.current = setTimeout(() => setHeld(false), 2500);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={beforeSrc} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover" />
      <div
        className={`pointer-events-none absolute inset-0 ${held ? "" : "raonaq-ba-reveal"}`}
        style={held ? { clipPath: `inset(0 ${100 - pos}% 0 0)` } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterSrc} alt="" draggable={false} className="h-full w-full max-w-none object-cover" />
      </div>

      <div
        className={`pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90 ${held ? "" : "raonaq-ba-line"}`}
        style={held ? { left: `${pos}%` } : undefined}
      />
      <div
        className={`pointer-events-none absolute top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white text-[#C45B6A] shadow-[0_6px_20px_rgba(28,20,18,0.16)] ${held ? "" : "raonaq-ba-line"}`}
        style={held ? { left: `${pos}%` } : undefined}
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
