import Reveal from "@/components/ui/Reveal";
import { ExternalIcon } from "@/components/ui/icons";
import { shop } from "@/data/shop";

/** メディア掲載。短い紹介＋外部リンクのみ（本文転載はしない） */
export default function MediaMentions() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <Reveal className="hairline-b flex flex-col gap-4 border-t border-ink/10 py-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-sm font-bold tracking-wide text-wood-deep">
          Media｜掲載情報
        </h2>
        <ul className="flex flex-col gap-2 sm:flex-row sm:gap-8">
          {shop.media.map((m) => (
            <li key={m.url}>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-espresso underline-offset-4 hover:text-orange-deep hover:underline"
              >
                {m.name} にご紹介いただきました
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
