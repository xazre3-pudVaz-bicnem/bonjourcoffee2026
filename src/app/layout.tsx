import type { Metadata, Viewport } from "next";
import { Caveat, Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/ui/JsonLd";
import { cafeJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { shop } from "@/data/shop";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-maru",
  display: "swap",
  preload: false,
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
  preload: false,
});

const caveat = Caveat({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(shop.url),
  title: {
    default: "ぼんじゅうる珈琲｜倉敷市玉島のカフェ・コーヒー・ランチ",
    template: "%s｜ぼんじゅうる珈琲｜倉敷市玉島のカフェ",
  },
  description:
    "岡山県倉敷市玉島柏島の「ぼんじゅうる珈琲」。一杯ずつ丁寧にハンドドリップで淹れる珈琲をはじめ、モーニング、ランチ、バインミー、おにぎり、ホットケーキを楽しめる気軽な喫茶店です。営業時間8:00〜18:00。",
  keywords: [
    "玉島 カフェ",
    "玉島 コーヒー",
    "玉島 ランチ",
    "玉島 モーニング",
    "玉島 喫茶店",
    "倉敷 カフェ",
    "倉敷 コーヒー",
  ],
  openGraph: {
    title: "ぼんじゅうる珈琲｜倉敷市玉島のカフェ・コーヒー・ランチ",
    description:
      "岡山県倉敷市玉島柏島の喫茶店。一杯ずつハンドドリップで淹れる珈琲、モーニング、ランチ、バインミー、おにぎり、ホットケーキ。営業時間8:00〜18:00。",
    url: "/",
    siteName: "ぼんじゅうる珈琲",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.jpg", width: 1280, height: 853 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#d1742f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ja"
      className={`${zenMaru.variable} ${zenKaku.variable} ${caveat.variable}`}
    >
      {/* JSが動く環境でだけ <html> に .js を付ける。スクロール表示の
          アニメーション（.reveal）はこのクラス配下でのみ要素を隠すため、
          JSが無効・失敗しても本文が見えなくなることがない。 */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      <body className="bg-ivory font-gothic text-ink antialiased">
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={cafeJsonLd()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-espresso focus:px-5 focus:py-3 focus:text-sm focus:text-ivory"
        >
          本文へスキップ
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
