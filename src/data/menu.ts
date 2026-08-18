/**
 * メニューの一元管理。
 * 価格はすべて店舗のメニュー表（店舗提供資料）で確認した税込価格。
 * 変更があった場合はこのファイルだけ直せばサイト全体に反映される。
 * 価格が確認できない商品は price を null にし、画面には価格を表示しない。
 */

export type MenuItem = {
  name: string;
  /** 税込価格（未確定は null。null のとき画面に価格は出さない） */
  price: number | null;
  /** セット価格など補足の価格表記 */
  priceNote?: string;
  note?: string;
  /** おすすめとして目立たせる商品 */
  recommended?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  nameEn: string;
  lead: string;
  items: MenuItem[];
  footnotes?: string[];
};

export const menuNote =
  "価格はすべて税込です。価格・内容は変更になる場合があります。最新のメニューは店頭または公式Instagramをご確認ください。";

export const menuCategories: MenuCategory[] = [
  {
    id: "morning",
    name: "モーニング",
    nameEn: "Morning",
    lead: "朝8時から11時まで。おにぎり、バインミー、ホットケーキから選べる朝ごはんです。ドリンク付きで、一日のはじまりをゆっくりどうぞ。",
    items: [
      {
        name: "選べるおにぎり 1種",
        price: 690,
        note: "漬物・スープ・ドリンク付",
        recommended: true,
      },
      { name: "選べるおにぎり 2種", price: 990, note: "漬物・スープ・ドリンク付" },
      { name: "バインミートースト＆ゆで卵", price: 690, note: "ドリンク付。ゆで卵はサラダに変更可" },
      { name: "モーニングバインミー", price: 890, note: "ドリンク付" },
      {
        name: "モーニングホットケーキ",
        price: 840,
        note: "ドリンク付。プラス200円で2枚に変更可",
      },
    ],
    footnotes: [
      "おにぎりは 塩・梅・昆布・おかか・ツナマヨ・高菜・納豆 から。プラス50円で肉そぼろ・明太・梅大葉・納豆キムチ・豚キムチ・唐揚げマヨ、プラス100円で卵黄そぼろ・鮭・焼きおにぎり（数量限定）もお選びいただけます。",
      "トッピング：ゆで卵100円／ミニサラダ150円／ミニコーヒーゼリー150円／ジャム50円／ミニ唐揚げ300円／スープ200円",
    ],
  },
  {
    id: "coffee",
    name: "珈琲",
    nameEn: "Coffee",
    lead: "注文をいただいてから一杯ずつハンドドリップで淹れています。アイスコーヒーも店内で仕込んだものです。",
    items: [
      { name: "ブレンド", price: 460, recommended: true },
      { name: "アメリカン", price: 460 },
      { name: "アイスコーヒー", price: 520, note: "店内仕込み" },
      { name: "ナポリ", price: 620 },
      { name: "コロンビア", price: 700 },
      { name: "カフェインレス（HOT／ICE）", price: 620 },
      { name: "期間限定珈琲", price: 750 },
      { name: "カフェオレ（HOT／ICE）", price: 670 },
    ],
  },
  {
    id: "drink",
    name: "紅茶・ドリンク",
    nameEn: "Tea & Drinks",
    lead: "珈琲が苦手な方やお子さまも楽しめるドリンクをご用意しています。",
    items: [
      { name: "ダージリン", price: 600 },
      { name: "アールグレイ", price: 600 },
      { name: "はちみつ紅茶", price: 670 },
      { name: "アイスティ", price: 600 },
      { name: "オレンジジュース", price: 600 },
      { name: "りんごジュース", price: 560 },
      { name: "メロンクリームソーダ", price: 720, recommended: true },
      { name: "レモネード（HOT／ICE）", price: 620 },
      { name: "レモンスカッシュ", price: 660 },
      { name: "フローズン珈琲", price: 760 },
      { name: "フローズンストロベリー", price: 760 },
      { name: "フローズングレープ", price: 760 },
    ],
  },
  {
    id: "banhmi",
    name: "バインミー",
    nameEn: "Banh mi",
    lead: "フランスパン風のバゲットに具材をたっぷり挟んだ、ベトナム発祥のサンドイッチ。当店では食べやすいように具材をアレンジしています。セットは11時〜14時、ポテトとドリンク付きです。",
    items: [
      {
        name: "照り焼きたまご",
        price: 790,
        priceNote: "セット 1,240円",
        note: "香ばしい照り焼きチキンとゆで卵の一番人気",
        recommended: true,
      },
      { name: "ミックスバインミー", price: 750, priceNote: "セット 1,200円" },
      { name: "ツナサラダ", price: 750, priceNote: "セット 1,200円" },
      { name: "サラダチキン", price: 790, priceNote: "セット 1,240円" },
      { name: "ピリ辛豚キムチ", price: 790, priceNote: "セット 1,240円" },
      { name: "白身タルタル", price: 790, priceNote: "セット 1,240円" },
      { name: "彩りえびアボカド", price: 890, priceNote: "セット 1,340円" },
    ],
  },
  {
    id: "onigiri",
    name: "おにぎり",
    nameEn: "Onigiri",
    lead: "喫茶店では少しめずらしい、種類豊富なおにぎり。朝ごはんにも、軽いお昼にも、テイクアウトにも。",
    items: [
      { name: "塩", price: 250 },
      { name: "梅・昆布・おかか・ツナマヨ・高菜・納豆", price: 350 },
      {
        name: "肉そぼろ・明太・梅大葉・納豆キムチ・豚キムチ・唐揚げマヨ",
        price: 400,
      },
      {
        name: "卵黄そぼろ・鮭・焼おにぎり（数量限定）",
        price: 450,
        recommended: true,
      },
    ],
  },
  {
    id: "lunch",
    name: "カレー・サイド",
    nameEn: "Curry & Side",
    lead: "喫茶店らしい食事メニュー。ランチタイムはもちろん、小腹が空いたときにも。",
    items: [
      { name: "唐揚げカレー", price: 1190, recommended: true },
      { name: "ビーフカレー", price: 900 },
      { name: "白身フライカレー", price: 1090 },
      { name: "山盛りフライドポテト", price: 500 },
      { name: "唐揚げ", price: 500 },
      { name: "具沢山サラダ", price: 850 },
      { name: "バインミートースト", price: 400 },
      { name: "スープ（味噌／コンソメ）", price: 200 },
    ],
  },
  {
    id: "hotcake",
    name: "ホットケーキ",
    nameEn: "Hotcake",
    lead: "銅板でじっくり焼き上げる、昔ながらのホットケーキ。焼成に10分ほどお時間をいただきます。セットはドリンク付きです。",
    items: [
      {
        name: "ホットケーキセット（2枚）",
        price: 1290,
        note: "ホイップ・ドリンク付。1枚は1,190円",
        recommended: true,
      },
      {
        name: "苺とホイップのホットケーキ（2枚）",
        price: 1390,
        note: "苺ソース・ホイップ・ドリンク付",
      },
      {
        name: "小豆と抹茶アイスのホットケーキ（2枚）",
        price: 1390,
        note: "小豆・抹茶アイス・ドリンク付",
      },
      {
        name: "バニラとチョコアイスのホットケーキ（2枚）",
        price: 1390,
        note: "チョコアイス・バニラ・ドリンク付",
      },
    ],
    footnotes: [
      "プラス200円でホットケーキ1枚増量。トッピング（バニラ・抹茶アイス・チョコアイス・チョコクリーム・苺ソース・ホイップ）各150円。",
    ],
  },
  {
    id: "dessert",
    name: "ケーキ・デザート",
    nameEn: "Cake & Dessert",
    lead: "珈琲に合う甘いものを揃えています。ケーキセットはドリンク付きです。",
    items: [
      { name: "バスクチーズケーキセット", price: 1250, note: "ドリンク付", recommended: true },
      { name: "チョコレートムースケーキセット", price: 1150, note: "ドリンク付" },
      { name: "珈琲と栗のモンブランセット", price: 1150, note: "ドリンク付" },
      { name: "ピスタチオのミルクレープセット", price: 1150, note: "ドリンク付" },
      { name: "パフェ", price: null, note: "チョコ・抹茶あずき・ストロベリーなど" },
      { name: "コーヒーゼリー", price: null },
    ],
  },
];

/** テイクアウト（店頭のテイクアウトメニュー表より抜粋） */
export const takeoutNote =
  "珈琲・おにぎり・バインミー・ホットケーキなどはテイクアウトもできます。おうちでも、ぼんじゅうる珈琲をお楽しみください。";

export const takeoutExamples: MenuItem[] = [
  { name: "ブレンド", price: 460 },
  { name: "アイスコーヒー", price: 520 },
  { name: "おにぎり（塩）", price: 250 },
  { name: "おにぎり（卵黄そぼろ・鮭など）", price: 450 },
  { name: "照焼きたまごチキンバインミー", price: 790 },
  { name: "ホットケーキ プレーン2枚", price: 790 },
];

/** TOPページの「おすすめ」抜粋 */
export const recommendedItems = menuCategories
  .flatMap((c) => c.items.map((i) => ({ ...i, category: c.name })))
  .filter((i) => i.recommended);
