/** UGC reels — MP4 locaux uniquement (légers, lecture in-page, zéro Instagram). */

export type UgcReel = {
  id: string;
  videoSrc: string;
  posterSrc: string;
  label?: string;
};

/**
 * UGC reels locaux — 480p H.264 + AAC, ≤22s, faststart.
 * Poster = frame du MP4 · pas d’autoplay · charge seulement près du slide visible.
 */
export const PDP_UGC_REELS: UgcReel[] = [
  {
    id: "ugc-1",
    videoSrc: "/videos/ugc-1.mp4?v=3",
    posterSrc: "/videos/ugc-1.jpg?v=3",
  },
  {
    id: "ugc-2",
    videoSrc: "/videos/ugc-2.mp4?v=3",
    posterSrc: "/videos/ugc-2.jpg?v=3",
  },
  {
    id: "ugc-3",
    videoSrc: "/videos/ugc-3.mp4?v=3",
    posterSrc: "/videos/ugc-3.jpg?v=3",
  },
  {
    id: "ugc-4",
    videoSrc: "/videos/ugc-4.mp4?v=3",
    posterSrc: "/videos/ugc-4.jpg?v=3",
  },
  {
    id: "ugc-5",
    videoSrc: "/videos/ugc-5.mp4?v=3",
    posterSrc: "/videos/ugc-5.jpg?v=3",
  },
];
