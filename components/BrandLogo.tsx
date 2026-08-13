type BrandLogoProps = {
  variant?: "color" | "white";
  className?: string;
};

export default function BrandLogo({ variant = "color", className = "" }: BrandLogoProps) {
  const src = variant === "white" ? "/images/raonaq-logo-white.png" : "/images/raonaq-logo.png";

  return (
    <img
      src={src}
      alt="رونق — Raonaq Beauty"
      className={`h-full w-auto object-contain ${className}`}
    />
  );
}
