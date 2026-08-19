import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos } from "@/data/photos";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "珈琲へのこだわり｜玉島でハンドドリップ珈琲を",
  description:
    "倉敷市玉島「ぼんじゅうる珈琲」の珈琲について。注文ごとに豆を挽き、一杯ずつハンドドリップで抽出。アイスコーヒーも店内仕込みです。毎日飲みたくなる、日常の一杯をめざしています。",
  alternates: { canonical: "/coffee" },
  openGraph: {
    title: "珈琲へのこだわり｜ぼんじゅうる珈琲",
    description:
      "注文ごとに豆を挽き、一杯ずつハンドドリップで抽出。アイスコーヒーも店内仕込み。玉島で日常の一杯を。",
    url: "/coffee",
  },
};

export default function CoffeePage() {
  return (
    <>
      {/* このページは写真主体の編集的レイアウト。PageHeroは使わず大きく見せる */}
      <div className="relative h-[52svh] min-h-[360px] w-full overflow-hidden">
        <Image
          src={photos.coffeeHot.src}
          alt={photos.coffeeHot.alt}
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-10 sm:pb-14">
            <p aria-hidden className="hero-fade font-en text-2xl text-orange-soft sm:text-3xl">
              Hand drip coffee
            </p>
            <h1 className="hero-fade mt-2 font-heading text-2xl font-bold leading-snug tracking-wide text-white [--hero-delay:0.15s] sm:text-4xl">
              一杯ずつ丁寧に淹れる、ぼんじゅうる珈琲
            </h1>
          </div>
        </div>
      </div>
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "珈琲へのこだわり", path: "/coffee" },
        ]}
      />

      {/* 導入 */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <Reveal>
          <p className="text-sm leading-loose text-espresso sm:text-base">
            むずかしい話は抜きにして、「今日も美味しいね」と言ってもらえる一杯を。玉島で珈琲を飲むなら、と思い出してもらえる店になれるよう、ぼんじゅうる珈琲は毎日同じことを、同じように丁寧に続けています。
          </p>
        </Reveal>
      </section>

      {/* 挽きたてをハンドドリップで */}
      <section className="grain bg-paper py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-16">
          <Reveal>
            <SectionHeading en="Grind &amp; drip">
              挽きたての豆を、ハンドドリップで
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                ご注文をいただいてから豆を挽き、一杯ずつハンドドリップで抽出します。挽きたての豆にお湯を注ぐと、ふわっとふくらんで香りが立ちのぼります。その香りごと楽しんでいただきたくて、淹れ置きはしていません。
              </p>
              <p>
                定番のブレンドやアメリカンのほか、ナポリやコロンビア、カフェインレスなど数種類をご用意。その日の気分で選んでみてください。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Image
              src={photos.coffeeBeans.src}
              alt={photos.coffeeBeans.alt}
              width={photos.coffeeBeans.width}
              height={photos.coffeeBeans.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </Reveal>
        </div>
      </section>

      {/* アイスコーヒー */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-16">
          <Reveal className="order-2 md:order-1">
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden">
              <Image
                src={photos.coffeeIce.src}
                alt={photos.coffeeIce.alt}
                fill
                sizes="(min-width: 768px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <SectionHeading en="Iced coffee">
              アイスコーヒーも、店内で仕込む
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                夏に限らず人気のアイスコーヒーも、店内で仕込んだものをお出ししています。すっきりとした飲み口の中に、珈琲らしい香ばしさが残る味わいです。
              </p>
              <p>
                モーニングやランチのセットドリンクにも選べますので、食事と一緒にどうぞ。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 日常の一杯 */}
      <section className="grain bg-espresso py-16 text-ivory sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <SectionHeading en="Everyday coffee" tone="dark" align="center">
              特別な日ではなく、毎日のための珈琲
            </SectionHeading>
            <div className="mt-8 space-y-4 text-sm leading-loose text-ivory/90 sm:text-base">
              <p>
                めざしているのは、日常的に飲みに来てもらえる珈琲です。仕事前の一杯、買い物帰りの一杯、夕方のひと休みの一杯。
              </p>
              <p>
                カウンター席もありますので、お一人でもお気軽に。珈琲に詳しくなくても大丈夫です。迷ったら、まずはブレンドをどうぞ。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 内部リンク */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-12">
          <Link
            href="/menu#coffee"
            className="inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
          >
            珈琲メニューと価格を見る
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/access"
            className="inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
          >
            店舗情報・アクセス（{shop.hours}）
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
