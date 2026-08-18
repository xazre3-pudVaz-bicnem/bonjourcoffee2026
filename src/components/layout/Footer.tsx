import Link from "next/link";
import { shop } from "@/data/shop";
import { InstagramIcon, PhoneIcon } from "@/components/ui/icons";

const FOOTER_NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/coffee", label: "Coffee" },
  { href: "/morning-lunch", label: "Morning & Lunch" },
  { href: "/about", label: "About" },
  { href: "/access", label: "Access" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="grain bg-espresso text-ivory">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-heading text-xl font-bold">{shop.name}</p>
            <p aria-hidden className="font-en text-lg text-orange-soft">
              Bonjour coffee
            </p>
            <address className="mt-5 space-y-1.5 text-sm not-italic leading-relaxed text-ivory/90">
              <p>{shop.address}</p>
              <p>営業時間 {shop.hours}</p>
              <p>
                定休日 {shop.closed}
                <span className="block text-xs text-ivory/70">
                  ※{shop.closedNote}
                </span>
              </p>
            </address>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={shop.telLink}
                className="flex items-center gap-2 border border-ivory/30 px-4 py-2.5 text-sm transition-colors hover:border-orange-soft hover:text-orange-soft"
              >
                <PhoneIcon className="h-4 w-4" />
                <span>{shop.tel}</span>
              </a>
              <a
                href={shop.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-ivory/30 px-4 py-2.5 text-sm transition-colors hover:border-orange-soft hover:text-orange-soft"
              >
                <InstagramIcon className="h-4 w-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <nav aria-label="フッター">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm md:grid-cols-1">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ivory/85 underline-offset-4 transition-colors hover:text-orange-soft hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-12 border-t border-ivory/15 pt-6 text-xs text-ivory/60">
          &copy; {new Date().getFullYear()} {shop.name}
        </p>
      </div>
    </footer>
  );
}
