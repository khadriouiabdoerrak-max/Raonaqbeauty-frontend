/** أبعاد الصور الحقيقية في /public/images — باش الإطار ما يغلطش قبل التحميل */
const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  "/images/raonaq-trio-woman.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-pack.webp": { width: 1024, height: 1024 },
  "/images/raonaq-trio-tools.webp": { width: 1024, height: 1024 },
  "/images/raonaq-trio-box.webp": { width: 1024, height: 1024 },
  "/images/raonaq-air-soft-woman.webp": { width: 1024, height: 1536 },
  "/images/raonaq-air-soft-pack.webp": { width: 1024, height: 1024 },
  "/images/raonaq-air-soft-tool.webp": { width: 1024, height: 1024 },
  "/images/raonaq-air-soft-box.webp": { width: 1024, height: 1024 },
  "/images/raonaq-air-pink-woman.webp": { width: 1024, height: 1536 },
  "/images/raonaq-air-pink-pack.webp": { width: 1024, height: 1024 },
  "/images/raonaq-air-pink-tool.webp": { width: 1024, height: 1024 },
  "/images/raonaq-air-pink-box.webp": { width: 1024, height: 1024 },
  "/images/raonaq-volume-woman.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-pack.webp": { width: 1024, height: 1024 },
  "/images/raonaq-volume-tool.webp": { width: 1024, height: 1024 },
  "/images/raonaq-volume-box.webp": { width: 1024, height: 1024 },
  "/images/raonaq-duo-woman.webp": { width: 1536, height: 1024 },
  "/images/raonaq-duo-tool.webp": { width: 819, height: 1024 },
  "/images/raonaq-duo-unboxing.webp": { width: 1536, height: 1024 },
  "/images/raonaq-duo-closeup.webp": { width: 1536, height: 1024 },
  "/images/raonaq-go-woman.webp": { width: 1536, height: 1024 },
  "/images/raonaq-go-lifestyle.webp": { width: 1024, height: 1024 },
  "/images/raonaq-go-closeup.webp": { width: 1536, height: 1024 },
  "/images/raonaq-go-unboxing.webp": { width: 1536, height: 1024 },
  "/images/raonaq-go-box.webp": { width: 1024, height: 778 },
  "/images/raonaq-hair-straight.webp": { width: 1024, height: 1536 },
  "/images/raonaq-hair-curls.webp": { width: 1024, height: 1536 },
  "/images/raonaq-hair-waves.webp": { width: 1024, height: 1536 },
  "/images/raonaq-hair-blowout.webp": { width: 1024, height: 1536 },
  "/images/raonaq-studio-tool-straight.webp": { width: 1024, height: 1536 },
  "/images/raonaq-studio-gift-box.webp": { width: 1024, height: 1536 },
  "/images/raonaq-studio-air-brush.webp": { width: 1024, height: 1536 },
  "/images/raonaq-studio-wand-detail.webp": { width: 1024, height: 1536 },
  "/images/raonaq-studio-hair-shine.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-collage.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-before-after.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-howto.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-product-beauty.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-product-hero.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-product-line.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-love.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-ba.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-steps.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-showcase.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-looks.webp": { width: 1024, height: 1536 },
  "/images/raonaq-duo-catalog.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-collage.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-before-after.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-howto.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-collage.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-before-after.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-howto.webp": { width: 1024, height: 1536 },
  "/images/raonaq-soft-collage.webp": { width: 1024, height: 1536 },
  "/images/raonaq-soft-before-after.webp": { width: 1024, height: 1536 },
  "/images/raonaq-soft-howto.webp": { width: 1024, height: 1536 },
  "/images/raonaq-jour-collage.webp": { width: 1024, height: 1536 },
  "/images/raonaq-jour-before-after.webp": { width: 1024, height: 1536 },
  "/images/raonaq-jour-howto.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-collage.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-before-after.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-howto.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-love.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-bag.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-inside.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-kit.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-battery.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-pov.webp": { width: 1024, height: 1536 },
  "/images/raonaq-go-catalog.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-catalog.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-love.webp": { width: 1024, height: 1536 },
  "/images/raonaq-trio-showcase.webp": { width: 1024, height: 1536 },
  "/images/raonaq-soft-catalog.webp": { width: 1024, height: 1536 },
  "/images/raonaq-soft-love.webp": { width: 1024, height: 1536 },
  "/images/raonaq-soft-showcase.webp": { width: 1024, height: 1536 },
  "/images/raonaq-jour-catalog.webp": { width: 1024, height: 1536 },
  "/images/raonaq-jour-love.webp": { width: 1024, height: 1536 },
  "/images/raonaq-jour-showcase.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-catalog.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-love.webp": { width: 1024, height: 1536 },
  "/images/raonaq-volume-showcase.webp": { width: 1024, height: 1536 },
};

const DEFAULT_SIZE = { width: 1024, height: 1024 };

export function getImageSize(src: string): { width: number; height: number } {
  return IMAGE_SIZES[src] ?? DEFAULT_SIZE;
}

/** فين نركّزو الـ cover باش المنتوج / الوجه يبقاو باينين فإطار طولي */
export function getObjectPosition(src: string): string {
  const { width, height } = getImageSize(src);
  if (
    src.includes("studio-") ||
    src.includes("-collage") ||
    src.includes("-howto") ||
    src.includes("-before-after") ||
    src.includes("-product-") ||
    src.includes("-catalog") ||
    src.includes("-love") ||
    src.includes("-showcase")
  ) {
    return "center center";
  }
  if (width > height) {
    // صور عريضة (DUO / GO): الشخص + الأداة غالباً فاليمين
    if (src.includes("duo-woman") || src.includes("go-woman")) return "72% 42%";
    if (src.includes("closeup")) return "60% 45%";
    return "55% 40%";
  }
  // صور طول (TRIO / AIR / VOLUME): من فوق باش الوجه + الأداة
  return "center top";
}
