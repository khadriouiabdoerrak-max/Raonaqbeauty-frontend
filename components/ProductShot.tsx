import { getObjectPosition } from "../lib/imageSizes";

type ProductShotProps = {
  src: string;
  alt: string;
  variant?: "card" | "native";
  priority?: boolean;
  className?: string;
};

/**
 * card: إطار طولي 4/5 كامل (object-cover) — باش يبان المنتوج مزيان
 * native: عرض 100% بنسبة الصورة الحقيقية
 */
export default function ProductShot({
  src,
  alt,
  variant = "card",
  priority = false,
  className = "",
}: ProductShotProps) {
  if (variant === "native") {
    return (
      <div className={`min-w-0 w-full max-w-full overflow-hidden bg-white ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={alt}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            height: "auto",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative min-w-0 w-full max-w-full overflow-hidden bg-[#F7F1EC] ${className}`}
      style={{ aspectRatio: "4 / 5" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: getObjectPosition(src),
        }}
      />
    </div>
  );
}
