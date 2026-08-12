/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // مطلوب لـ Docker على EasyPanel
  images: {
    formats: ["image/avif", "image/webp"], // أوتوماتيك WebP/AVIF أصغر بـ 30-50%
    minimumCacheTTL: 60 * 60 * 24 * 30,   // cache 30 يوم
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
