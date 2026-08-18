import Hero from "@/components/sections/home/Hero";
import IntroSection from "@/components/sections/home/IntroSection";
import CoffeeSection from "@/components/sections/home/CoffeeSection";
import TimeSection from "@/components/sections/home/TimeSection";
import RecommendSection from "@/components/sections/home/RecommendSection";
import StorySection from "@/components/sections/home/StorySection";
import GallerySection from "@/components/sections/home/GallerySection";
import InstagramSection from "@/components/sections/home/InstagramSection";
import LatestPosts from "@/components/sections/home/LatestPosts";
import ShopInfo from "@/components/sections/ShopInfo";
import MediaMentions from "@/components/sections/MediaMentions";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <CoffeeSection />
      <TimeSection />
      <RecommendSection />
      <StorySection />
      <GallerySection />
      <InstagramSection />
      <LatestPosts />
      <MediaMentions />
      <ShopInfo />
    </>
  );
}
