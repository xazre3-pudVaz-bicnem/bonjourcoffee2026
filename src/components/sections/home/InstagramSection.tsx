import Reveal from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/icons";
import { shop } from "@/data/shop";

/**
 * Instagram導線。APIを使わず、安定して表示できるリンク型。
 * 営業カレンダーなど最新情報がInstagramにあることを伝える。
 */
export default function InstagramSection() {
  return (
    <section className="grain bg-orange-soft/60 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p aria-hidden className="font-en text-3xl text-orange-deep">
            Instagram
          </p>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            日々のことは、Instagramで
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-loose text-espresso sm:text-base">
            営業日のカレンダーや、季節のメニュー、お店の日々の様子は
            公式Instagramでお知らせしています。
          </p>
          <a
            href={shop.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 bg-espresso px-7 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-ink"
          >
            <InstagramIcon className="h-5 w-5" />
            <span>{shop.instagramId} をフォローする</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
