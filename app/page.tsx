
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedRestaurants from "@/components/home/FeaturedRestaurants";
import PopularFoods from "@/components/home/PopularFoods";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedRestaurants />
      <PopularFoods />
    </>
  );
}
