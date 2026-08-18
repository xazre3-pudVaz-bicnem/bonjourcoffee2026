import type { MetadataRoute } from "next";
import { getBlogCategoriesInUse, getBlogList } from "@/lib/blog";
import { shop } from "@/data/shop";

/** ブログ記事が増えると自動的にエントリが追加される */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${shop.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${shop.url}/menu`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${shop.url}/coffee`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.url}/morning-lunch`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${shop.url}/access`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.url}/blog`, changeFrequency: "daily", priority: 0.7 },
  ];

  const categories: MetadataRoute.Sitemap = getBlogCategoriesInUse().map((c) => ({
    url: `${shop.url}/blog/category/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.4,
  }));

  const posts: MetadataRoute.Sitemap = getBlogList().map((p) => ({
    url: `${shop.url}/blog/${p.slug}`,
    lastModified: p.updatedAt || p.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categories, ...posts];
}
