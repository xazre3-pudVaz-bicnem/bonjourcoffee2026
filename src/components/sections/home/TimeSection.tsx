import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos, type Photo } from "@/data/photos";
import { shop } from "@/data/shop";

type Band = {
  en: string;
  title: string;
  time: string;
  body: string;
  photo: Photo;
};

const BANDS: Band[] = [
  {
    en: "Morning",
    title: "モーニング",
    time: shop.morningHours,
    body: "おにぎり、バインミー、ホットケーキから選べる朝ごはん。漬物やスープ、ドリンクを添えて、一日のはじまりをゆっくりと。",
    photo: photos.morning,
  },
  {
    en: "Lunch",
    title: "ランチ",
    time: shop.lunchHours,
    body: "バインミーのセットやカレーなど、喫茶店らしいお昼ごはん。ご飯のあとには、淹れたての珈琲をどうぞ。",
    photo: photos.curry,
  },
  {
    en: "Cafe time",
    title: "カフェタイム",
    time: `〜18:00（ラストオーダー${shop.lastOrder}）`,
    body: "銅板で焼くホットケーキやケーキと一緒に、午後のひと休み。読書やおしゃべりの時間にも、ちょうどいい席があります。",
    photo: photos.hotcake,
  },
];

/** 時間帯ごとの過ごし方。横帯レイアウトでリズムをつける */
export default function TimeSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
      <Reveal>
        <SectionHeading en="Morning / Lunch / Cafe time" align="center">
          朝から夕方まで、それぞれの過ごし方
        </SectionHeading>
      </Reveal>
      <div className="mt-14 space-y-14 sm:space-y-20">
        {BANDS.map((band, i) => (
          <Reveal key={band.en}>
            <div
              className={`grid items-center gap-6 md:grid-cols-[3fr_2fr] md:gap-12 ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div className="[direction:ltr]">
                <Image
                  src={band.photo.src}
                  alt={band.photo.alt}
                  width={band.photo.width}
                  height={band.photo.height}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="h-auto w-full"
                />
              </div>
              <div className="[direction:ltr]">
                <p aria-hidden className="font-en text-2xl text-orange-deep">
                  {band.en}
                </p>
                <h3 className="mt-1 font-heading text-xl font-bold sm:text-2xl">
                  {band.title}
                  <span className="ml-3 text-sm font-medium text-wood-deep">
                    {band.time}
                  </span>
                </h3>
                <p className="mt-4 text-sm leading-loose text-espresso sm:text-base">
                  {band.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 text-center">
        <Link
          href="/morning-lunch"
          className="inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
        >
          モーニング・ランチについて詳しく
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}
