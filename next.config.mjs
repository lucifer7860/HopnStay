/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.trvl-media.com" },
      { protocol: "https", hostname: "photo.hotellook.com" }
    ]
  }
};

export default nextConfig;
