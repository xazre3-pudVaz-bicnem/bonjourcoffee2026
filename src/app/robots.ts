import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${shop.url}/sitemap.xml`,
  };
}
