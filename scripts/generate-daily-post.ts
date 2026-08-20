/**
 * 毎日1記事を Claude API で自動生成し、content/blog/ に Markdown で保存します。
 * GitHub Actions（.github/workflows/daily-blog.yml）から実行されます。
 *
 * 実行:  npx tsx scripts/generate-daily-post.ts
 * 必要な環境変数:
 *   - ANTHROPIC_API_KEY（必須）
 *   - ANTHROPIC_MODEL（任意。未設定なら Haiku を使用）
 *
 * 方針:
 *   - コスト削減のためデフォルトは claude-haiku-4-5
 *   - トピックプールから未使用のテーマを選び、重複を避ける
 *   - 既存記事の title/slug/keywords/description を読み込み、
 *     類似度の高い記事は保存せずに失敗させる（カニバリ防止）
 *   - 店舗事実は下記 SHOP_FACTS のみ参照し、それ以外は書かない（捏造防止）
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

// ---- 設定 -------------------------------------------------------------
const DEFAULT_MODEL = "claude-haiku-4-5";
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * 記事内で参照してよい店舗事実（これ以外の店舗情報は書かせない）。
 * 変更があったら src/data/shop.ts / menu.ts と合わせて更新すること。
 */
const SHOP_FACTS = [
  "店名：ぼんじゅうる珈琲（岡山県倉敷市玉島柏島6988-3の喫茶店）",
  "2026年7月にオープン",
  "営業時間：8:00〜18:00（ラストオーダー17:30）／定休日：水曜日ほか不定休（最新はInstagram @bonjourcoffee2026 で告知）",
  "モーニング：8:00〜11:00（おにぎり・バインミー・ホットケーキなどから選べる。ドリンク付き690円〜）",
  "ランチ：11:00〜14:00（カレー、バインミーセットなど）",
  "珈琲：注文ごとに豆を挽き、一杯ずつハンドドリップで抽出。ブレンド560円〜（テイクアウトは460円〜）。アイスコーヒーは店内仕込み",
  "フード：おにぎり（塩・梅・おかか・卵黄そぼろ等 十数種類）、バインミー（照り焼きたまご790円が一番人気）、カレー、銅板で焼く昔ながらのホットケーキ、ケーキセット、パフェ、クリームソーダ",
  "テイクアウト対応（珈琲・おにぎり・バインミー・ホットケーキなど）",
  "店内：木のぬくもりとオレンジ色がアクセント。カウンター席とテーブル席。一人でも家族連れでも入りやすい",
  "駐車場：店舗西側に約10台分",
] as const;

/** 内部リンク（実在するページのみ） */
const INTERNAL_LINKS = [
  { url: "/coffee", label: "珈琲へのこだわり" },
  { url: "/morning-lunch", label: "モーニング・ランチの案内" },
  { url: "/menu", label: "メニュー" },
  { url: "/about", label: "ぼんじゅうる珈琲について" },
  { url: "/access", label: "店舗情報・アクセス" },
];

// ---- トピックプール ----------------------------------------------------
//
// 【重要・キーワードのすみ分け】
//  コアキーワードは固定ページに集約する。
//   - TOP …「玉島 カフェ」
//   - /coffee …「玉島 コーヒー」「玉島 ハンドドリップ」
//   - /morning-lunch …「玉島 モーニング」「玉島 ランチ」
//  よってブログは周辺・関連ロングテールのみを扱い、
//  「玉島 カフェ」の言い換え記事は作らない。
//  新テーマを足すときは、既存テーマ・固定ページと検索意図が
//  重ならないことを確認すること。
type Topic = {
  id: string;
  theme: string;
  slugBase: string;
  category: string;
};

