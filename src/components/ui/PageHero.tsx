import Image from "next/image";
import type { Photo } from "@/data/photos";

type Props = {
  en: string;
  title: string;
  lead?: string;
  photo?: Photo;
};

/** 下層ページ共通のページ見出し。写真は右側に小さく敷く */
export default function PageHero({ en, title, lead, photo }: Props) {
  return (
    <div className="grain overflow-hidden bg-ivory-deep">
      <div className="mx-auto flex max-w-6xl items-stretch gap-8 px-5">
        <div className="flex-1 py-14 sm:py-20">
          <p aria-hidden className="font-en text-3xl text-orange-deep sm:text-4xl">
            {en}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold leading-snug tracking-wide sm:text-4xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-espresso sm:text-base">
              {lead}
            </p>
          ) : null}
        </div>
        {photo ? (
          <div className="relative hidden w-64 shrink-0 md:block lg:w-80">
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
