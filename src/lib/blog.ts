import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * content/blog/*.md（毎日1記事の自動生成ブログ）を読み込みます。
 * frontmatter は gray-matter で解析します。
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedAt: string;
  category: string;
  keywords: string[];
  author: string;
  /** 記事個別画像は基本持たない（共通OG画像を使用）。指定時のみ使用 */
  image: string;
  topicId: string;
};

export type BlogPost = BlogMeta & { content: string };

/** カテゴリー表示名 → URL用スラッグ */
export const BLOG_CATEGORIES: { name: string; slug: string }[] = [
  { name: "珈琲のはなし", slug: "coffee" },
  { name: "モーニング・ランチ", slug: "meal" },
  { name: "カフェでの過ごし方", slug: "time" },
  { name: "玉島・倉敷のこと", slug: "local" },
  { name: "お店のこと", slug: "shop" },
];

export function categorySlug(name: string): string {
  return BLOG_CATEGORIES.find((c) => c.name === name)?.slug ?? "shop";
}

export function categoryName(slug: string): string | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug)?.name;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(/[,、]/)
      .map((v) => v.trim())
      .filter(Boolean);
  return [];
}

function readAll(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slugFromFile = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: String(data.slug ?? slugFromFile),
        title: String(data.title ?? slugFromFile),
        description: String(data.description ?? ""),
        date: String(data.date ?? ""),
        updatedAt: String(data.updatedAt ?? data.date ?? ""),
        category: String(data.category ?? "お店のこと"),
        keywords: toArray(data.keywords),
        author: String(data.author ?? "ぼんじゅうる珈琲"),
        image: String(data.image ?? ""),
        topicId: String(data.topicId ?? ""),
        content: content.trim(),
      };
    });
}

/** 1ページあたりの記事数（毎日更新のため一覧が肥大化しないよう分割） */
export const BLOG_PER_PAGE = 12;

/** 記事メタ一覧（日付降順） */
export function getBlogList(): BlogMeta[] {
  return readAll()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** 総ページ数 */
export function getBlogPageCount(): number {
  return Math.max(1, Math.ceil(getBlogList().length / BLOG_PER_PAGE));
}

/** ページ番号（1始まり）で記事を取得 */
export function getBlogPage(page: number): BlogMeta[] {
  const start = (page - 1) * BLOG_PER_PAGE;
  return getBlogList().slice(start, start + BLOG_PER_PAGE);
}

/** 1記事（本文Markdown付き） */
export function getBlogPost(slug: string): BlogPost | null {
  return readAll().find((p) => p.slug === slug) ?? null;
}

/** 静的生成用の slug 一覧 */
export function getBlogSlugs(): string[] {
  return readAll().map((p) => p.slug);
}

/** 記事が存在するカテゴリー（件数付き・記事が1件以上のみ） */
export function getBlogCategoriesInUse(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of readAll()) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return BLOG_CATEGORIES.map((c) => ({ ...c, count: counts.get(c.name) ?? 0 })).filter(
    (c) => c.count > 0,
  );
}

/** カテゴリー別の記事一覧 */
export function getBlogPostsByCategory(slug: string): BlogMeta[] {
  const name = categoryName(slug);
  if (!name) return [];
  return getBlogList().filter((p) => p.category === name);
}

/**
 * 関連記事：同カテゴリー → キーワード一致数 → 新しい順 で最大 limit 件
 */
export function getRelatedBlogPosts(slug: string, limit = 4): BlogMeta[] {
  const all = getBlogList();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);
  return all
    .filter((p) => p.slug !== slug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;
      score += p.keywords.filter((t) => current.keywords.includes(t)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.p);
}
