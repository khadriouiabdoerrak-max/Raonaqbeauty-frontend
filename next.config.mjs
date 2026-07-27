/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // مطلوب لـ Docker على EasyPanel
  images: {
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