const TOPICS: Topic[] = [
  // --- 珈琲のはなし（初心者向け・商品知識） ---
  { id: "hand-drip-toha", theme: "ハンドドリップ珈琲とは？ 淹れ方の特徴と魅力をやさしく解説", slugBase: "hand-drip-toha", category: "珈琲のはなし" },
  { id: "ice-coffee-shikomi", theme: "店内で仕込むアイスコーヒーのおいしさ", slugBase: "ice-coffee-shikomi", category: "珈琲のはなし" },
  { id: "blend-american-chigai", theme: "ブレンドとアメリカンはどう違う？", slugBase: "blend-american-chigai", category: "珈琲のはなし" },
  { id: "coffee-kaori-tanoshimu", theme: "珈琲豆の香りを楽しむ方法", slugBase: "coffee-kaori-tanoshimu", category: "珈琲のはなし" },
  { id: "caffeine-less", theme: "カフェインレス珈琲という選択肢", slugBase: "caffeine-less", category: "珈琲のはなし" },
  { id: "napoli-coffee", theme: "ナポリ珈琲ってどんな珈琲？", slugBase: "napoli-coffee", category: "珈琲のはなし" },
  { id: "coffee-jelly-kissaten", theme: "喫茶店のコーヒーゼリーが愛される理由", slugBase: "coffee-jelly-kissaten", category: "珈琲のはなし" },

  // --- モーニング・ランチ ---
  { id: "asa-cafe-tanoshimi", theme: "玉島で朝カフェを楽しむなら", slugBase: "asa-cafe-tanoshimi", category: "モーニング・ランチ" },
  { id: "morning-tanoshimikata", theme: "喫茶店モーニングの楽しみ方", slugBase: "morning-tanoshimikata", category: "モーニング・ランチ" },
  { id: "onigiri-morning", theme: "朝ごはんにおにぎりという選択", slugBase: "onigiri-morning", category: "モーニング・ランチ" },
  { id: "banhmi-toha", theme: "バインミーとは？ ベトナム生まれのサンドイッチ入門", slugBase: "banhmi-toha", category: "モーニング・ランチ" },
  { id: "kissaten-curry", theme: "喫茶店のカレーがなぜか恋しくなる話", slugBase: "kissaten-curry", category: "モーニング・ランチ" },
  { id: "yukkuri-lunch", theme: "玉島でゆっくりランチタイムを過ごす", slugBase: "yukkuri-lunch", category: "モーニング・ランチ" },
  { id: "onigiri-coffee", theme: "おにぎりと珈琲は意外と合う", slugBase: "onigiri-coffee", category: "モーニング・ランチ" },

  // --- カフェでの過ごし方 ---
  { id: "hitori-cafe", theme: "一人カフェの過ごし方", slugBase: "hitori-cafe", category: "カフェでの過ごし方" },
  { id: "gogo-cafe-time", theme: "午後のカフェタイムのすすめ", slugBase: "gogo-cafe-time", category: "カフェでの過ごし方" },
  { id: "hotcake-jikan", theme: "ホットケーキが焼けるまでの10分間", slugBase: "hotcake-jikan", category: "カフェでの過ごし方" },
  { id: "kazoku-kissaten", theme: "家族で喫茶店に行くという休日", slugBase: "kazoku-kissaten", category: "カフェでの過ごし方" },
  { id: "cream-soda-kimochi", theme: "クリームソーダを頼むときの気持ち", slugBase: "cream-soda-kimochi", category: "カフェでの過ごし方" },
  { id: "kissaten-counter", theme: "カウンター席のいいところ", slugBase: "kissaten-counter", category: "カフェでの過ごし方" },
  { id: "coffee-hotcake", theme: "珈琲とホットケーキという定番の組み合わせ", slugBase: "coffee-hotcake", category: "カフェでの過ごし方" },

  // --- 玉島・倉敷のこと ---
  { id: "tamashima-drive-cafe", theme: "玉島ドライブの途中に立ち寄るカフェ休憩", slugBase: "tamashima-drive-cafe", category: "玉島・倉敷のこと" },
  { id: "tamashima-takeout", theme: "玉島でテイクアウトして外で楽しむ", slugBase: "tamashima-takeout", category: "玉島・倉敷のこと" },
  { id: "kissaten-bunka", theme: "昔ながらの喫茶店文化について思うこと", slugBase: "kissaten-bunka", category: "玉島・倉敷のこと" },

  // --- お店のこと ---
  { id: "kissaten-erabikata", theme: "居心地のいい喫茶店の見つけ方", slugBase: "kissaten-erabikata", category: "お店のこと" },
  { id: "takeout-katsuyou", theme: "喫茶店テイクアウトの活用シーン", slugBase: "takeout-katsuyou", category: "お店のこと" },
  { id: "douban-hotcake", theme: "銅板で焼くホットケーキの魅力", slugBase: "douban-hotcake", category: "お店のこと" },
];

// ---- ユーティリティ ---------------------------------------------------
function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stamp(): string {
  return today().replace(/-/g, "");
}

type ExistingPost = {
  topicId: string;
  date: string;
  title: string;
  slug: string;
  description: string;
  keywords: string[];
};

