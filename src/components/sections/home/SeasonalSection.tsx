import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { seasonalCategory } from "@/data/menu";
import { photos } from "@/data/photos";

/**
 * 期間限定メニューのお知らせ。
 * menu.ts の seasonalCategory を null にすれば自動的に非表示になる。
 */
export default function SeasonalSection() {
  if (!seasonalCategory) return null;
  const item = seasonalCategory.items[0];

  return (
    <section className="grain bg-orange-soft/60 py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 md:grid-cols-[2fr_3fr] md:gap-14">
        <Reveal>
          <Image
            src={photos.mentaiFrance.src}
            alt={photos.mentaiFrance.alt}
            width={photos.mentaiFrance.width}
            height={photos.mentaiFrance.height}
            sizes="(min-width: 768px) 35vw, 100vw"
            className="h-auto w-full"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <p aria-hidden className="font-en text-2xl text-orange-deep sm:text-3xl">
            Seasonal
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-wide sm:text-3xl">
            期間限定「{item.name}」はじめました
          </h2>
          <p className="mt-5 text-sm leading-loose text-espresso sm:text-base">
            明太子のペーストをたっぷり塗って、香ばしく焼き上げたフランスパンです。単品590円（税込）。淹れたての珈琲と一緒に、ぜひ一度お試しください。10月末までの予定です。
          </p>
          <Link
            href="/menu#seasonal"
            className="mt-7 inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
          >
            期間限定メニューを見る
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
