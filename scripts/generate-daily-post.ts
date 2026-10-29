/**
 * 毎日1記事を Claude API で自動生成し、content/blog/ に Markdown で保存します。
 * GitHub Actions（.github/workflows/daily-blog.yml）から実行されます。
 *
 * 実行:  npx tsx scripts/generate-daily-post.ts
 *        DRY_RUN=1 npx tsx scripts/generate-daily-post.ts（APIを呼ばず、選ばれるテーマとプロンプトを表示）
 * 必要な環境変数:
 *   - ANTHROPIC_API_KEY（必須。DRY_RUN 時は不要）
 *   - ANTHROPIC_MODEL（任意。未設定なら Haiku を使用）
 *
 * 方針:
 *   - コスト削減のためデフォルトは claude-haiku-4-5
 *   - トピックプールから未使用のテーマを選び、重複を避ける
 *   - 季節テーマは対象月だけ選び、時期を逃さないよう優先する
 *   - 既存記事の title/slug/keywords/description を読み込み、
 *     類似度の高い記事は保存せずに失敗させる（カニバリ防止）
 *   - 店舗事実は SHOP_FACTS と src/data/menu.ts、地域の事実は LOCAL_FACTS のみ参照し、
 *     それ以外は書かない（捏造防止）
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { menuCategories, takeoutExamples, type MenuItem } from "../src/data/menu";

// ---- 設定 -------------------------------------------------------------
const DEFAULT_MODEL = "claude-haiku-4-5";
const MODEL = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * 記事内で参照してよい店舗事実（これ以外の店舗情報は書かせない）。
 * メニューと価格は src/data/menu.ts から自動で読み込むため、ここには書かない。
 * 営業時間などを変えたときは src/data/shop.ts と合わせて更新すること。
 */
const SHOP_FACTS = [
  "店名：ぼんじゅうる珈琲（岡山県倉敷市玉島柏島6988-3の喫茶店）",
  "2026年7月にオープン",
  "営業時間：8:00〜18:00（ラストオーダー17:30）／定休日：水曜日ほか不定休（最新はInstagram @bonjourcoffee2026 で告知）",
  "モーニング：8:00〜11:00（おにぎり・バインミー・ホットケーキなどから選べる。ドリンク付き690円〜）",
  "ランチ：11:00〜14:00（カレー、バインミーセットなど）",
  "珈琲：注文ごとに豆を挽き、一杯ずつハンドドリップで抽出。ブレンド560円〜（テイクアウトは460円〜）。アイスコーヒーは店内仕込み",
  "ナポリ珈琲：深煎りで濃く、苦味のしっかりしたストレートの珈琲。チョコレートやココアなど何かを混ぜた甘い珈琲では絶対にない（深煎りの香ばしさを比喩で表現する場合のみ可）",
  "フード：おにぎり（塩・梅・おかか・卵黄そぼろ等 十数種類）、バインミー（照り焼きたまご790円が一番人気）、カレー、銅板で焼く昔ながらのホットケーキ、ケーキセット、パフェ、クリームソーダ",
  "テイクアウト対応（珈琲・おにぎり・バインミー・ホットケーキなど）",
  "店内：木のぬくもりとオレンジ色がアクセント。カウンター席とテーブル席。一人でも家族連れでも入りやすい",
  "駐車場：店舗西側に約10台分",
] as const;

/**
 * 期間限定の事実。validUntil（YYYY-MM-DD）を過ぎると
 * 自動的にプロンプトから外れ、記事で言及されなくなる。
 */
const SEASONAL_FACTS: { fact: string; validUntil: string }[] = [
  {
    fact: "期間限定メニュー：明太フランス（明太子のペーストを塗って香ばしく焼き上げたフランスパン）。単品590円・単品のみの販売（ドリンクセットなし）。好評のため当初予定の10月末から延長し、この冬も販売中。終了日は未定なので具体的な終了日は書かない。テイクアウト可否は未確認なので書かない",
    // 終了日は未定。冬の終わり（2月末）を暫定期限とし、店舗から終了日の連絡があれば更新する
    validUntil: "2027-02-28",
  },
];

