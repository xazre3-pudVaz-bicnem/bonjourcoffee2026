/**
 * 店舗基本情報の一元管理。
 * 営業時間・住所・電話番号などの表記は必ずこのファイルを参照し、
 * ページごとの表記ゆれ（NAP不一致）を防ぐ。
 */

export const shop = {
  /** 店名（正式表記） */
  name: "ぼんじゅうる珈琲",
  /** 欧文表記（ロゴ・装飾用） */
  nameEn: "Bonjour Coffee",

  /** 公開する住所は店舗住所のみ */
  address: "岡山県倉敷市玉島柏島6988-3",
  addressLocality: "倉敷市",
  addressRegion: "岡山県",
  streetAddress: "玉島柏島6988-3",

  tel: "050-8883-6590",
  telLink: "tel:05088836590",

  /** 営業時間（表示用） */
  hours: "8:00〜18:00",
  lastOrder: "17:30",
  opens: "08:00",
  closes: "18:00",

  /**
   * 定休日。水曜のほか不定休の可能性があるため断定せず、
   * 最新情報はInstagramへ誘導する。
   */
  closed: "水曜日ほか不定休",
  closedNote: "最新の営業情報は公式Instagramをご確認ください。",

  /** 時間帯の目安（KCTトクもりっ・岡山おにさんぽで確認） */
  morningHours: "8:00〜11:00",
  lunchHours: "11:00〜14:00",

  /** 駐車場（岡山おにさんぽで確認済みの内容のみ） */
  parking: "店舗西側に約10台分の駐車スペースがあります。",

  openedAt: "2026年7月23日",

  instagram: "https://www.instagram.com/bonjourcoffee2026/",
  instagramId: "@bonjourcoffee2026",

  /** 正式ドメイン（wwwあり）。canonical・OGP・sitemap・JSON-LDすべての基準 */
  url: "https://www.bonjourcoffee2026.com",

  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("ぼんじゅうる珈琲 岡山県倉敷市玉島柏島6988-3"),
  /** APIキー不要の埋め込み用URL */
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("ぼんじゅうる珈琲 岡山県倉敷市玉島柏島6988-3") +
    "&output=embed",

  /** 掲載メディア（本文転載はせず、リンクのみ） */
  media: [
    {
      name: "KCT トクもりっ！",
      url: "https://tokumori.tv.kct.jp/gourmet/74134/",
    },
    {
      name: "岡山おにさんぽ",
      url: "https://onisanpo.com/open/106323/",
    },
  ],
} as const;
