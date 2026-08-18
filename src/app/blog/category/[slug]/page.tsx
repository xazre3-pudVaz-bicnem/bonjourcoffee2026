import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import PostList, { CategoryNav } from "@/components/blog/PostList";
import {
  BLOG_CATEGORIES,
  categoryName,
  getBlogCategoriesInUse,
  getBlogPostsByCategory,
} from "@/lib/blog";
import { photos } from "@/data/photos";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = categoryName(slug);
  if (!name) return {};
  return {
    title: `${name}の記事一覧`,
    description: `ぼんじゅうる珈琲のブログから「${name}」カテゴリーの記事一覧です。倉敷市玉島の喫茶店より。`,
    alternates: { canonical: `/blog/category/${slug}` },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const name = categoryName(slug);
  if (!name) notFound();

  const posts = getBlogPostsByCategory(slug);
  const categories = getBlogCategoriesInUse();

  return (
    <>
      <PageHero en="Blog" title={name} photo={photos.coffeeCups} />
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "ブログ", path: "/blog" },
          { name, path: `/blog/category/${slug}` },
        ]}
      />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-4 sm:pb-28">
        <CategoryNav categories={categories} current={slug} />
        <div className="mt-6">
          <PostList posts={posts} />
        </div>
      </div>
    </>
  );
}
