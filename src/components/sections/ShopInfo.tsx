import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GoogleMap from "@/components/sections/GoogleMap";
import { InstagramIcon, PhoneIcon } from "@/components/ui/icons";
import { shop } from "@/data/shop";

/** 店舗情報＋Google Map。TOPとアクセスページで共用 */
export default function ShopInfo({ headingLevel = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "店名", value: shop.name },
    { label: "住所", value: shop.address },
    {
      label: "電話番号",
      value: (
        <a
          href={shop.telLink}
          className="inline-flex items-center gap-1.5 text-orange-text underline-offset-4 hover:underline"
        >
          <PhoneIcon className="h-4 w-4" />
          {shop.tel}
        </a>
      ),
    },
    {
      label: "営業時間",
      value: `${shop.hours}（ラストオーダー ${shop.lastOrder}）`,
    },
    {
      label: "定休日",
      value: (
        <>
          {shop.closed}
          <span className="block text-xs text-wood-deep">※{shop.closedNote}</span>
        </>
      ),
    },
    { label: "モーニング", value: shop.morningHours },
    { label: "ランチ", value: shop.lunchHours },
    { label: "駐車場", value: shop.parking },
    {
      label: "Instagram",
      value: (
        <a
          href={shop.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-orange-text underline-offset-4 hover:underline"
        >
          <InstagramIcon className="h-4 w-4" />
          {shop.instagramId}
        </a>
      ),
    },
  ];

  return (
    <section className="grain bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading en="Shop info" as={headingLevel} align="center">
            店舗情報
          </SectionHeading>
        </Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-10">
          <Reveal>
            <dl>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="hairline-b grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 text-sm sm:text-base"
                >
                  <dt className="font-medium text-wood-deep">{row.label}</dt>
                  <dd className="leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <GoogleMap />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
