type BrandLogoProps = {
  variant?: "color" | "white";
  className?: string;
};

export default function BrandLogo({ variant = "color", className = "" }: BrandLogoProps) {
  const src = variant === "white" ? "/images/raonaq-logo-white.webp" : "/images/raonaq-logo.webp";

  return (
    <img
      src={src}
      alt="Raonaq Beauty"
      className={`h-full w-auto object-contain ${className}`}
    />
  );
}
