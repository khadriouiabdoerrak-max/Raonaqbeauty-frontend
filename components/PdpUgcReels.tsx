"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PDP_UGC_REELS, type UgcReel } from "../lib/ugcReels";

function LocalVideo({
  reel,
  active,
}: {
  reel: UgcReel;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showPauseHint, setShowPauseHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.pause();
      setPlaying(false);
      setShowPauseHint(false);
    }
  }, [active]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      setShowPauseHint(false);
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  const ensureSrc = () => {
    const v = ref.current;
    if (!v) return null;
    if (!v.getAttribute("src")) {
      v.src = reel.videoSrc;
      v.load();
    }
    return v;
  };

  const togglePlay = () => {
    const v = ensureSrc();
    if (!v) return;
    if (v.paused) {
      v.muted = muted;
      void v.play();
      setShowPauseHint(true);
      if (hintTimer.current) clearTimeout(hintTimer.current);
      hintTimer.current = setTimeout(() => setShowPauseHint(false), 1400);
    } else {
      v.pause();
    }
  };

  const toggleMute = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const v = ref.current;
    const next = !muted;
    setMuted(next);
    if (v) v.muted = next;
  };

  return (
    <div className="relative h-full w-full bg-[#F7F1EC]">
      {!playing ? (
        // Poster = frame réelle du MP4 (pas une image générique)
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reel.posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : null}

      <video
        ref={ref}
        src={active ? reel.videoSrc : undefined}
        className={`h-full w-full object-cover ${playing ? "opacity-100" : "opacity-0"}`}
        playsInline
        muted={muted}
        loop
        preload="none"
        controls={false}
      />

      {/* Play — jamais d’autoplay */}
      {!playing ? (
        <button
          type="button"
          className="absolute inset-0 z-[2] flex items-center justify-center bg-[#1C1412]/15"
          aria-label="Lire la vidéo"
          onClick={togglePlay}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C45B6A] text-white shadow-[0_8px_24px_rgba(196,91,106,0.4)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden>
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        </button>
      ) : (
        <>
          {/* Tap n’importe où = pause */}
          <button
            type="button"
            className="absolute inset-0 z-[2]"
            aria-label="Pause"
            onClick={togglePlay}
          />
          <span
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[2] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C45B6A] text-white shadow-[0_8px_24px_rgba(196,91,106,0.35)] transition-opacity duration-300 ${
              showPauseHint ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
            </svg>
          </span>
        </>
      )}

      {/* Pause toujours visible + son */}
      {playing ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Pause"
          className="absolute bottom-3 left-[3.25rem] z-[3] flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#1C1412]/55 text-white backdrop-blur-sm transition hover:bg-[#1C1412]/75"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
          </svg>
        </button>
      ) : null}

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Activer le son" : "Couper le son"}
        className="absolute bottom-3 left-3 z-[3] flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#1C1412]/55 text-white backdrop-blur-sm transition hover:bg-[#1C1412]/75"
      >
        {muted ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H3v6h3l5 4V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M23 9l-6 6M17 9l6 6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H3v6h3l5 4V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />
          </svg>
        )}
      </button>
    </div>
  );
}

function ReelSlide({
  reel,
  index,
  total,
  near,
}: {
  reel: UgcReel;
  index: number;
  total: number;
  near: boolean;
}) {
  return (
    <div
      data-reel="1"
      className="w-[58vw] max-w-[260px] shrink-0 snap-start sm:w-[230px] md:w-[250px]"
    >
      <div className="border border-[#1C1412]/10 bg-white shadow-[0_8px_28px_rgba(28,20,18,0.06)]">
        <div className="group relative aspect-[9/16] overflow-hidden bg-[#F7F1EC]">
          <LocalVideo reel={reel} active={near} />
          <div className="pointer-events-none absolute left-3 top-3 z-[1]">
            <p className="font-display text-[12px] font-semibold tracking-[0.18em] text-[#C4A484] drop-shadow-sm">
              رونق
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 z-[1]">
            <p className="text-[10px] font-medium tabular-nums tracking-[0.16em] text-white/85 drop-shadow">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Vidéo précédente" : "Vidéo suivante"}
      className="flex h-11 w-11 items-center justify-center border border-[#1C1412]/15 bg-white text-[#1C1412] transition hover:border-[#C45B6A] hover:text-[#C45B6A] disabled:pointer-events-none disabled:opacity-25 md:h-12 md:w-12"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        {dir === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function PdpUgcReels() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const syncActive = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.querySelectorAll<HTMLElement>("[data-reel='1']"));
    if (!children.length) return;
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    children.forEach((child, i) => {
      const d = Math.abs(child.offsetLeft - left);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncActive);
    };
    raf = requestAnimationFrame(syncActive);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [syncActive]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.querySelectorAll<HTMLElement>("[data-reel='1']"));
    const target = children[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    setActive(index);
  };

  if (PDP_UGC_REELS.length === 0) return null;
  const last = PDP_UGC_REELS.length - 1;

  return (
    <section className="border-b border-[#1C1412]/8 bg-white" aria-label="Vidéos Raonaq">
      <div className="pt-12 pb-10 md:pt-14 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">
                EN VIDÉO
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold leading-tight text-[#1C1412] md:text-4xl">
                Résultat salon, filmé
              </h2>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[#1C1412]/50">
                Appuie pour lire — pause et son à ta guise.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NavBtn dir="prev" disabled={active <= 0} onClick={() => goTo(active - 1)} />
              <NavBtn dir="next" disabled={active >= last} onClick={() => goTo(active + 1)} />
            </div>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex gap-3 overflow-x-auto scroll-smooth pb-2 pt-1 snap-x snap-mandatory px-4 sm:px-6 md:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PDP_UGC_REELS.map((reel, i) => (
            <ReelSlide
              key={reel.id}
              reel={reel}
              index={i}
              total={PDP_UGC_REELS.length}
              near={Math.abs(i - active) <= 1}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {PDP_UGC_REELS.map((reel, i) => (
            <button
              key={reel.id}
              type="button"
              aria-label={`Aller à la vidéo ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-7 bg-[#C45B6A]"
                  : "w-2 bg-[#1C1412]/15 hover:bg-[#1C1412]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
