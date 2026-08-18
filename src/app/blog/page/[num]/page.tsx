import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import PostList, { CategoryNav, Pagination } from "@/components/blog/PostList";
import { getBlogCategoriesInUse, getBlogPage, getBlogPageCount } from "@/lib/blog";
import { photos } from "@/data/photos";

type Props = { params: Promise<{ num: string }> };

export function generateStaticParams() {
  const count = getBlogPageCount();
  // 1ページ目は /blog が担当
  return Array.from({ length: Math.max(0, count - 1) }, (_, i) => ({
    num: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { num } = await params;
  return {
    title: `ブログ（${num}ページ目）`,
    description: `ぼんじゅうる珈琲のブログ ${num}ページ目。珈琲のはなしや玉島でのカフェ時間のことを発信しています。`,
    alternates: { canonical: `/blog/page/${num}` },
    robots: { index: false, follow: true },
  };
}

export default async function BlogPagedPage({ params }: Props) {
  const { num } = await params;
  const page = Number(num);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) redirect("/blog");
  const pageCount = getBlogPageCount();
  if (page > pageCount) notFound();

  const posts = getBlogPage(page);
  const categories = getBlogCategoriesInUse();

  return (
    <>
      <PageHero en="Blog" title="お店だより" photo={photos.coffeeCups} />
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "ブログ", path: "/blog" },
          { name: `${page}ページ目`, path: `/blog/page/${page}` },
        ]}
      />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-4 sm:pb-28">
        <CategoryNav categories={categories} />
        <div className="mt-6">
          <PostList posts={posts} />
        </div>
        <Pagination page={page} pageCount={pageCount} />
      </div>
    </>
  );
}
