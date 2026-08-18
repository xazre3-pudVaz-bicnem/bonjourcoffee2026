import { shop } from "@/data/shop";
import type { BlogPost } from "@/lib/blog";

/**
 * 構造化データ（JSON-LD）の生成。
 * 確認できていない情報（レビュー・評価・価格帯・決済手段など）は含めない。
 */

export function cafeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${shop.url}/#shop`,
    name: shop.name,
    url: shop.url,
    telephone: shop.tel,
    image: `${shop.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: shop.addressRegion,
      addressLocality: shop.addressLocality,
      streetAddress: shop.streetAddress,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        // 定休日は「水曜ほか不定休」のため、確定している水曜以外の曜日を記載
        dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: shop.opens,
        closes: shop.closes,
      },
    ],
    hasMenu: `${shop.url}/menu`,
    servesCuisine: ["コーヒー", "喫茶店", "カフェ"],
    sameAs: [shop.instagram],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${shop.url}/#website`,
    name: shop.name,
    url: shop.url,
    inLanguage: "ja",
    publisher: { "@id": `${shop.url}/#shop` },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${shop.url}${c.path === "/" ? "" : c.path}` || shop.url,
    })),
  };
}

export function blogPostingJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    inLanguage: "ja",
    image: `${shop.url}${post.image || "/og.jpg"}`,
    author: {
      "@type": "Organization",
      name: shop.name,
      url: shop.url,
    },
    publisher: {
      "@type": "Organization",
      name: shop.name,
      url: shop.url,
    },
    mainEntityOfPage: `${shop.url}/blog/${post.slug}`,
  };
}

export type FaqItem = { question: string; answer: string };

/** 画面に実際に表示しているFAQのみを渡すこと */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