/** 既存記事のメタ情報を読み込む（重複・類似判定に使用） */
function readExistingPosts(): ExistingPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf-8"));
      return {
        topicId: String(data.topicId ?? ""),
        date: String(data.date ?? ""),
        title: String(data.title ?? ""),
        slug: String(data.slug ?? file.replace(/\.md$/, "")),
        description: String(data.description ?? ""),
        keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
      };
    });
}

/** 未使用トピックを優先し、全て使用済みなら最も古いものを選ぶ */
function pickTopic(existing: ExistingPost[]): { topic: Topic; fresh: boolean } {
  const used = new Map<string, string>();
  for (const p of existing) {
    if (p.topicId && (!used.has(p.topicId) || p.date > (used.get(p.topicId) ?? "")))
      used.set(p.topicId, p.date);
  }
  const unused = TOPICS.filter((t) => !used.has(t.id));
  if (unused.length > 0) {
    const idx = used.size % unused.length;
    return { topic: unused[idx], fresh: true };
  }
  const sorted = [...TOPICS].sort(
    (a, b) => (used.get(a.id) ?? "").localeCompare(used.get(b.id) ?? ""),
  );
  return { topic: sorted[0], fresh: false };
}

function uniqueSlug(base: string): string {
  if (!fs.existsSync(path.join(BLOG_DIR, `${base}.md`))) return base;
  return `${base}-${stamp()}`;
}

/** 文字バイグラムの Jaccard 類似度（0〜1）。タイトル同士の類似判定に使う */
function bigramSimilarity(a: string, b: string): number {
  const grams = (s: string) => {
    const t = s.replace(/\s/g, "");
    const set = new Set<string>();
    for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
    return set;
  };
  const ga = grams(a);
  const gb = grams(b);
  if (ga.size === 0 || gb.size === 0) return 0;
  let inter = 0;
  for (const g of ga) if (gb.has(g)) inter++;
  return inter / (ga.size + gb.size - inter);
}

/** モデル出力からJSONを取り出す（```フェンス等を除去） */
function extractJson(text: string): string {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) return fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

