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
    width: 2048,
    height: 1365,
    alt: "オレンジ色のソファとカウンター席が並ぶ、木のぬくもりのあるぼんじゅうる珈琲の店内",
  },
  exterior: {
    src: "/images/exterior.jpg",
    width: 960,
    height: 1280,
    alt: "白い板張りの壁に丸い木製看板とランプが掛かる、ぼんじゅうる珈琲の外観",
  },
  exteriorWide: {
    src: "/images/exterior-wide.jpg",
    width: 2048,
    height: 1365,
    alt: "赤茶色の瓦屋根と白い板張りの壁のぼんじゅうる珈琲の建物全景",
  },
  counter: {
    src: "/images/counter.jpg",
    width: 2048,
    height: 1365,
    alt: "グラス棚とレンガ壁のあるカウンター席と、窓際のオレンジ色のベンチシート",
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
    alt: "Bonjourのロゴが入った珈琲豆のガラス瓶と木のスコップ",
  },
  morning: {
    src: "/images/morning.jpg",
    width: 2048,
    height: 1365,
    alt: "おにぎり2種に漬物とスープを添えた選べるモーニング",
  },
  morningToast: {
    src: "/images/morning-toast.jpg",
    width: 2048,
    height: 1365,
    alt: "バターが溶けるバインミートーストとゆで卵のモーニング",
  },
  banhmiGroup: {
    src: "/images/banhmi-group.jpg",
    width: 960,
    height: 1280,
    alt: "木のトレイに盛り合わせた6種類のバインミー",
  },
  banhmiTeriyaki: {
    src: "/images/banhmi-teriyaki.jpg",
    width: 2048,
    height: 1365,
    alt: "一番人気の照り焼きたまごバインミー",
  },
  banhmiSet: {
    src: "/images/banhmi-set.jpg",
    width: 960,
    height: 1280,
    alt: "バインミーやおにぎり、珈琲、クリームソーダが並ぶテーブル",
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
  onigiriTamago: {
    src: "/images/onigiri-tamago.jpg",
    width: 1365,
    height: 2048,
    alt: "とろりとした卵黄がのぞく卵黄そぼろおにぎり",
  },
  curry: {
    src: "/images/curry.jpg",
    width: 2048,
    height: 1365,
    alt: "ゆで卵をのせた唐揚げカレー",
  },
  hotcake: {
    src: "/images/hotcake.jpg",
    width: 2048,
    height: 1365,
    alt: "苺とホイップを添えた昔ながらのホットケーキ",
  },
  hotcakeClose: {
    src: "/images/hotcake-close.jpg",
    width: 2048,
    height: 1365,
    alt: "小豆と抹茶アイスを添えたホットケーキの寄り",
  },
  hotcakePlain: {
    src: "/images/hotcake-plain.jpg",
    width: 757,
    height: 757,
    alt: "バターとホイップ、シロップを添えた昔ながらのホットケーキ",
  },
  hotcakeToppings: {
    src: "/images/hotcake-toppings.jpg",
    width: 960,
    height: 1280,
    alt: "ホットケーキを囲むように並んだトッピングの小鉢",
  },
  cakeChocolate: {
    src: "/images/cake-chocolate.jpg",
    width: 2048,
    height: 1365,
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
