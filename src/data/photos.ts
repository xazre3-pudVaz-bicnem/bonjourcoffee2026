/**
 * サイトで使用する写真の一元管理。
 * すべて店舗提供の実写真（assets/originals に元データを保管）。
 * width / height は実ピクセル値。CLS防止のため必ず指定して使う。
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const photos = {
  hero: {
    src: "/images/hero.jpg",
    width: 1280,
    height: 853,
    alt: "銅板で焼いたホットケーキに小豆と抹茶アイスを添えた、ぼんじゅうる珈琲の一皿",
  },
  exterior: {
    src: "/images/exterior.jpg",
    width: 960,
    height: 1280,
    alt: "白い板張りの壁に丸い木製看板が掛かる、ぼんじゅうる珈琲の入口",
  },
  interior1: {
    src: "/images/interior-1.jpg",
    width: 960,
    height: 1280,
    alt: "カウンター席とテーブル席、オレンジ色のソファが並ぶ木のぬくもりのある店内",
  },
  interior2: {
    src: "/images/interior-2.jpg",
    width: 960,
    height: 1280,
    alt: "ペンダントライトの灯りに照らされたオレンジ色のベンチシート",
  },
  interior3: {
    src: "/images/interior-3.jpg",
    width: 960,
    height: 1280,
    alt: "窓から光が入る明るいテーブル席と赤い掛け時計",
  },
  interior4: {
    src: "/images/interior-4.jpg",
    width: 960,
    height: 1280,
    alt: "レンガ調の壁とドライフラワーが飾られた店内",
  },
  seat: {
    src: "/images/seat.jpg",
    width: 960,
    height: 1280,
    alt: "ドライフラワーとペンダントライトのある壁際の二人席",
  },
  coffeeHot: {
    src: "/images/coffee-hot.jpg",
    width: 1280,
    height: 960,
    alt: "花柄のカップに注いだ淹れたてのブレンド珈琲",
  },
  coffeeCups: {
    src: "/images/coffee-cups.jpg",
    width: 1280,
    height: 960,
    alt: "花柄のカップに淹れた珈琲を上から見たところ",
  },
  coffeeIce: {
    src: "/images/coffee-ice.jpg",
    width: 960,
    height: 1280,
    alt: "店内で仕込んだアイスコーヒーのグラス",
  },
  coffeeBeans: {
    src: "/images/coffee-beans.jpg",
    width: 1280,
    height: 960,
    alt: "珈琲豆を入れたガラスのキャニスターが並ぶ棚",
  },
  morning: {
    src: "/images/morning.jpg",
    width: 1280,
    height: 853,
    alt: "バターが溶けるバインミートーストとゆで卵のモーニング",
  },
  banhmiGroup: {
    src: "/images/banhmi-group.jpg",
    width: 960,
    height: 1280,
    alt: "木のトレイに並んだ6種類のバインミー",
  },
  banhmiTeriyaki: {
    src: "/images/banhmi-teriyaki.jpg",
    width: 960,
    height: 1280,
    alt: "一番人気の照り焼きたまごバインミーとフライドポテト",
  },
  banhmiSet: {
    src: "/images/banhmi-set.jpg",
    width: 960,
    height: 1280,
    alt: "バインミーと珈琲、クリームソーダを並べたテーブル",
  },
  onigiri: {
    src: "/images/onigiri.jpg",
    width: 1280,
    height: 960,
    alt: "白い皿に盛った3種類のおにぎり",
  },
  onigiriYaki: {
    src: "/images/onigiri-yaki.jpg",
    width: 960,
    height: 1280,
    alt: "たくあんを添えた焼きおにぎり",
  },
  curry: {
    src: "/images/curry.jpg",
    width: 1280,
    height: 853,
    alt: "ゆで卵をのせた唐揚げカレー",
  },
  hotcake: {
    src: "/images/hotcake.jpg",
    width: 1280,
    height: 853,
    alt: "苺とホイップを添えた昔ながらのホットケーキ",
  },
  hotcakeClose: {
    src: "/images/hotcake-close.jpg",
    width: 1280,
    height: 853,
    alt: "苺ソースがかかったホットケーキの寄り",
  },
  hotcakeToppings: {
    src: "/images/hotcake-toppings.jpg",
    width: 960,
    height: 1280,
    alt: "ホットケーキを囲むように並んだトッピングの小鉢",
  },
  cakeChocolate: {
    src: "/images/cake-chocolate.jpg",
    width: 1280,
    height: 853,
    alt: "ココアパウダーをまとったチョコレートムースケーキ",
  },
  coffeeJelly: {
    src: "/images/coffee-jelly.jpg",
    width: 960,
    height: 1280,
    alt: "バニラアイスとチェリーをのせたコーヒーゼリー",
  },
  parfaitMatcha: {
    src: "/images/parfait-matcha.jpg",
    width: 853,
    height: 1280,
    alt: "抹茶とあずきのパフェ",
  },
  creamSoda: {
    src: "/images/cream-soda.jpg",
    width: 960,
    height: 1280,
    alt: "テーブルに置かれたメロンクリームソーダ",
  },
  salad: {
    src: "/images/salad.jpg",
    width: 959,
    height: 1280,
    alt: "木のボウルに盛った具沢山サラダ",
  },
} as const satisfies Record<string, Photo>;

/** TOPページのギャラリー */
export const galleryPhotos: Photo[] = [
  photos.interior1,
  photos.coffeeCups,
  photos.banhmiGroup,
  photos.interior2,
  photos.hotcakeToppings,
  photos.creamSoda,
  photos.onigiriYaki,
  photos.seat,
];