/**
 * 地域について書いてよい事実。これ以外の地名・施設情報は書かせない。
 * 公式観光サイト等で確認済みのもののみ。追加するときも必ず出典で確認すること。
 *   円通寺公園: https://www.okayama-kanko.jp/spot/10283
 *   玉島町並み保存地区: https://www.okayama-kanko.jp/spot/10304
 *   沙美海水浴場: https://rurubu.jp/andmore/spot/80033800
 *   玉島みなと公園: https://www.pa.cgr.mlit.go.jp/minato-oasis/pdf/tamashima-pamphlet.pdf
 */
const LOCAL_FACTS = [
  "円通寺：倉敷市玉島柏島（当店と同じ柏島地区）にある寺院。江戸時代の寛政年間に僧・良寛が修行した寺として知られる",
  "円通寺公園：円通寺を中心に広がる公園で、岡山県指定の名勝。約500本の桜があり、3月下旬〜4月上旬が見ごろ。白華山の山頂周辺から瀬戸内海の島々を望める",
  "玉島の町並み保存地区：もとは瀬戸内海の小さな島々で、江戸時代に備中松山藩の新田開発で陸地になった。元禄のころには北前船と高瀬舟の水運で港町として栄えた。虫籠窓や格子、漆喰壁・なまこ壁の商家や土蔵が残る",
  "玉島みなと公園：玉島港に面した公園。当店の近くにある",
  "沙美海岸（沙美海水浴場）：倉敷市玉島黒崎にある遠浅の海岸で、「日本の渚百選」に選ばれている",
] as const;

function formatMenuItem(i: MenuItem): string {
  const price = i.price === null ? "" : ` ${i.price.toLocaleString("ja-JP")}円`;
  const set = i.priceNote ? `（${i.priceNote}）` : "";
  const note = i.note ? `［${i.note}］` : "";
  return `${i.name}${price}${set}${note}`;
}

/** メニューの事実。期間限定メニューは期限管理のため SEASONAL_FACTS 側で扱う */
function menuFacts(): string[] {
  const lines = menuCategories.map((c) => {
    const foot = c.footnotes?.length ? ` ※${c.footnotes.join(" ※")}` : "";
    return `メニュー「${c.name}」（店内価格・税込）：${c.items.map(formatMenuItem).join("、")}${foot}`;
  });
  lines.push(`テイクアウト価格の例（税込）：${takeoutExamples.map(formatMenuItem).join("、")}`);
  return lines;
}

