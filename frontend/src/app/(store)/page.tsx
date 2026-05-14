import Hero from "@/components/sections/Hero";
import FeaturesBar from "@/components/sections/FeaturesBar";
import Categories from "@/components/sections/Categories";
import PromoBanner from "@/components/sections/PromoBanner";
import ProductSection from "@/components/sections/ProductSection";
import Testimonials from "@/components/sections/Testimonials";
import InstagramFeed from "@/components/sections/InstagramFeed";
import Newsletter from "@/components/sections/Newsletter";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesBar />
      <Categories />
      <PromoBanner />
      
      {/* Featured Pieces */}
      <ProductSection
        title="Featured pieces"
        subtitle="BEST SELLERS"
        queryParams="featured=true"
        viewAllHref="/shop?filter=featured"
        limit={8}
      />

      {/* Trending Pieces */}
      <ProductSection
        title="Trending now"
        icon={<span>🔥</span>}
        queryParams="trending=true"
        viewAllHref="/shop?filter=trending"
        limit={4}
      />

      {/* New Arrivals */}
      <ProductSection
        title="New arrivals"
        icon={<span>✨</span>}
        queryParams="isNewArrival=true"
        viewAllHref="/shop?filter=new"
        limit={4}
      />

      <Testimonials />
      <InstagramFeed />
      <Newsletter />

      {/* Chat Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/chat">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:scale-110 hover:bg-neutral-800 hover:shadow-2xl">
            <MessageCircle size={28} />
          </div>
        </Link>
      </div>
    </>
  );
}
