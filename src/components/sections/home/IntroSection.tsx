import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { photos } from "@/data/photos";
import { shop } from "@/data/shop";

/** 店舗紹介。TOPページのH1をここに置き、玉島・カフェの文脈を自然に伝える */
export default function IntroSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <div className="grid items-center gap-10 md:grid-cols-[5fr_4fr] md:gap-16">
        <Reveal>
          <p aria-hidden className="font-en text-3xl text-orange-deep">
            Bonjour !
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold leading-relaxed tracking-wide sm:text-3xl">
            倉敷市玉島のカフェ・喫茶店
            <br />
            「ぼんじゅうる珈琲」
          </h1>
          <div className="mt-6 space-y-4 text-sm leading-loose text-espresso sm:text-base">
            <p>
              ぼんじゅうる珈琲は、岡山県倉敷市玉島柏島にある小さな喫茶店です。
              {shop.openedAt}にオープンしました。
            </p>
            <p>
              一杯ずつハンドドリップで淹れる珈琲と、モーニング、ランチ、
              おにぎりやバインミー、ホットケーキ。
              お一人でも、ご友人とでも、ご家族でも。
              木のぬくもりを感じる店内で、思い思いの時間をお過ごしください。
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="relative">
          <Image
            src={photos.exterior.src}
            alt={photos.exterior.alt}
            width={photos.exterior.width}
            height={photos.exterior.height}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="h-auto w-full"
          />
        </Reveal>
      </div>
    </section>
  );
}
