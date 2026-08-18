import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos } from "@/data/photos";

/** 一杯ずつ丁寧に淹れる珈琲。写真を大きく、文章は少なく */
export default function CoffeeSection() {
  return (
    <section className="grain bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 md:grid-cols-[4fr_5fr] md:gap-16">
          <Reveal className="relative order-2 md:order-1">
            <Image
              src={photos.coffeeHot.src}
              alt={photos.coffeeHot.alt}
              width={photos.coffeeHot.width}
              height={photos.coffeeHot.height}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="h-auto w-full"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Image
                src={photos.coffeeBeans.src}
                alt={photos.coffeeBeans.alt}
                width={photos.coffeeBeans.width}
                height={photos.coffeeBeans.height}
                sizes="(min-width: 768px) 22vw, 50vw"
                className="h-auto w-full"
              />
              <Image
                src={photos.coffeeIce.src}
                alt={photos.coffeeIce.alt}
                width={photos.coffeeIce.width}
                height={photos.coffeeIce.height}
                sizes="(min-width: 768px) 22vw, 50vw"
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <SectionHeading en="Hand drip">
              一杯ずつ、丁寧に淹れる珈琲
            </SectionHeading>
            <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
              <p>
                ご注文をいただいてから豆を挽き、一杯ずつハンドドリップで抽出しています。
                お湯を注ぐたびにふくらむ豆の香りも、珈琲の楽しみのひとつです。
              </p>
              <p>
                アイスコーヒーも店内で仕込んだもの。
                毎日飲んでも飲み飽きない、日常の一杯をめざしています。
              </p>
            </div>
            <Link
              href="/coffee"
              className="mt-8 inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
            >
              珈琲へのこだわりを見る
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
