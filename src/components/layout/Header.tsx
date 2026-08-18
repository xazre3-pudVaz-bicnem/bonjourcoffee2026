"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { shop } from "@/data/shop";
import { InstagramIcon, PhoneIcon } from "@/components/ui/icons";

/** モバイルメニュー内のリンク。タップでメニューを閉じる */
function closeOnNavigate(setOpen: (v: boolean) => void) {
  return () => setOpen(false);
}

const NAV = [
  { href: "/menu", label: "メニュー" },
  { href: "/coffee", label: "珈琲へのこだわり" },
  { href: "/morning-lunch", label: "モーニング・ランチ" },
  { href: "/about", label: "ぼんじゅうる珈琲について" },
  { href: "/access", label: "店舗情報・アクセス" },
  { href: "/blog", label: "ブログ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = closeOnNavigate(setOpen);

  // メニュー表示中は背景スクロールを止める
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-baseline gap-2 font-heading text-lg font-bold tracking-wide text-ink"
        >
          <span>ぼんじゅうる珈琲</span>
          <span aria-hidden className="font-en text-base text-orange-deep">
            Bonjour coffee
          </span>
        </Link>

        {/* PCナビ */}
        <nav aria-label="メイン" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-colors hover:text-orange-deep ${
                pathname?.startsWith(item.href) ? "text-orange-text" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={shop.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram（新しいタブで開く）"
            className="text-ink transition-colors hover:text-orange-deep"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={shop.telLink}
            className="flex items-center gap-1.5 bg-orange px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-deep"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>{shop.tel}</span>
          </a>
        </nav>

        {/* モバイル：電話とメニュー開閉 */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={shop.telLink}
            aria-label={`電話をかける ${shop.tel}`}
            className="flex h-10 w-10 items-center justify-center bg-orange text-white"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border border-ink/20"
          >
            <span
              className={`h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span className={`h-px w-5 bg-ink ${open ? "hidden" : ""}`} />
            <span
              className={`h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* モバイルナビ */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="メイン"
          className="grain fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-ivory lg:hidden"
        >
          <ul className="px-5 py-6">
            {NAV.map((item) => (
              <li key={item.href} className="hairline-b">
                <Link
                  href={item.href}
                  onClick={close}
                  className="block py-4 font-heading text-base font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-3 px-5 pb-10">
            <a
              href={shop.telLink}
              className="flex items-center justify-center gap-2 bg-orange px-4 py-3.5 font-medium text-white"
            >
              <PhoneIcon className="h-5 w-5" />
              <span>{shop.tel}</span>
            </a>
            <a
              href={shop.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-ink/25 px-4 py-3.5 text-ink"
            >
              <InstagramIcon className="h-5 w-5" />
              <span>Instagram</span>
            </a>
            <p className="pt-2 text-center text-xs text-wood-deep">
              営業時間 {shop.hours}／定休日 {shop.closed}
            </p>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
