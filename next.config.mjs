/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zvujdftfcqnajovgspym.supabase.co",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
