import Image from "next/image";
import { getImageSize, getObjectPosition } from "../lib/imageSizes";

type ProductShotProps = {
  src: string;
  alt: string;
  variant?: "card" | "native";
  priority?: boolean;
  className?: string;
  /** Hint for next/image srcset — defaults by variant */
  sizes?: string;
};

/**
 * card: إطار طولي 4/5 (object-cover) عبر next/image
 * native: عرض 100% بنسبة الصورة
 */
export default function ProductShot({
  src,
  alt,
  variant = "card",
  priority = false,
  className = "",
  sizes,
}: ProductShotProps) {
  const quality = priority ? 88 : 82;
  const dims = getImageSize(src);
  const landscape = dims.width > dims.height;

  if (variant === "native") {
    return (
      <div className={`relative min-w-0 w-full max-w-full overflow-hidden bg-white ${className}`}>
        <Image
          key={src}
          src={src}
          alt={alt}
          width={dims.width}
          height={dims.height}
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          quality={quality}
          priority={priority}
          className="h-auto w-full max-w-full"
          style={{ objectPosition: getObjectPosition(src) }}
        />
      </div>
    );
  }

  // Lifestyle عريض (DUO / GO): إطار أقرب للصورة باش ما يتقطّعش الوجه ويبان باهت
  const frameStyle = landscape
    ? { aspectRatio: "3 / 4" as const }
    : { aspectRatio: "4 / 5" as const };

  return (
    <div
      className={`relative min-w-0 w-full max-w-full overflow-hidden bg-[#F7F1EC] ${className}`}
      style={frameStyle}
    >
      <Image
        key={`${src}-q${quality}`}
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"}
        quality={quality}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: getObjectPosition(src) }}
      />
    </div>
  );
}
