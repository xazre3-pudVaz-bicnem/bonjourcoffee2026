import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { menuCategories, menuNote, takeoutExamples, takeoutNote } from "@/data/menu";
import { photos, type Photo } from "@/data/photos";

export const metadata: Metadata = {
  title: "メニュー",
  description:
    "倉敷市玉島「ぼんじゅうる珈琲」のメニュー。ハンドドリップ珈琲、モーニング、バインミー、おにぎり、カレー、ホットケーキ、ケーキセットなど。テイクアウトにも対応しています。価格はすべて税込です。",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "メニュー｜ぼんじゅうる珈琲",
    description:
      "ハンドドリップ珈琲、モーニング、バインミー、おにぎり、カレー、ホットケーキ、ケーキセット。テイクアウトも。",
    url: "/menu",
  },
};

/** カテゴリごとの添え写真 */
const CATEGORY_PHOTOS: Record<string, Photo> = {
  morning: photos.morning,
  coffee: photos.coffeeCups,
  drink: photos.creamSoda,
  banhmi: photos.banhmiGroup,
  onigiri: photos.onigiri,
  lunch: photos.curry,
  hotcake: photos.hotcake,
  dessert: photos.cakeChocolate,
};

function Price({ price, priceNote }: { price: number | null; priceNote?: string }) {
  if (price === null) return null;
  return (
    <span className="shrink-0 text-sm font-medium text-orange-text sm:text-base">
      {price.toLocaleString()}円
      {priceNote ? (
        <span className="ml-2 text-xs font-normal text-wood-deep">{priceNote}</span>
      ) : null}
    </span>
  );
}

export default function MenuPage() {
  return (
    <>
      <PageHero
        en="Menu"
        title="メニュー"
        lead="ハンドドリップの珈琲から、モーニング、バインミー、おにぎり、ホットケーキまで。玉島の毎日に寄り添う、喫茶店の定番をそろえました。"
        photo={photos.banhmiSet}
      />
      <Breadcrumbs crumbs={[{ name: "ホーム", path: "/" }, { name: "メニュー", path: "/menu" }]} />

      {/* カテゴリ内リンク */}
      <nav aria-label="メニューカテゴリ" className="mx-auto max-w-6xl px-5 pt-8">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {menuCategories.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="text-orange-text underline-offset-4 hover:underline"
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-14 sm:space-y-28 sm:py-20">
        {menuCategories.map((category, i) => {
          const photo = CATEGORY_PHOTOS[category.id];
          return (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <div
                className={`grid gap-8 md:grid-cols-[2fr_3fr] md:gap-14 ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                {photo ? (
                  <Reveal className="[direction:ltr]">
                    <div className="relative aspect-[4/5] overflow-hidden md:sticky md:top-24">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 768px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>
                ) : null}
                <Reveal delay={0.08} className="[direction:ltr]">
                  <p aria-hidden className="font-en text-2xl text-orange-deep">
                    {category.nameEn}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-bold tracking-wide">
                    {category.name}
                  </h2>
                  <p className="mt-4 text-sm leading-loose text-espresso">
                    {category.lead}
                  </p>
                  <ul className="mt-6">
                    {category.items.map((item) => (
                      <li
                        key={item.name}
                        className="hairline-b flex items-baseline justify-between gap-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium sm:text-base">
                            {item.recommended ? (
                              <span className="mr-2 inline-block bg-orange px-1.5 py-0.5 text-[10px] font-bold text-white align-[2px]">
                                おすすめ
                              </span>
                            ) : null}
                            {item.name}
                          </p>
                          {item.note ? (
                            <p className="mt-0.5 text-xs text-wood-deep">{item.note}</p>
                          ) : null}
                        </div>
                        <Price price={item.price} priceNote={item.priceNote} />
                      </li>
                    ))}
                  </ul>
                  {category.footnotes?.map((note) => (
                    <p key={note} className="mt-4 text-xs leading-relaxed text-wood-deep">
                      ※{note}
                    </p>
                  ))}
                </Reveal>
              </div>
            </section>
          );
        })}

        {/* テイクアウト */}
        <section id="takeout" className="grain scroll-mt-24 bg-ivory-deep px-6 py-10 sm:px-10 sm:py-14">
          <p aria-hidden className="font-en text-2xl text-orange-deep">
            Takeout
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold tracking-wide">
            テイクアウト
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-loose text-espresso">
            {takeoutNote}
          </p>
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
            {takeoutExamples.map((item) => (
              <li
                key={item.name}
                className="hairline-b flex items-baseline justify-between gap-4 py-3"
              >
                <p className="text-sm font-medium">{item.name}</p>
                <Price price={item.price} />
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs leading-relaxed text-wood-deep">※{menuNote}</p>
      </div>
    </>
  );
}