const INSTAGRAM_URL = "https://www.instagram.com/bonjourcoffee2026/";

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
  /** 季節テーマ: この月（1〜12・日本時間）のあいだだけ選ばれる */
  months?: number[];
  /** この記事で特に守ること（捏造しやすい点の注意） */
  note?: string;
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

  // ==== 追加テーマ（既存テーマ・固定ページと検索意図が重ならないもの） ====

  // --- 珈琲のはなし：家庭でも役立つ基礎知識と、メニューの選び方 ---
  { id: "coffee-mame-hozon", theme: "珈琲豆の保存方法｜家で香りを長持ちさせるコツ", slugBase: "coffee-mame-hozon", category: "珈琲のはなし", note: "家庭での一般的な保存のコツとして書く。当店で豆を販売しているかどうかには触れない" },
  { id: "asairi-fukairi", theme: "浅煎りと深煎りの違い｜味と香りの傾向をやさしく解説", slugBase: "asairi-fukairi", category: "珈琲のはなし", note: "一般論として書く。当店の豆の焙煎度合いは、ナポリが深煎りであること以外は書かない" },
  { id: "coffee-aji-kotoba", theme: "珈琲の「コク」「キレ」「酸味」とは？味を表す言葉の意味", slugBase: "coffee-aji-kotoba", category: "珈琲のはなし" },
  { id: "straight-blend", theme: "ストレート珈琲とブレンド珈琲の違い", slugBase: "straight-blend", category: "珈琲のはなし", note: "当店のブレンドの配合や豆の産地は書かない" },
  { id: "cafeole-latte", theme: "カフェオレとカフェラテの違い", slugBase: "cafeole-latte", category: "珈琲のはなし", note: "当店のメニューにあるのはカフェオレ（HOT／ICE）。カフェラテがあるとは書かない" },
  { id: "coffee-ondo-aji", theme: "珈琲は温度で味が変わる｜淹れたてと少し冷めてからの楽しみ方", slugBase: "coffee-ondo-aji", category: "珈琲のはなし" },
  { id: "coffee-milk-satou", theme: "ミルクや砂糖の入れ方で変わる、珈琲の楽しみ方", slugBase: "coffee-milk-satou", category: "珈琲のはなし", note: "当店がミルクや砂糖をどう添えているかは書かない" },
  { id: "coffee-sanchi-kihon", theme: "珈琲は産地で味が変わる？産地ごとの傾向の基本", slugBase: "coffee-sanchi-kihon", category: "珈琲のはなし", note: "産地ごとの一般的な傾向として書く。当店の豆の産地や味（コロンビアを含む）は書かない" },
  { id: "coffee-mizu", theme: "家で淹れる珈琲は水で味が変わる？", slugBase: "coffee-mizu", category: "珈琲のはなし", note: "家庭向けの一般論として書く。当店で使っている水は書かない" },
  { id: "uchi-hand-drip", theme: "家でハンドドリップを始めたい人へ｜道具と基本の淹れ方", slugBase: "uchi-hand-drip", category: "珈琲のはなし", note: "家庭向けの一般論として書く。当店の器具・レシピ・豆の分量は書かない" },
  { id: "coffee-nigate", theme: "苦い珈琲が苦手な人のための、喫茶店での選び方", slugBase: "coffee-nigate", category: "珈琲のはなし" },
  { id: "cake-coffee-awase", theme: "ケーキに合わせる珈琲の選び方", slugBase: "cake-coffee-awase", category: "珈琲のはなし" },
  { id: "wa-sweets-coffee", theme: "あんこや抹茶と珈琲は合う？和の甘さとの組み合わせ", slugBase: "wa-sweets-coffee", category: "珈琲のはなし" },
  { id: "shokugo-coffee", theme: "食後の一杯をおいしく楽しむコツ", slugBase: "shokugo-coffee", category: "珈琲のはなし" },
  { id: "natsu-tsumetai-drink", theme: "暑い日に飲みたい、喫茶店の冷たいドリンク", slugBase: "natsu-tsumetai-drink", category: "珈琲のはなし", months: [6, 7, 8, 9] },
  { id: "aki-fukairi", theme: "涼しくなると深煎りの珈琲が恋しくなる理由", slugBase: "aki-fukairi", category: "珈琲のはなし", months: [9, 10, 11] },
  { id: "fuyu-hot-drink", theme: "寒い日に飲みたい、喫茶店のホットドリンク", slugBase: "fuyu-hot-drink", category: "珈琲のはなし", months: [12, 1, 2], note: "体が温まる等の健康効果を断定しない" },

  // --- モーニング・ランチ：個別メニューの選び方（総合案内は /morning-lunch） ---
  { id: "banhmi-erabikata", theme: "バインミーの種類と選び方｜その日の気分で選ぶ一本", slugBase: "banhmi-erabikata", category: "モーニング・ランチ", note: "具材はメニューに書かれている範囲で紹介する" },
  { id: "onigiri-gu-erabikata", theme: "おにぎりの具はどう選ぶ？定番から少し変わった具まで", slugBase: "onigiri-gu-erabikata", category: "モーニング・ランチ" },
  { id: "banhmi-toast-asa", theme: "バインミートーストとゆで卵、パン派の朝ごはん", slugBase: "banhmi-toast-asa", category: "モーニング・ランチ" },
  { id: "salad-karume-lunch", theme: "具沢山サラダで軽めのお昼ごはん", slugBase: "salad-karume-lunch", category: "モーニング・ランチ", note: "サラダの具材はメニューに書かれていないので具体的に書かない" },
  { id: "side-menu-share", theme: "友人とシェアしたい、喫茶店のサイドメニュー", slugBase: "side-menu-share", category: "モーニング・ランチ" },
  { id: "brunch-kissaten", theme: "遅めの朝ごはん、ブランチを喫茶店で", slugBase: "brunch-kissaten", category: "モーニング・ランチ", note: "モーニングは11時まで、ランチは11時からという時間を正しく書く" },

  // --- カフェでの過ごし方：利用シーン別 ---
  { id: "dokusho-kissaten", theme: "喫茶店で本を読む時間", slugBase: "dokusho-kissaten", category: "カフェでの過ごし方" },
  { id: "tomodachi-oshaberi", theme: "友人とのおしゃべりに喫茶店を選ぶ理由", slugBase: "tomodachi-oshaberi", category: "カフェでの過ごし方" },
  { id: "futari-kissaten", theme: "夫婦やパートナーと、二人で過ごす喫茶店の時間", slugBase: "futari-kissaten", category: "カフェでの過ごし方" },
  { id: "oya-to-kissaten", theme: "親を誘って、ゆっくり喫茶店で過ごす", slugBase: "oya-to-kissaten", category: "カフェでの過ごし方", note: "段差やバリアフリーなど設備のことは書かない" },
  { id: "ame-no-hi-kissaten", theme: "雨の日こそ、喫茶店でのんびりと", slugBase: "ame-no-hi-kissaten", category: "カフェでの過ごし方" },
  { id: "hajimete-kissaten", theme: "初めての喫茶店でも気負わず過ごすコツ", slugBase: "hajimete-kissaten", category: "カフェでの過ごし方", note: "注文・支払い・席の案内など、当店の具体的なルールは書かない" },
  { id: "machiawase-kissaten", theme: "待ち合わせに喫茶店を使うという選択", slugBase: "machiawase-kissaten", category: "カフェでの過ごし方", note: "予約や席の確保ができるとは書かない" },
  { id: "yugata-kissaten", theme: "夕方の喫茶店で、一日をゆっくり締めくくる", slugBase: "yugata-kissaten", category: "カフェでの過ごし方", note: "営業は18時まで（ラストオーダー17:30）であることを正しく書く" },
  { id: "kaimono-kaeri", theme: "買い物帰りに、喫茶店でひと休み", slugBase: "kaimono-kaeri", category: "カフェでの過ごし方" },
  { id: "shigoto-aima", theme: "仕事の合間に、喫茶店で珈琲休憩", slugBase: "shigoto-aima", category: "カフェでの過ごし方", note: "Wi-Fiや電源の有無など設備のことは書かない" },
  { id: "hotto-hitoiki", theme: "毎日の中で「ほっと一息」つく時間のつくり方", slugBase: "hotto-hitoiki", category: "カフェでの過ごし方" },
  { id: "techo-nikki", theme: "喫茶店で手帳や日記を書くひととき", slugBase: "techo-nikki", category: "カフェでの過ごし方" },
  { id: "haru-sanpo", theme: "春の散歩の途中に、喫茶店でひと休み", slugBase: "haru-sanpo", category: "カフェでの過ごし方", months: [3, 4, 5] },
  { id: "montblanc-aki", theme: "珈琲と栗のモンブランで、秋のおやつ時間", slugBase: "montblanc-aki", category: "カフェでの過ごし方", months: [9, 10, 11], note: "モンブランを季節限定メニューとは書かない（通年のケーキセット）" },
  { id: "nenmatsu-hitoyasumi", theme: "年末の慌ただしさの合間に、喫茶店でひと休み", slugBase: "nenmatsu-hitoyasumi", category: "カフェでの過ごし方", months: [12], note: "年末年始の営業日は書かず、Instagramで確認するよう案内する" },
  { id: "shinnen-kissaten", theme: "新しい年のはじまりに、喫茶店で今年のことを考える", slugBase: "shinnen-kissaten", category: "カフェでの過ごし方", months: [1], note: "年始の営業日は書かず、Instagramで確認するよう案内する" },
  { id: "choco-dessert-fuyu", theme: "チョコレートのデザートと珈琲で過ごす、冬の午後", slugBase: "choco-dessert-fuyu", category: "カフェでの過ごし方", months: [1, 2], note: "バレンタインなどのキャンペーンやイベントがあるとは書かない" },

  // --- 玉島・倉敷のこと：確認済みの地域情報（LOCAL_FACTS）に基づくもの ---
  { id: "entsuji-sanpo", theme: "円通寺公園を歩いたあとに、珈琲でひと休み", slugBase: "entsuji-sanpo", category: "玉島・倉敷のこと", note: "円通寺・円通寺公園のことは【地域の事実】の範囲で書く" },
  { id: "tamashima-machinami", theme: "玉島の町並み保存地区を歩いたあとの一杯", slugBase: "tamashima-machinami", category: "玉島・倉敷のこと", note: "町並みのことは【地域の事実】の範囲で書く" },
  { id: "tamashima-minato-koen", theme: "玉島みなと公園で港の景色を眺めたあとに", slugBase: "tamashima-minato-koen", category: "玉島・倉敷のこと", note: "公園のことは【地域の事実】の範囲で書く" },
  { id: "sami-kaigan", theme: "沙美海岸へ出かける日の、行き帰りの喫茶店", slugBase: "sami-kaigan", category: "玉島・倉敷のこと", note: "沙美海岸のことは【地域の事実】の範囲で書く" },
  { id: "kurashiki-kanko-tamashima", theme: "倉敷観光のついでに、玉島まで足をのばして", slugBase: "kurashiki-kanko-tamashima", category: "玉島・倉敷のこと", note: "倉敷美観地区など他の観光地の施設情報は書かない" },
  { id: "okayama-kissaten-meguri", theme: "岡山で喫茶店めぐりを楽しむコツ", slugBase: "okayama-kissaten-meguri", category: "玉島・倉敷のこと", note: "他店の名前や情報は書かない。喫茶店めぐりの一般的な楽しみ方として書く" },
  { id: "jimoto-kissaten", theme: "地元に行きつけの喫茶店があるということ", slugBase: "jimoto-kissaten", category: "玉島・倉敷のこと" },
  { id: "obon-kisei", theme: "お盆の帰省で、地元の喫茶店に寄る", slugBase: "obon-kisei", category: "玉島・倉敷のこと", months: [8], note: "お盆の営業日は書かず、Instagramで確認するよう案内する" },

  // --- お店のこと：メニューの楽しみ方 ---
  { id: "coffee-igai-drink", theme: "珈琲が飲めない人も楽しめる、喫茶店の紅茶とドリンク", slugBase: "coffee-igai-drink", category: "お店のこと" },
  { id: "kodomo-menu-erabi", theme: "子どもと一緒に選びたい、喫茶店のメニュー", slugBase: "kodomo-menu-erabi", category: "お店のこと", note: "キッズメニューや子ども用の椅子・食器があるとは書かない" },
  { id: "takeout-coffee-oishiku", theme: "テイクアウトの珈琲をおいしく飲むコツ", slugBase: "takeout-coffee-oishiku", category: "お店のこと", note: "容器やサイズなど当店のテイクアウトの仕様は書かない" },
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

