type Props = {
  /** 英語の飾り（手書き風フォント） */
  en: string;
  /** 見出し本体 */
  children: React.ReactNode;
  /** 見出しレベル（既定は h2） */
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  /** 暗い背景に載せる場合 */
  tone?: "light" | "dark";
  className?: string;
};

export default function SectionHeading({
  en,
  children,
  as = "h2",
  align = "left",
  tone = "light",
  className,
}: Props) {
  const Tag = as;
  return (
    <div
      className={`${align === "center" ? "text-center" : ""} ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`font-en text-2xl sm:text-3xl ${
          tone === "dark" ? "text-orange-soft" : "text-orange-deep"
        }`}
      >
        {en}
      </span>
      <Tag
        className={`mt-1 font-heading text-2xl font-bold leading-snug tracking-wide sm:text-3xl ${
          tone === "dark" ? "text-ivory" : "text-ink"
        }`}
      >
        {children}
      </Tag>
    </div>
  );
}
