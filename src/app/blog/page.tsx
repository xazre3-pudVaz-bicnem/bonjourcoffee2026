import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import PostList, { CategoryNav, Pagination } from "@/components/blog/PostList";
import { getBlogCategoriesInUse, getBlogPage, getBlogPageCount } from "@/lib/blog";
import { photos } from "@/data/photos";

export const metadata: Metadata = {
  title: "ブログ｜玉島の喫茶店から",
  description:
    "倉敷市玉島の喫茶店「ぼんじゅうる珈琲」のブログ。珈琲のはなし、モーニングやランチの楽しみ方、玉島・倉敷でのカフェ時間のことなどを、お店から発信しています。",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ブログ｜ぼんじゅうる珈琲",
    description:
      "珈琲のはなし、モーニングやランチの楽しみ方、玉島・倉敷でのカフェ時間のこと。",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = getBlogPage(1);
  const pageCount = getBlogPageCount();
  const categories = getBlogCategoriesInUse();

  return (
    <>
      <PageHero
        en="Blog"
        title="お店だより"
        lead="珈琲のこと、モーニングやランチのこと、玉島でのカフェ時間のこと。お店から、日々の小さな話題をお届けします。"
        photo={photos.coffeeCups}
      />
      <Breadcrumbs crumbs={[{ name: "ホーム", path: "/" }, { name: "ブログ", path: "/blog" }]} />
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-4 sm:pb-28">
        <CategoryNav categories={categories} />
        <div className="mt-6">
          <PostList posts={posts} />
        </div>
        <Pagination page={1} pageCount={pageCount} />
      </div>
    </>
  );
}
