import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

/** 店名に込めた想い。暗い面で静かに読ませる */
export default function StorySection() {
  return (
    <section className="grain bg-espresso py-20 text-ivory sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <p aria-hidden className="font-en text-3xl text-orange-soft">
            Bonjour = よい一日を
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold leading-relaxed sm:text-3xl">
            店名に込めた想い
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-loose text-ivory/90 sm:text-base">
            <p>
              「ぼんじゅうる」は、フランス語のあいさつ「Bonjour」から。
              <br />
              「よい一日を」という想いを込めて名付けました。
            </p>
            <p>
              毎日の生活の中で、ほっと一息つける場所でありたい。
              <br />
              帰り道が、来たときより少し軽くなっていたら嬉しい。
              <br />
              そんな気持ちで、今日も珈琲を淹れています。
            </p>
          </div>
          <Link
            href="/about"
            className="mt-10 inline-flex items-center gap-2 border-b border-orange-soft pb-1 text-sm font-medium text-orange-soft transition-colors hover:text-white"
          >
            ぼんじゅうる珈琲について
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
