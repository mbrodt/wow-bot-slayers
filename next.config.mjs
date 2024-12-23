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
};

export default nextConfig;
