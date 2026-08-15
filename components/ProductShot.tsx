import Image from "next/image";
import { getObjectPosition } from "../lib/imageSizes";

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
  if (variant === "native") {
    return (
      <div className={`relative min-w-0 w-full max-w-full overflow-hidden bg-white ${className}`}>
        <Image
          key={src}
          src={src}
          alt={alt}
          width={1200}
          height={1500}
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          quality={72}
          priority={priority}
          className="h-auto w-full max-w-full"
          style={{ objectPosition: getObjectPosition(src) }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative min-w-0 w-full max-w-full overflow-hidden bg-[#F7F1EC] ${className}`}
      style={{ aspectRatio: "4 / 5" }}
    >
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"}
        quality={72}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: getObjectPosition(src) }}
      />
    </div>
  );
}
