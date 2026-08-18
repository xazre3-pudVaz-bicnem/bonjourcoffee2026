import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MediaMentions from "@/components/sections/MediaMentions";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos } from "@/data/photos";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "ぼんじゅうる珈琲について",
  description:
    "倉敷市玉島柏島の喫茶店「ぼんじゅうる珈琲」について。店名の由来は「よい一日を」。毎日の生活の中で、ほっと一息つける場所をつくりたいという想いから、2026年7月に玉島でオープンしました。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "ぼんじゅうる珈琲について",
    description:
      "店名の由来は「よい一日を」。ほっと一息つける場所をつくりたいという想いから、2026年7月に玉島でオープンした喫茶店です。",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <div className="relative h-[52svh] min-h-[360px] w-full overflow-hidden">
        <Image
          src={photos.interior2.src}
          alt={photos.interior2.alt}
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-10 sm:pb-14">
            <p aria-hidden className="hero-fade font-en text-2xl text-orange-soft sm:text-3xl">
              About us
            </p>
            <h1 className="hero-fade mt-2 font-heading text-2xl font-bold leading-snug tracking-wide text-white [--hero-delay:0.15s] sm:text-4xl">
              ぼんじゅうる珈琲について
            </h1>
          </div>
        </div>
      </div>
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "ぼんじゅうる珈琲について", path: "/about" },
        ]}
      />

      {/* はじまり */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <Reveal>
          <SectionHeading en="Our story">
            一人ひとりに寄り添える店を
          </SectionHeading>
          <div className="mt-8 space-y-5 text-sm leading-loose text-espresso sm:text-base">
            <p>
              ぼんじゅうる珈琲の店主は、前職で喫茶店の運営に携わっていました。
              毎日カウンターに立つ中で少しずつ大きくなっていったのが、
              「もっとお客様一人ひとりに寄り添える、自分のお店を作りたい」という気持ちです。
            </p>
            <p>
              常連さんの「いつもの」を覚えていられる距離感。
              初めての方にも、気負わず入ってもらえる敷居の低さ。
              そんな店を自分の手でつくろうと独立し、{shop.openedAt}、
              岡山県倉敷市玉島柏島にぼんじゅうる珈琲をオープンしました。
            </p>
          </div>
        </Reveal>
      </section>

      {/* 店名の由来 */}
      <section className="grain bg-espresso py-16 text-ivory sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p aria-hidden className="font-en text-3xl text-orange-soft">
              Bonjour = よい一日を
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
              店名の由来
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-loose text-ivory/90 sm:text-base">
              <p>
                「ぼんじゅうる」は、フランス語のあいさつ「Bonjour（ボンジュール）」から。
                「よい一日を」という想いを込めて名付けました。
              </p>
              <p>
                朝の一杯で始まる一日も、夕方のひと休みで締めくくる一日も。
                この店に寄ってくれた人の一日が、少しでもよいものになりますように。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* どんな場所にしたいか */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Image
              src={photos.interior1.src}
              alt={photos.interior1.alt}
              width={photos.interior1.width}
              height={photos.interior1.height}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="h-auto w-full"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading en="Our place">
              地域に根付いた、玉島の喫茶店に
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                店内は、木のぬくもりとオレンジ色をアクセントにした、
                どこか懐かしい雰囲気。カウンター席とテーブル席があり、
                お一人でも、ご友人とでも、お子さま連れでも過ごしやすい空間です。
              </p>
              <p>
                玉島・柏島にお住まいの方はもちろん、
                お仕事や観光で近くを訪れた方にも「また来たい」と
                思ってもらえる、地域の喫茶店をめざしています。
              </p>
            </div>
            <Link
              href="/access"
              className="mt-8 inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              店舗情報・アクセスを見る
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <MediaMentions />
    </>
  );
}
