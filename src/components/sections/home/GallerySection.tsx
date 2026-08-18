import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { galleryPhotos } from "@/data/photos";

/** 店内・料理ギャラリー。2列×モバイル、4列×PCの静かなグリッド */
export default function GallerySection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading en="Gallery" align="center">
            店内と、あの一皿
          </SectionHeading>
        </Reveal>
      </div>
      <div className="mx-auto mt-14 grid max-w-7xl grid-cols-2 gap-2 px-2 sm:gap-3 sm:px-3 lg:grid-cols-4">
        {galleryPhotos.map((photo, i) => (
          <Reveal key={photo.src} delay={(i % 4) * 0.08} as="figure">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
