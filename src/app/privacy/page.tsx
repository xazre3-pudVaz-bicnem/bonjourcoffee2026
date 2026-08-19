import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PageHero from "@/components/ui/PageHero";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "ぼんじゅうる珈琲のプライバシーポリシー。当サイトにおける個人情報の取り扱い、アクセス解析、外部サービスの利用について定めています。",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero en="Privacy policy" title="プライバシーポリシー" />
      <Breadcrumbs
        crumbs={[
          { name: "ホーム", path: "/" },
          { name: "プライバシーポリシー", path: "/privacy" },
        ]}
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <p className="text-sm leading-loose text-espresso">
          {shop.name}（以下「当店」）は、当店の運営するWebサイト（以下「当サイト」）における個人情報の取り扱いについて、以下のとおり定めます。
        </p>

        <section className="mt-10">
          <h2 className="font-heading text-lg font-bold">個人情報の取得と利用目的</h2>
          <p className="mt-3 text-sm leading-loose text-espresso">
            当店は、お電話でのお問い合わせなどを通じてお客様の情報をお預かりする場合があります。取得した情報は、お問い合わせへの対応およびご連絡のためにのみ利用し、ご本人の同意なく第三者に提供することはありません（法令に基づく場合を除く）。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-lg font-bold">アクセス解析について</h2>
          <p className="mt-3 text-sm leading-loose text-espresso">
            当サイトでは、サイトの改善のためにアクセス解析ツールを利用する場合があります。これらのツールはCookieなどを利用して匿名のトラフィックデータを収集することがありますが、個人を特定する情報は含まれません。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-lg font-bold">外部サービスについて</h2>
          <p className="mt-3 text-sm leading-loose text-espresso">
            当サイトには、Googleマップの埋め込みやInstagramへのリンクなど、外部サービスが含まれています。これらのサービスにおける個人情報の取り扱いは、各サービス提供者のプライバシーポリシーに従います。
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-lg font-bold">お問い合わせ</h2>
          <p className="mt-3 text-sm leading-loose text-espresso">
            本ポリシーに関するお問い合わせは、お電話（{shop.tel}）にてお願いいたします。
          </p>
        </section>

        <p className="mt-12 text-xs text-wood-deep">制定日：2026年8月</p>
      </div>
    </>
  );
}
