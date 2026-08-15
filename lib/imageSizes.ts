/** أبعاد الصور الحقيقية في /public/images — باش الإطار ما يغلطش قبل التحميل */
const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  "/images/raonaq-trio-woman.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-pack.png": { width: 1024, height: 1024 },
  "/images/raonaq-trio-tools.png": { width: 1024, height: 1024 },
  "/images/raonaq-trio-box.png": { width: 1024, height: 1024 },
  "/images/raonaq-air-soft-woman.png": { width: 1024, height: 1536 },
  "/images/raonaq-air-soft-pack.png": { width: 1024, height: 1024 },
  "/images/raonaq-air-soft-tool.png": { width: 1024, height: 1024 },
  "/images/raonaq-air-soft-box.png": { width: 1024, height: 1024 },
  "/images/raonaq-air-pink-woman.png": { width: 1024, height: 1536 },
  "/images/raonaq-air-pink-pack.png": { width: 1024, height: 1024 },
  "/images/raonaq-air-pink-tool.png": { width: 1024, height: 1024 },
  "/images/raonaq-air-pink-box.png": { width: 1024, height: 1024 },
  "/images/raonaq-volume-woman.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-pack.png": { width: 1024, height: 1024 },
  "/images/raonaq-volume-tool.png": { width: 1024, height: 1024 },
  "/images/raonaq-volume-box.png": { width: 1024, height: 1024 },
  "/images/raonaq-duo-woman.png": { width: 1536, height: 1024 },
  "/images/raonaq-duo-tool.png": { width: 819, height: 1024 },
  "/images/raonaq-duo-unboxing.png": { width: 1536, height: 1024 },
  "/images/raonaq-duo-closeup.png": { width: 1536, height: 1024 },
  "/images/raonaq-go-woman.png": { width: 1536, height: 1024 },
  "/images/raonaq-go-lifestyle.png": { width: 1024, height: 1024 },
  "/images/raonaq-go-closeup.png": { width: 1536, height: 1024 },
  "/images/raonaq-go-unboxing.png": { width: 1536, height: 1024 },
  "/images/raonaq-go-box.png": { width: 1024, height: 778 },
  "/images/raonaq-hair-straight.png": { width: 1024, height: 1536 },
  "/images/raonaq-hair-curls.png": { width: 1024, height: 1536 },
  "/images/raonaq-hair-waves.png": { width: 1024, height: 1536 },
  "/images/raonaq-hair-blowout.png": { width: 1024, height: 1536 },
  "/images/raonaq-studio-tool-straight.png": { width: 1024, height: 1536 },
  "/images/raonaq-studio-gift-box.png": { width: 1024, height: 1536 },
  "/images/raonaq-studio-air-brush.png": { width: 1024, height: 1536 },
  "/images/raonaq-studio-wand-detail.png": { width: 1024, height: 1536 },
  "/images/raonaq-studio-hair-shine.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-collage.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-before-after.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-howto.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-product-beauty.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-product-hero.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-product-line.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-love.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-ba.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-steps.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-showcase.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-looks.png": { width: 1024, height: 1536 },
  "/images/raonaq-duo-catalog.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-collage.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-before-after.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-howto.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-collage.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-before-after.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-howto.png": { width: 1024, height: 1536 },
  "/images/raonaq-soft-collage.png": { width: 1024, height: 1536 },
  "/images/raonaq-soft-before-after.png": { width: 1024, height: 1536 },
  "/images/raonaq-soft-howto.png": { width: 1024, height: 1536 },
  "/images/raonaq-jour-collage.png": { width: 1024, height: 1536 },
  "/images/raonaq-jour-before-after.png": { width: 1024, height: 1536 },
  "/images/raonaq-jour-howto.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-collage.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-before-after.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-howto.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-love.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-bag.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-inside.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-kit.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-battery.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-pov.png": { width: 1024, height: 1536 },
  "/images/raonaq-go-catalog.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-catalog.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-love.png": { width: 1024, height: 1536 },
  "/images/raonaq-trio-showcase.png": { width: 1024, height: 1536 },
  "/images/raonaq-soft-catalog.png": { width: 1024, height: 1536 },
  "/images/raonaq-soft-love.png": { width: 1024, height: 1536 },
  "/images/raonaq-soft-showcase.png": { width: 1024, height: 1536 },
  "/images/raonaq-jour-catalog.png": { width: 1024, height: 1536 },
  "/images/raonaq-jour-love.png": { width: 1024, height: 1536 },
  "/images/raonaq-jour-showcase.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-catalog.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-love.png": { width: 1024, height: 1536 },
  "/images/raonaq-volume-showcase.png": { width: 1024, height: 1536 },
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
