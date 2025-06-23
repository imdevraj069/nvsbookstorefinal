import HeroSection from "@/components/sections/herosection"
import CategoryHighlights from "@/components/sections/category-highlights"
import FeaturedProducts from "../components/sections/featured-products"
import LatestUpdatesSection from "@/components/sections/latest-updates-section"
import ProductHero from "@/components/sections/product-hero"
import NewsletterSignup from "@/components/sections/newsletter-signup"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <CategoryHighlights />
      <FeaturedProducts />
      <LatestUpdatesSection />
      <ProductHero />
      <NewsletterSignup />
    </div>
  );
}
