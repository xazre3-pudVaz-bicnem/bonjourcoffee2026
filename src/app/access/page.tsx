import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ShopInfo from "@/components/sections/ShopInfo";
import JsonLd from "@/components/ui/JsonLd";
import { faqJsonLd, type FaqItem } from "@/lib/jsonld";
import { photos } from "@/data/photos";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "店舗情報・アクセス",
  description:
    "ぼんじゅうる珈琲の店舗情報。住所は岡山県倉敷市玉島柏島6988-3、営業時間8:00〜18:00、定休日は水曜日ほか不定休。店舗西側に駐車場あり。電話050-8883-6590。Googleマップ・よくある質問も掲載しています。",
  alternates: { canonical: "/access" },
  openGraph: {
    title: "店舗情報・アクセス｜ぼんじゅうる珈琲",
    description:
      "岡山県倉敷市玉島柏島6988-3。営業時間8:00〜18:00、定休日は水曜日ほか不定休。店舗西側に駐車場あり。",
    url: "/access",
  },
};

/** 確認できている事実だけをFAQにする。JSON-LDも同じデータから生成 */
const FAQ: FaqItem[] = [
  {
    question: "営業時間は何時から何時までですか？",
    answer: `営業時間は${shop.hours}（ラストオーダー${shop.lastOrder}）です。モーニングは${shop.morningHours}、ランチは${shop.lunchHours}にご提供しています。`,
  },
  {
    question: "定休日はいつですか？",
    answer: `定休日は${shop.closed}です。${shop.closedNote}`,
  },
  {
    question: "駐車場はありますか？",
    answer: shop.parking,
  },
  {
    question: "モーニングはありますか？",
    answer: `はい。${shop.morningHours}に、おにぎり・バインミー・ホットケーキなどから選べるモーニングをご用意しています。`,
  },
  {
    question: "ランチはありますか？",
    answer: `はい。${shop.lunchHours}に、カレーやバインミーセットなどのランチをご用意しています。`,
  },
  {
    question: "テイクアウトはできますか？",
    answer:
      "はい。珈琲などのドリンクのほか、おにぎり、バインミー、ホットケーキなどをテイクアウトしていただけます。",
  },
  {
    question: "一人でも利用できますか？",
    answer:
      "もちろんです。カウンター席がありますので、お一人でも気軽にお過ごしいただけます。",
  },
  {
    question: "Instagramはありますか？",
    answer: `公式Instagram（${shop.instagramId}）で営業日カレンダーやお知らせを発信しています。`,
  },
];

export default function AccessPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <PageHero
        en="Access"
        title="店舗情報・アクセス"
        lead={`${shop.address}。営業時間は${shop.hours}です。ご不明な点はお電話（${shop.tel}）またはInstagramでお気軽にどうぞ。`}
        photo={photos.exterior}
      />
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "店舗情報・アクセス", path: "/access" },
        ]}
      />

      <ShopInfo />

      {/* よくある質問 */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <Reveal>
          <SectionHeading en="FAQ" align="center">
            よくある質問
          </SectionHeading>
        </Reveal>
        <div className="mt-10">
          {FAQ.map((item, i) => (
            <Reveal key={item.question} delay={(i % 4) * 0.05}>
              <details className="hairline-b group py-4">
                <summary className="flex cursor-pointer list-none items-baseline gap-3 text-sm font-medium sm:text-base [&::-webkit-details-marker]:hidden">
                  <span aria-hidden className="font-en text-xl text-orange-deep">
                    Q
                  </span>
                  <span className="flex-1">{item.question}</span>
                  <span
                    aria-hidden
                    className="text-wood-deep transition-transform group-open:rotate-45"
                  >
                    ＋
                  </span>
                </summary>
                <p className="mt-3 pl-8 text-sm leading-loose text-espresso">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
