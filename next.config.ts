import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    remotePatterns: [
      new URL("https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg"), 
      new URL("https://png.pngtree.com/png-vector/20220817/ourmid/pngtree-women-cartoon-avatar-in-flat-style-png-image_6110776.png"),
      new URL("https://lh3.googleusercontent.com/a/ACg8ocLJkgEs4WoWBwgiB5EfbYftGaWS5ppYjLCeGGDrV36h1WGG5w=s96-c")
    ]
  }
};

export default nextConfig;