function inSeason(topic: Topic, month: number): boolean {
  return !topic.months || topic.months.includes(month);
}

/**
 * 今月書けるテーマのうち未使用のものを優先し、全て使用済みなら最も古いものを選ぶ。
 * 季節テーマは対象月を逃すと翌年まで書けないため、未使用の通年テーマより先に選ぶ。
 */
function pickTopic(
  existing: ExistingPost[],
  month: number,
): { topic: Topic; fresh: boolean } {
  const used = new Map<string, string>();
  for (const p of existing) {
    if (p.topicId && (!used.has(p.topicId) || p.date > (used.get(p.topicId) ?? "")))
      used.set(p.topicId, p.date);
  }
  const eligible = TOPICS.filter((t) => inSeason(t, month));
  const unused = eligible.filter((t) => !used.has(t.id));
  const unusedSeasonal = unused.find((t) => t.months);
  if (unusedSeasonal) return { topic: unusedSeasonal, fresh: true };
  if (unused.length > 0) {
    const idx = used.size % unused.length;
    return { topic: unused[idx], fresh: true };
  }
  const sorted = [...eligible].sort(
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

/**
 * モデルは内部リンクに架空ドメイン付きの絶対URL（example.com 等）や
 * 先頭スラッシュなしのパスを書くことがあるため、実在ページへの相対パスに直す。
 * 行き先が実在しないリンクは、リンクを外して表示テキストだけ残す。
 */
function normalizeLinks(body: string, existingSlugs: Set<string>): string {
  const pages = new Set(["/", "/blog", ...INTERNAL_LINKS.map((l) => l.url)]);
  return body.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_whole, text: string, raw: string) => {
    let url = raw.trim();
    if (url.startsWith("#")) return text;
    if (/^https?:\/\//i.test(url)) {
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        return text;
      }
      if (parsed.hostname.replace(/^www\./, "") === "instagram.com") {
        return `[${text}](${INSTAGRAM_URL})`;
      }
      url = parsed.pathname + parsed.hash;
    } else if (!url.startsWith("/")) {
      url = `/${url}`;
    }
    const [pathPart, hash] = url.split("#");
    const p = pathPart.replace(/\/+$/, "") || "/";
    if (pages.has(p)) return `[${text}](${hash ? `${p}#${hash}` : p})`;
    if (p.startsWith("/blog/") && existingSlugs.has(p.slice("/blog/".length))) {
      return `[${text}](${p})`;
    }
    return text;
  });
}

