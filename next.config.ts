import type { NextConfig } from "next";

// Exportación estática: el sitio se sirve como archivos (Netlify, cualquier CDN).
// No requiere servidor Node en producción.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
