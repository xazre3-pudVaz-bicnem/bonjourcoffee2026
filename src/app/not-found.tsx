import Link from "next/link";
import { CupIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="grain flex min-h-[60svh] flex-col items-center justify-center px-5 py-24 text-center">
      <CupIcon className="h-10 w-10 text-orange" />
      <p aria-hidden className="mt-4 font-en text-4xl text-orange-deep">
        404
      </p>
      <h1 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
        ページが見つかりません
      </h1>
      <p className="mt-4 max-w-md text-sm leading-loose text-espresso">
        お探しのページは移動したか、削除された可能性があります。
        よろしければ、珈琲でも飲みながらトップページからお探しください。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center bg-espresso px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-ink"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
