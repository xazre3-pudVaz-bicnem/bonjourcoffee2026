import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRightIcon } from "@/components/ui/icons";
import { photos, type Photo } from "@/data/photos";

type Pick = {
  name: string;
  price: string;
  caption: string;
  photo: Photo;
};

/** 価格は src/data/menu.ts と同じ確定値のみ表示 */
const PICKS: Pick[] = [
  {
    name: "照り焼きたまごバインミー",
    price: "790円",
    caption: "香ばしい照り焼きチキンとゆで卵。一番人気のバインミーです。",
    photo: photos.banhmiTeriyaki,
  },
  {
    name: "おにぎり 卵黄そぼろ",
    price: "450円",
    caption: "喫茶店では少しめずらしい、種類豊富なおにぎりの看板メニュー。",
    photo: photos.onigiriTamago,
  },
  {
    name: "昔ながらのホットケーキ",
    price: "テイクアウト2枚 790円",
    caption:
      "銅板でじっくり焼き上げる、どこか懐かしい甘さ。※テイクアウトはホイップクリームが付きません。",
    photo: photos.hotcakePlain,
  },
];

export default function RecommendSection() {
  return (
    <section className="grain bg-ivory-deep py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading en="Recommend" align="center">
            おすすめメニュー
          </SectionHeading>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {PICKS.map((pick, i) => (
            <Reveal key={pick.name} delay={i * 0.1} as="figure">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={pick.photo.src}
                  alt={pick.photo.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="font-heading text-lg font-bold">
                  {pick.name}
                  <span className="ml-2 text-sm font-medium text-orange-text">
                    {pick.price}
                  </span>
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-espresso">
                  {pick.caption}
                </p>
              </figcaption>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 border-b border-orange-deep pb-1 text-sm font-medium text-orange-text transition-colors hover:text-orange-deep"
          >
            メニューをすべて見る
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
