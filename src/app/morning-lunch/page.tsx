import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos } from "@/data/photos";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "モーニング・ランチ｜玉島で朝ごはんとお昼ごはん",
  description:
    "倉敷市玉島「ぼんじゅうる珈琲」のモーニング（8:00〜11:00）とランチ（11:00〜14:00）。おにぎり・バインミー・ホットケーキから選べる朝ごはんと、カレーやバインミーセットのお昼ごはん。珈琲と一緒にどうぞ。",
  alternates: { canonical: "/morning-lunch" },
  openGraph: {
    title: "モーニング・ランチ｜ぼんじゅうる珈琲",
    description:
      "モーニング8:00〜11:00、ランチ11:00〜14:00。おにぎり・バインミー・ホットケーキの朝ごはんと、喫茶店らしいお昼ごはん。",
    url: "/morning-lunch",
  },
};

export default function MorningLunchPage() {
  return (
    <>
      <PageHero
        en="Morning &amp; Lunch"
        title="モーニング・ランチ"
        lead={`朝は${shop.morningHours}、お昼は${shop.lunchHours}。時間帯によって違う楽しみ方ができるのも、朝から開いている喫茶店ならではです。`}
        photo={photos.morning}
      />
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "モーニング・ランチ", path: "/morning-lunch" },
        ]}
      />

      {/* モーニング */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Image
              src={photos.morning.src}
              alt={photos.morning.alt}
              width={photos.morning.width}
              height={photos.morning.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Image
                src={photos.morningToast.src}
                alt={photos.morningToast.alt}
                width={photos.morningToast.width}
                height={photos.morningToast.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="h-auto w-full"
              />
              <Image
                src={photos.hotcakePlain.src}
                alt={photos.hotcakePlain.alt}
                width={photos.hotcakePlain.width}
                height={photos.hotcakePlain.height}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="aspect-[3/2] h-auto w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading en="Morning 8:00 - 11:00">
              玉島の朝は、選べるモーニングから
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                モーニングは朝8時から11時まで。おにぎり、バインミートースト、モーニングバインミー、ホットケーキの中から、その日の気分で選べます。いずれもドリンク付きで、690円からご用意しています。
              </p>
              <p>
                おにぎりは塩・梅・おかかなどの定番から、卵黄そぼろまで十数種類。「朝からしっかりごはん派」も「軽くパン派」も、どちらも満足できる朝ごはんです。
              </p>
            </div>
            <Link
              href="/menu#morning"
              className="mt-8 inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              モーニングメニューを見る
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ランチ */}
      <section className="grain bg-paper py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-16">
          <Reveal className="order-2 md:order-1">
            <SectionHeading en="Lunch 11:00 - 14:00">
              お昼は、喫茶店らしいごはんを
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                ランチは11時から14時まで。唐揚げカレーやビーフカレー、ポテトとドリンクが付くバインミーセットなど、喫茶店らしいお昼ごはんをご用意しています。
              </p>
              <p>
                バインミーはベトナム生まれのサンドイッチ。昔ながらの喫茶店に、少し新しい味がある。そんな取り合わせも、当店らしさのひとつです。
              </p>
            </div>
            <Link
              href="/menu#banhmi"
              className="mt-8 inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              バインミー・ランチメニューを見る
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <div className="grid grid-cols-[3fr_2fr] gap-3">
              <Image
                src={photos.curry.src}
                alt={photos.curry.alt}
                width={photos.curry.width}
                height={photos.curry.height}
                sizes="(min-width: 768px) 30vw, 60vw"
                className="h-auto w-full"
              />
              <div className="relative overflow-hidden">
                <Image
                  src={photos.banhmiTeriyaki.src}
                  alt={photos.banhmiTeriyaki.alt}
                  fill
                  sizes="(min-width: 768px) 20vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* カフェタイム */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Image
              src={photos.hotcake.src}
              alt={photos.hotcake.alt}
              width={photos.hotcake.width}
              height={photos.hotcake.height}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading en={`Cafe time - ${shop.lastOrder} L.O.`}>
              午後は、甘いものと珈琲で
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                お昼のあとは、夕方までゆっくりできるカフェタイム。銅板でじっくり焼き上げるホットケーキや、ケーキセット、パフェを、ハンドドリップの珈琲と一緒にどうぞ。
              </p>
              <p>
                営業は{shop.hours}（ラストオーダー{shop.lastOrder}）。買い物帰りや、沙美海岸方面へのドライブの途中のひと休みにもご利用ください。
              </p>
            </div>
            <Link
              href="/menu#hotcake"
              className="mt-8 inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              ホットケーキ・デザートを見る
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
