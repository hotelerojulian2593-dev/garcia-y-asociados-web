import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/sitio";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/politica-de-datos/"] }, sitemap: `${URL_SITIO}/sitemap.xml` };
}
