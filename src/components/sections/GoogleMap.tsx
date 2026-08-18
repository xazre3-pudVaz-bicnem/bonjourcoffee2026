import { ExternalIcon } from "@/components/ui/icons";
import { shop } from "@/data/shop";

/** Google Map 埋め込み（APIキー不要の output=embed 方式） */
export default function GoogleMap() {
  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink/10">
        <iframe
          src={shop.googleMapsEmbedUrl}
          title={`${shop.name}の地図`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <a
        href={shop.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm text-orange-text underline-offset-4 hover:underline"
      >
        Googleマップで見る
        <ExternalIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
