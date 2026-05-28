import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ivunidrgfxvuoijgfcnr.supabase.co",
      },
    ],
  },
};

export default nextConfig;