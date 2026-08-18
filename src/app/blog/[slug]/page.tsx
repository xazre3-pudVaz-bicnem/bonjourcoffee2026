import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { blogPostingJsonLd } from "@/lib/jsonld";
import {
  categorySlug,
  getBlogPost,
  getBlogSlugs,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { ArrowRightIcon } from "@/components/ui/icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      images: [{ url: post.image || "/og.jpg" }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedBlogPosts(slug, 4);

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post)} />
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "ブログ", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-wood-deep">
            <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
            {post.updatedAt && post.updatedAt !== post.date ? (
              <span>更新 {post.updatedAt.replaceAll("-", ".")}</span>
            ) : null}
            <Link
              href={`/blog/category/${categorySlug(post.category)}`}
              className="text-orange-text underline-offset-4 hover:underline"
            >
              {post.category}
            </Link>
          </div>
          <h1 className="mt-3 font-heading text-2xl font-bold leading-relaxed tracking-wide sm:text-3xl">
            {post.title}
          </h1>
          <p className="mt-3 text-xs text-wood-deep">文：{post.author}</p>
        </header>

        <div className="prose-blog mt-10 text-sm leading-loose sm:text-base">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        <footer className="mt-14 border-t border-ink/10 pt-8">
          <p className="text-xs leading-relaxed text-wood-deep">
            ぼんじゅうる珈琲｜岡山県倉敷市玉島柏島6988-3｜営業時間 8:00〜18:00
          </p>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link
              href="/menu"
              className="text-orange-text underline-offset-4 hover:underline"
            >
              メニューを見る
            </Link>
            <Link
              href="/access"
              className="text-orange-text underline-offset-4 hover:underline"
            >
              店舗情報・アクセス
            </Link>
          </div>
        </footer>
      </article>

      {related.length > 0 ? (
        <section className="mx-auto max-w-3xl px-5 pb-20 sm:pb-28">
          <h2 className="font-heading text-lg font-bold">関連記事</h2>
          <ul className="mt-4">
            {related.map((p) => (
              <Reveal key={p.slug} as="li" className="hairline-b">
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-5"
                >
                  <time dateTime={p.date} className="shrink-0 text-xs text-wood-deep">
                    {p.date.replaceAll("-", ".")}
                  </time>
                  <span className="text-sm underline-offset-4 group-hover:text-orange-deep group-hover:underline">
                    {p.title}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              ブログ一覧へ戻る
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
