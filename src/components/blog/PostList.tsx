import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { categorySlug, type BlogMeta } from "@/lib/blog";

/** ブログ記事一覧（リスト型・カード乱用はしない） */
export default function PostList({ posts }: { posts: BlogMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-wood-deep">
        記事はまだありません。準備中です。
      </p>
    );
  }
  return (
    <ul>
      {posts.map((post, i) => (
        <Reveal key={post.slug} as="li" delay={(i % 6) * 0.05} className="hairline-b">
          <article>
            <Link href={`/blog/${post.slug}`} className="group block py-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-wood-deep">
                <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
                <span className="text-orange-text">{post.category}</span>
              </div>
              <h2 className="mt-1.5 font-heading text-base font-bold leading-relaxed underline-offset-4 group-hover:text-orange-deep group-hover:underline sm:text-lg">
                {post.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-espresso">
                {post.description}
              </p>
            </Link>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

/** カテゴリの絞り込みナビ */
export function CategoryNav({
  categories,
  current,
}: {
  categories: { name: string; slug: string; count: number }[];
  current?: string;
}) {
  if (categories.length === 0) return null;
  return (
    <nav aria-label="カテゴリー" className="mt-8">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <li>
          <Link
            href="/blog"
            className={
              current
                ? "text-orange-text underline-offset-4 hover:underline"
                : "font-medium text-ink"
            }
          >
            すべて
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/blog/category/${c.slug}`}
              className={
                current === c.slug
                  ? "font-medium text-ink"
                  : "text-orange-text underline-offset-4 hover:underline"
              }
            >
              {c.name}（{c.count}）
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** ページ送り */
export function Pagination({
  page,
  pageCount,
}: {
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const hrefOf = (p: number) => (p === 1 ? "/blog" : `/blog/page/${p}`);
  return (
    <nav aria-label="ページ送り" className="mt-12 flex items-center justify-center gap-6 text-sm">
      {page > 1 ? (
        <Link
          href={hrefOf(page - 1)}
          className="text-orange-text underline-offset-4 hover:underline"
        >
          ← 前のページ
        </Link>
      ) : null}
      <span className="text-wood-deep">
        {page} / {pageCount}
      </span>
      {page < pageCount ? (
        <Link
          href={hrefOf(page + 1)}
          className="text-orange-text underline-offset-4 hover:underline"
        >
          次のページ →
        </Link>
      ) : null}
    </nav>
  );
}

export { categorySlug };
