# ぼんじゅうる珈琲 公式サイト

岡山県倉敷市玉島柏島の喫茶店「ぼんじゅうる珈琲」の公式サイト。

- 本番URL: https://www.bonjourcoffee2026.com （www あり側に統一）
- スタック: Next.js 16（App Router）+ TypeScript + Tailwind CSS v4
- ブログ: Claude API（Haiku）+ GitHub Actions で毎日1記事自動生成

## 開発

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド
npm run lint
```

## ディレクトリ

```
src/app/           ページ（TOP, /menu, /coffee, /morning-lunch, /about, /access, /blog, /privacy）
src/components/    layout / sections / ui / blog
src/data/          shop.ts（店舗情報・NAP一元管理）, menu.ts（メニュー・価格）, photos.ts（写真）
src/lib/           blog.ts（記事読み込み）, jsonld.ts（構造化データ）
content/blog/      ブログ記事（Markdown。自動生成もここに追加される）
scripts/           generate-daily-post.ts（毎日のブログ生成）
assets/originals/  店舗提供写真の元データ（62枚。サイト未使用分含む）
```

## 店舗情報を変更するとき

- 営業時間・定休日・住所・電話・駐車場 → `src/data/shop.ts`
- メニュー・価格 → `src/data/menu.ts`
- 写真の差し替え → `public/images/` を置き換え（`IMAGE_REQUIREMENTS.md` 参照）

すべてのページ・JSON-LD・FAQが上記データを参照しているため、1ファイル直せば全体に反映される。

## ブログ自動投稿

`.github/workflows/daily-blog.yml` が毎日 9:17 JST に実行され、
`scripts/generate-daily-post.ts` が Claude Haiku で1記事生成して main に push する。
push により Vercel が自動デプロイして公開される。手動実行は GitHub Actions 画面の
「Daily Blog Post」→ Run workflow から。

必要な設定（GitHub リポジトリ）:

- Secrets: `ANTHROPIC_API_KEY`（必須）
- Variables: `ANTHROPIC_MODEL`（任意。未設定なら claude-haiku-4-5）

仕組み:

- トピックプール（scripts 内 TOPICS・78テーマ）から未使用テーマを選択（topicId で重複防止）
- 季節テーマ（`months` 付き）は対象月だけ選ばれ、時期を逃さないよう優先される
- テーマごとの注意点（`note`）をAIに渡し、捏造しやすい点を個別に防ぐ
- 既存記事のタイトルと類似度が高い場合は保存せず失敗（カニバリ防止）
- 店舗の事実は scripts 内 SHOP_FACTS、メニュー・価格は `src/data/menu.ts`（自動読み込み）、
  地域の事実は scripts 内 LOCAL_FACTS（出典確認済みのもののみ）だけを参照（捏造防止）
- 期間限定メニューは SEASONAL_FACTS に期限（validUntil）付きで登録し、期限後は自動で言及されなくなる
- 本文のリンクは保存前に実在ページへの相対パスへ正規化（架空ドメインや存在しないページへのリンクを防ぐ）
- コアKWのすみ分け: TOP=「玉島 カフェ」/ /coffee=「玉島 コーヒー」/ /morning-lunch=「玉島 モーニング・ランチ」/ ブログ=ロングテール

テーマを追加するときは、既存テーマ・固定ページと検索意図が重ならないことを確認する。
次に選ばれるテーマとAIへの指示は、APIを呼ばずに確認できる:

```bash
DRY_RUN=1 npx tsx scripts/generate-daily-post.ts
```

## デプロイ

GitHub main ブランチ → Vercel 自動デプロイ。
正式ドメインは https://www.bonjourcoffee2026.com（`src/data/shop.ts` の `url` が
canonical・OGP・sitemap・JSON-LD すべての基準）。
Vercel のドメイン設定では www.bonjourcoffee2026.com をプライマリにし、
bonjourcoffee2026.com（非www）からは www 側へリダイレクトさせること。
