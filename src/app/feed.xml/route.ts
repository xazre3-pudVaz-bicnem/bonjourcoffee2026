import { getBlogList } from "@/lib/blog";
import { shop } from "@/data/shop";

/** RSS 2.0 フィード。記事が増えるとビルド時に自動更新される */
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const posts = getBlogList().slice(0, 30);

  const items = posts
    .map((p) => {
      const url = `${shop.url}/blog/${p.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(p.description)}</description>`,
        `      <category>${escapeXml(p.category)}</category>`,
        `      <pubDate>${new Date(`${p.date}T09:00:00+09:00`).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    "  <channel>",
    `    <title>${escapeXml(`${shop.name} ブログ`)}</title>`,
    `    <link>${shop.url}/blog</link>`,
    `    <description>${escapeXml(
      "倉敷市玉島の喫茶店「ぼんじゅうる珈琲」のブログ。珈琲のはなしや、モーニング・ランチ、玉島でのカフェ時間のこと。",
    )}</description>`,
    "    <language>ja</language>",
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
