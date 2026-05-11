"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import api from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1EC] pb-20">
      {/* Header */}
      <div className="py-20 md:py-28">
        <div className="container-custom text-center">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-[#9C6B4F] mb-4">
            Explore
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#5C4033] mb-6">
            All Categories
          </h1>
          <p className="text-[#8B6B52] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            From everyday essentials to statement drops — find your next obsession.
          </p>
        </div>
      </div>

      <div className="container-custom py-16 md:py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#E7D7C9] animate-pulse rounded-[32px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {categories.map((category, index) => (
              <Link 
                key={category._id} 
                href={`/shop?category=${category._id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#E7D7C9] shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={category.image?.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop"}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/90 via-[#5C4033]/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <p className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {Math.floor(Math.random() * 200) + 50} Pieces
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-0 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-b from-transparent to-[#E7D7C9]/30 py-24 md:py-32">
        <div className="container-custom text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#5C4033] mb-6">
            Get 15% off your first order
          </h2>
          <p className="text-[#8B6B52] text-sm md:text-base font-medium mb-10 max-w-lg mx-auto">
            Join 240,000+ subscribers — early drops, weekly edits, no spam.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full sm:flex-1 bg-white border-none rounded-xl py-4 px-6 text-sm text-[#5C4033] placeholder:text-[#C69C72] focus:ring-2 focus:ring-[#9C6B4F] outline-none shadow-sm"
            />
            <button className="w-full sm:w-auto bg-[#5C4033] text-white rounded-xl py-4 px-10 text-sm font-bold hover:bg-[#3E2C24] transition-colors shadow-md">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