/** 本文の軽い整形（frontmatter・h1・余分なフェンスを除去） */
function cleanBody(body: string): string {
  let b = body.trim();
  b = b.replace(/^---[\s\S]*?---\s*/, "");
  b = b.replace(/^```(?:markdown|md)?\s*/i, "").replace(/```\s*$/i, "");
  b = b.replace(/^#\s+.*$/m, "").trim();
  return b;
}

// ---- メイン -----------------------------------------------------------
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ERROR: ANTHROPIC_API_KEY が設定されていません。");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  const existing = readExistingPosts();
  const { topic, fresh } = pickTopic(existing);
  const date = today();
  const slug = uniqueSlug(topic.slugBase);

  console.log("──────────────────────────────────────────────");
  console.log(`使用モデル (model)   : ${MODEL}`);
  console.log(`テーマ    (topic)    : ${topic.theme}`);
  console.log(`カテゴリ  (category) : ${topic.category}`);
  console.log(`slug                 : ${slug}`);
  console.log(`再執筆(全消化後)     : ${fresh ? "no" : "yes"}`);
  console.log("──────────────────────────────────────────────");

  const linkList = INTERNAL_LINKS.map((l) => `- ${l.label}: ${l.url}`).join("\n");
  const factList = SHOP_FACTS.map((f) => `- ${f}`).join("\n");
  const recentTitles = existing
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)
    .map((p) => `- ${p.title}`)
    .join("\n");

  const system = [
    "あなたは岡山県倉敷市玉島の喫茶店「ぼんじゅうる珈琲」の店主に代わってブログを書く、地域密着の編集者です。",
    "読者は、玉島・倉敷周辺でカフェや喫茶店の時間を楽しみたい人です。",
    "地域の喫茶店が自分たちの言葉で発信しているような、自然で温かい文章を書きます。次のルールを厳守してください。",
    "",
    "【文章のルール】",
    "- 日本語で執筆する。本文（frontmatterを除く）は1,800〜2,600文字程度",
    "- 見出しは ## (H2) と ### (H3) で構成し、H1(#)は使わない",
    "- 冒頭に短い導入、中盤に本文、最後に軽い「まとめ」を置く",
    "- 1記事1検索意図。与えられたテーマだけに絞って書く",
    "- 「いかがでしたでしょうか」「〜と言えるでしょう」は使用禁止",
    "- 「おすすめです！」「ぜひチェックしてみてください」の乱発禁止（各0〜1回まで）",
    "- 同じ結論の繰り返し、キーワードの不自然な詰め込み、大げさな表現は禁止",
    "- 根拠のない「No.1」「人気店」「話題」「絶品」などの表現は禁止",
    "- 地域名（玉島・玉島柏島・倉敷市・岡山県）は文脈に合うところで自然に使う。詰め込みは禁止",
    "",
    "【事実のルール（最重要）】",
    "- 店舗について書いてよい事実は、下記の「店舗の事実」リストにあるものだけ",
    "- リストにない商品名・価格・営業時間・定休日・設備・キャンペーン・イベント・口コミ・スタッフ情報・受賞歴・仕入先・珈琲豆の産地・焙煎方法・予約情報を創作することは絶対に禁止",
    "- 分からないことは書かない。一般論として書ける内容（珈琲の楽しみ方など）は一般論として書く",
    "- 玉島・倉敷の観光情報や周辺施設について、確実でない固有名詞・情報を創作しない。地域の話題は一般的な範囲にとどめる",
    "",
    "【店舗の事実】",
    factList,
    "",
    "【内部リンク】",
    "- 本文中に、文脈に合う内部リンクを2〜4個、Markdownリンク（[表示テキスト](URL)）で自然に挿入する",
    "- アンカーテキストは具体的にし、「こちら」は使わない。毎回同じ文言にしない",
    linkList,
    "",
    "【キーワードのすみ分け】",
    "- この記事はロングテール担当。「玉島 カフェ」を主題にした総合紹介記事にしない（それはトップページの役割）",
    "- 珈琲全般の総合解説は /coffee、モーニング・ランチの総合案内は /morning-lunch の役割。関連して触れる場合は深入りせずリンクする",
  ].join("\n");

  const user = [
    `今日の記事テーマ：「${topic.theme}」`,
    fresh
      ? ""
      : "※このテーマは過去に一度書いています。前回とは異なる切り口・見出し構成で、新しい観点から書き直してください。",
    "",
    "最近の記事タイトル（これらと似た内容・タイトルにしないこと）:",
    recentTitles || "（まだ記事はありません）",
    "",
    "次のJSON形式**のみ**を出力してください（前後に説明やコードフェンスを付けない）：",
    "{",
    '  "title": "28〜36文字程度の記事タイトル（テーマのキーワードを自然に含む・煽らない）",',
    '  "description": "100〜125文字のメタディスクリプション",',
    '  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4"],',
    '  "body": "Markdown本文（frontmatterやH1は含めない。## と ### の見出し、導入・本文・まとめ、内部リンクを含む1800〜2600字）"',
    "}",
  ].join("\n");

  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.7,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  let parsed: { title: string; description: string; keywords: string[]; body: string };
  try {
    parsed = JSON.parse(extractJson(text));
  } catch (e) {
    console.error("ERROR: モデル出力のJSON解析に失敗しました。");
    console.error(text.slice(0, 800));
    throw e;
  }

  const title = String(parsed.title ?? "").trim();
  const description = String(parsed.description ?? "").trim();
  const keywords = Array.isArray(parsed.keywords)
    ? parsed.keywords.map((t) => String(t).trim()).filter(Boolean).slice(0, 6)
    : [];
  const body = cleanBody(String(parsed.body ?? ""));

  if (!title || body.length < 500) {
    throw new Error(
      `生成結果が不十分です（title: ${title ? "有" : "無"} / 本文長: ${body.length}）`,
    );
  }

  // ---- カニバリ防止：既存記事とのタイトル類似度チェック ----
  for (const p of existing) {
    const sim = bigramSimilarity(title, p.title);
    if (sim >= 0.6) {
      throw new Error(
        `既存記事と類似度が高いため保存を中止しました（${sim.toFixed(2)}）: 「${p.title}」`,
      );
    }
  }

  const fileContent = matter.stringify(`\n${body}\n`, {
    title,
    slug,
    description,
    date,
    updatedAt: date,
    category: topic.category,
    keywords,
    // 記事個別の画像は生成しない。サイト共通OG画像を使用する
    image: "/og.jpg",
    author: "ぼんじゅうる珈琲",
    topicId: topic.id,
  });

  const outPath = path.join(BLOG_DIR, `${slug}.md`);
  fs.writeFileSync(outPath, fileContent, "utf-8");

  const bodyChars = body.replace(/\s/g, "").length;
  console.log("✓ 生成完了");
  console.log(`  ファイル (file)     : content/blog/${slug}.md`);
  console.log(`  タイトル (title)    : ${title}`);
  console.log(`  本文文字数 (chars)  : 約 ${bodyChars} 文字`);
  console.log(`  使用モデル (model)  : ${MODEL}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
