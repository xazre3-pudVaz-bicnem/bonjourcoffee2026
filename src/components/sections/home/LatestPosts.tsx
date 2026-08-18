import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getBlogList } from "@/lib/blog";

/** 最新ブログ（Server Componentでビルド時に読み込み） */
export default function LatestPosts() {
  const posts = getBlogList().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <Reveal className="flex items-end justify-between">
        <SectionHeading en="Blog">お店だより</SectionHeading>
        <Link
          href="/blog"
          className="hidden items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep sm:inline-flex"
        >
          一覧を見る
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Reveal>
      <ul className="mt-10">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.08} as="li" className="hairline-b">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <time
                dateTime={post.date}
                className="shrink-0 text-xs text-wood-deep sm:text-sm"
              >
                {post.date.replaceAll("-", ".")}
              </time>
              <span className="shrink-0 text-xs text-orange-text">
                {post.category}
              </span>
              <span className="text-sm font-medium underline-offset-4 group-hover:text-orange-deep group-hover:underline sm:text-base">
                {post.title}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
      <Reveal className="mt-8 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text"
        >
          一覧を見る
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}
