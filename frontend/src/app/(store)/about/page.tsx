"use client";

import { Sparkles, Leaf, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  const stats = [
    {
      icon: <Sparkles size={20} className="text-[#9C6B4F]" />,
      title: "Premium fabrics",
      desc: "Sourced ethically"
    },
    {
      icon: <Leaf size={20} className="text-[#9C6B4F]" />,
      title: "Carbon neutral",
      desc: "Since 2022"
    },
    {
      icon: <Heart size={20} className="text-[#9C6B4F]" />,
      title: "Living wages",
      desc: "At every facility"
    },
    {
      icon: <Globe size={20} className="text-[#9C6B4F]" />,
      title: "86 countries",
      desc: "Worldwide shipping"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#5C4033] via-[#8B6B52] to-[#C69C72] py-24 md:py-32 lg:py-40">
        <div className="container-custom text-center text-white">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/70 mb-6">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8">
            Fashion that <span className="italic font-medium">means</span> something.
          </h1>
          <p className="text-white/80 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Founded in 2019 by a tiny team of designers who were tired of beige. 
            NOVA exists for people who use clothing to say something.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Atelier"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Text & Stats */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#5C4033]">
                  Made well, made loud.
                </h2>
                <p className="text-[#8B6B52] text-sm md:text-base leading-relaxed font-medium">
                  Every piece is produced in small batches across family-run ateliers in Portugal, 
                  Italy and Vietnam. We pay above living wage everywhere we operate, 
                  and publish our suppliers publicly.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map((item, index) => (
                  <div key={index} className="bg-[#E7D7C9]/40 p-6 rounded-2xl flex items-start gap-4 hover:bg-[#E7D7C9]/60 transition-colors border border-[#E7D7C9]">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h4 className="text-xs font-bold text-[#5C4033] uppercase tracking-wider mb-1">{item.title}</h4>
                      <p className="text-[11px] text-[#8B6B52] font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-b from-transparent to-[#E7D7C9]/30 py-24 md:py-32">
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
      </section>
    </div>
  );
}
