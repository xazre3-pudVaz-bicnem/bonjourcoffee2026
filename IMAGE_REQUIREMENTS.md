# 写真素材について

現在の写真（店舗提供・62枚。元データは `assets/originals/` に保管）でサイトは完成していますが、
以下の写真が追加であると、さらに魅力的になります。撮影できたら差し替え・追加をおすすめします。

## 追加で欲しい写真（優先度順）

| # | 内容 | 用途 | 備考 |
|---|------|------|------|
| 1 | **ハンドドリップで抽出している手元**（横長） | /coffee ページの主役写真 | 現在62枚の中に抽出シーンが1枚もないため、珈琲ページは豆キャニスター写真で代用中。お湯を注いで粉がふくらんでいる瞬間がベスト |
| 2 | **店舗外観の横長カット** | TOPヒーローの差し替え候補・OGP | 現在の外観写真（丸看板）は縦長のみ。道路側から店舗全体が入る横長があると使い道が広い |
| 3 | **ホットコーヒーを淹れる・運ぶなど人の動きがある写真** | TOP・Aboutの温度感アップ | 顔出し不要。手元だけでも可 |
| 4 | **カウンター席の写真** | About・珈琲ページ | 「一人でも気軽」の訴求用。現在はテーブル席中心 |
| 5 | モーニングセット全体（おにぎり＋スープ＋ドリンク） | /morning-lunch | 現在はバインミートーストの寄りのみ |
| 6 | 店内の横長カット（全体が見渡せるもの） | 各ページのヒーロー | 現在の店内写真はすべて縦長 |

## 使用中の写真の割り当て

`src/data/photos.ts` で一元管理しています。差し替えは
`public/images/` の同名ファイルを置き換えるだけです（サイズが変わる場合は photos.ts の width/height も更新）。

- `hero.jpg` — TOPヒーロー（ホットケーキ＋抹茶アイス）
- `og.jpg`（public直下） — SNSシェア用共通OG画像（苺のホットケーキ）
- `exterior.jpg` — 外観（丸い木製看板）
- `interior-1〜4.jpg` / `seat.jpg` — 店内
- `coffee-hot / coffee-cups / coffee-ice / coffee-beans.jpg` — 珈琲
- `morning.jpg` — モーニング
- `banhmi-group / banhmi-teriyaki / banhmi-set.jpg` — バインミー
- `onigiri.jpg / onigiri-yaki.jpg` — おにぎり
- `curry.jpg` — カレー
- `hotcake.jpg / hotcake-close.jpg / hotcake-toppings.jpg` — ホットケーキ
- `cake-chocolate / coffee-jelly / parfait-matcha / cream-soda / salad.jpg` — デザート・ドリンク
- `logo-orange.jpg / logo-black.jpg` — ロゴ（favicon にも使用）

## 注意

- 外部メディア（KCTトクもりっ・岡山おにさんぽ）掲載の写真は転載しないこと
- メニュー表の接写・スクリーンショット類（assets/originals 内）は価格の一次資料として保管。サイトには掲載しない
