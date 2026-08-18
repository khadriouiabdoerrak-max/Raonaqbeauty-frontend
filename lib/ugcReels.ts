/** UGC reels — MP4 locaux uniquement (légers, lecture in-page, zéro Instagram). */

export type UgcReel = {
  id: string;
  videoSrc: string;
  posterSrc: string;
  label?: string;
};

/**
 * Sources Instagram (exports locaux compressés) :
 * Db8VfVDsBTH · Db6JjkYNNXc · DcGOQayKBrO · DcI5Rtcq13g · DcJ--QNop9U
 * ~360p, 24fps, AAC 64k mono, ≤25s (~0.4–1 MB chacun)
 * Poster = frame réelle du MP4 · lecture manuelle + mute toggle
 */
export const PDP_UGC_REELS: UgcReel[] = [
  {
    id: "ugc-1",
    videoSrc: "/videos/ugc-1.mp4?v=2",
    posterSrc: "/videos/ugc-1.jpg?v=2",
  },
  {
    id: "ugc-2",
    videoSrc: "/videos/ugc-2.mp4?v=2",
    posterSrc: "/videos/ugc-2.jpg?v=2",
  },
  {
    id: "ugc-3",
    videoSrc: "/videos/ugc-3.mp4?v=2",
    posterSrc: "/videos/ugc-3.jpg?v=2",
  },
  {
    id: "ugc-4",
    videoSrc: "/videos/ugc-4.mp4?v=2",
    posterSrc: "/videos/ugc-4.jpg?v=2",
  },
  {
    id: "ugc-5",
    videoSrc: "/videos/ugc-5.mp4?v=2",
    posterSrc: "/videos/ugc-5.jpg?v=2",
  },
];