// ---- メイン -----------------------------------------------------------
async function main() {
  const dryRun = process.env.DRY_RUN === "1";
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !dryRun) {
    console.error("ERROR: ANTHROPIC_API_KEY が設定されていません。");
    process.exit(1);
  }

  fs.mkdirSync(BLOG_DIR, { recursive: true });

  const existing = readExistingPosts();
  const date = today();
  const { topic, fresh } = pickTopic(existing, Number(date.slice(5, 7)));
  const slug = uniqueSlug(topic.slugBase);

  console.log("──────────────────────────────────────────────");
  console.log(`使用モデル (model)   : ${MODEL}`);
  console.log(`テーマ    (topic)    : ${topic.theme}`);
  console.log(`カテゴリ  (category) : ${topic.category}`);
  console.log(`slug                 : ${slug}`);
  console.log(`再執筆(全消化後)     : ${fresh ? "no" : "yes"}`);
  console.log("──────────────────────────────────────────────");

  const linkList = INTERNAL_LINKS.map((l) => `- ${l.label}: ${l.url}`).join("\n");
  const activeSeasonalFacts = SEASONAL_FACTS.filter((s) => date <= s.validUntil).map(
    (s) => s.fact,
  );
  const factList = [...SHOP_FACTS, ...menuFacts(), ...activeSeasonalFacts]
    .map((f) => `- ${f}`)
    .join("\n");
  const localFactList = LOCAL_FACTS.map((f) => `- ${f}`).join("\n");
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
    "- メニュー名から味・材料・作り方を推測して断定しない（例：「ナポリ珈琲＝チョコレートを混ぜた珈琲」のような誤った説明は禁止）。個々の商品の味や作り方は、上記リストに書かれている範囲でのみ述べる",
    "- 分からないことは書かない。一般論として書ける内容（珈琲の楽しみ方など）は一般論として書く",
    "- 地名・施設について書いてよい事実は、下記の「地域の事実」リストにあるものだけ。それ以外の固有名詞や観光情報は創作しない",
    "- 距離・所要時間・営業時間・料金・開設期間・イベント日程は変わりやすいので、店舗のものを除き書かない",
    "- 価格は「店舗の事実」にある店内価格を使う。テイクアウト価格と混同しない",
    "",
    "【店舗の事実】",
    factList,
    "",
    "【地域の事実】",
    localFactList,
    "",
    "【内部リンク】",
    "- 本文中に、文脈に合う内部リンクを2〜4個、Markdownリンク（[表示テキスト](URL)）で自然に挿入する",
    "- アンカーテキストは具体的にし、「こちら」は使わない。毎回同じ文言にしない",
    "- URLは下記の相対パスをそのまま書く（https:// やドメイン名を付けない。下記以外のURLを作らない）",
    `- Instagramへ案内する場合のみ、URLに ${INSTAGRAM_URL} を使ってよい`,
    linkList,
    "",
    "【キーワードのすみ分け】",
    "- この記事はロングテール担当。「玉島 カフェ」を主題にした総合紹介記事にしない（それはトップページの役割）",
    "- 珈琲全般の総合解説は /coffee、モーニング・ランチの総合案内は /morning-lunch の役割。関連して触れる場合は深入りせずリンクする",
  ].join("\n");

  const user = [
    `今日の記事テーマ：「${topic.theme}」`,
    topic.note ? `この記事で守ること：${topic.note}` : "",
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

  if (dryRun) {
    console.log(system);
    console.log("──────────────────────────────────────────────");
    console.log(user);
    return;
  }

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
  const existingSlugs = new Set(existing.map((p) => p.slug));
  const body = normalizeLinks(cleanBody(String(parsed.body ?? "")), existingSlugs);

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
