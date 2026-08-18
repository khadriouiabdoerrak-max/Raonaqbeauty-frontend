"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PDP_UGC_REELS, type UgcReel } from "../lib/ugcReels";

function LocalVideo({
  reel,
  active,
  sectionLive,
}: {
  reel: UgcReel;
  active: boolean;
  sectionLive: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showPauseHint, setShowPauseHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active && sectionLive) return;
    const el = ref.current;
    if (el && !el.paused) el.pause();
    setPlaying(false);
    setShowPauseHint(false);
  }, [active, sectionLive]);

  useEffect(() => {
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;

    if (!v.paused && playing) {
      v.pause();
      setPlaying(false);
      setShowPauseHint(false);
      return;
    }

    // Must call play() in the same user-gesture turn (no await before it).
    if (!v.getAttribute("src")) {
      v.src = reel.videoSrc;
    }
    v.muted = muted;
    const playPromise = v.play();
    if (playPromise !== undefined) {
      void playPromise
        .then(() => {
          setPlaying(true);
          setShowPauseHint(true);
          if (hintTimer.current) clearTimeout(hintTimer.current);
          hintTimer.current = setTimeout(() => setShowPauseHint(false), 1400);
        })
        .catch(() => {
          setPlaying(false);
        });
    }
  };

  const toggleMute = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    const v = ref.current;
    if (v) v.muted = next;
  };

  return (
    <div className="relative h-full w-full bg-[#F7F1EC]">
      {!playing ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reel.posterSrc}
          alt=""
          className="absolute inset-0 z-[1] h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <video
        ref={ref}
        className={`relative z-0 h-full w-full object-cover ${playing ? "opacity-100" : "opacity-0"}`}
        playsInline
        muted={muted}
        loop
        preload="none"
        controls={false}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          setShowPauseHint(false);
        }}
      />

      {!playing ? (
        <button
          type="button"
          className="absolute inset-0 z-[2] flex items-center justify-center bg-[#1C1412]/12"
          aria-label="Lire la vidéo"
          onClick={togglePlay}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C45B6A] text-white md:h-14 md:w-14">
            <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5 md:h-6 md:w-6" fill="currentColor" aria-hidden>
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        </button>
      ) : (
        <>
          <button
            type="button"
            className="absolute inset-0 z-[2]"
            aria-label="Pause"
            onClick={togglePlay}
          />
          <span
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[2] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C45B6A] text-white transition-opacity duration-300 ${
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
  sectionLive,
}: {
  reel: UgcReel;
  index: number;
  total: number;
  near: boolean;
  sectionLive: boolean;
}) {
  return (
    <div
      data-reel="1"
      className="w-[52vw] max-w-[220px] shrink-0 snap-start sm:w-[210px] md:w-[228px]"
    >
      <div className="overflow-hidden border border-[#C4A484]/35 bg-[#F7F1EC]">
        <div className="relative aspect-[9/16] overflow-hidden bg-[#F7F1EC]">
          <LocalVideo reel={reel} active={near} sectionLive={sectionLive} />
          <div className="pointer-events-none absolute left-3 top-3 z-[1]">
            <p className="font-display text-[11px] font-semibold tracking-[0.2em] text-white drop-shadow-[0_1px_8px_rgba(28,20,18,0.45)]">
              رونق
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 z-[1]">
            <p className="text-[10px] font-medium tabular-nums tracking-[0.14em] text-white/90 drop-shadow">
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
      className="flex h-10 w-10 items-center justify-center border border-[#C4A484]/50 bg-white text-[#1C1412] transition hover:border-[#C45B6A] hover:text-[#C45B6A] disabled:pointer-events-none disabled:opacity-25 md:h-11 md:w-11"
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
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [sectionLive, setSectionLive] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setSectionLive(entry.isIntersecting);
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <section
      ref={sectionRef}
      className="border-b border-[#1C1412]/8 bg-[#F7F1EC]"
      aria-label="Vidéos Raonaq"
    >
      <div className="pt-12 pb-10 md:pt-14 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">
                رونق · EN VIDÉO
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold leading-tight text-[#1C1412] md:text-4xl">
                Résultat salon, filmé
              </h2>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[#1C1412]/50">
                Lecture manuelle — pause et son à ta guise.
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
              sectionLive={sectionLive}
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
