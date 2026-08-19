import Image from "next/image";
import { photos } from "@/data/photos";

/**
 * HERO：写真を画面いっぱいに見せる。CTAボタンは置かない。
 * 文字は最小限、左下に静かに載せる。
 */
export default function Hero() {
  return (
    <section aria-label="メインビジュアル" className="relative h-[82svh] min-h-[480px] w-full overflow-hidden">
      <Image
        src={photos.hero.src}
        alt={photos.hero.alt}
        fill
        priority
        quality={82}
        sizes="100vw"
        className="object-cover object-[38%_center]"
      />
      {/* 文字の可読性のための控えめなグラデーション */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-6xl px-5 pb-12 sm:pb-16">
          <p
            aria-hidden
            className="hero-fade font-en text-2xl text-orange-soft sm:text-3xl"
          >
            Bonjour coffee
          </p>
          <p className="hero-fade mt-2 font-heading text-3xl font-bold leading-snug tracking-wider text-white [--hero-delay:0.15s] sm:text-5xl">
            今日に、ほっと一息。
          </p>
          <p className="hero-fade mt-4 max-w-md text-sm leading-relaxed text-white/90 [--hero-delay:0.3s] sm:text-base">
            一杯ずつ丁寧に淹れる珈琲と、
            <br />
            朝から夕方まで過ごせる玉島の喫茶店。
          </p>
        </div>
      </div>
    </section>
  );
}
