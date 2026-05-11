"use client";

import { Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function InstagramFeed() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      size: "large",
    },
    {
      url: "https://images.unsplash.com/photo-1434389678369-182cb1294ee3?q=80&w=600&auto=format&fit=crop",
      size: "small",
    },
    {
      url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
      size: "small",
    },
    {
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
      size: "medium",
    },
    // {
    //   url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
    //   size: "small",
    // },
    // {
    //   url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    //   size: "small",
    // },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#F5F1EC]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-[#9C6B4F] mb-4"
          >
            Join the Community
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
          >
            As seen on Instagram
          </motion.h2>

          <motion.a
            href="https://www.instagram.com/novafashion"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-[#8B6B52] hover:text-[#5C4033] transition-colors border-b border-[#8B6B52] pb-1"
          >
            @novafashion
          </motion.a>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:h-[500px]">
          {/* Main Large Image */}
          <motion.a
            href="https://www.instagram.com/novafashion"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-2 row-span-2 relative group overflow-hidden rounded-[32px] shadow-sm block"
          >
            <img
              src={images[0].url}
              alt="Instagram Post"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Camera className="text-white mx-auto mb-3" size={32} />

                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  View Post
                </span>
              </div>
            </div>
          </motion.a>

          {/* Medium Image */}
          <motion.a
            href="https://www.instagram.com/novafashion"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-2 row-span-1 relative group overflow-hidden rounded-[32px] shadow-sm h-[200px] md:h-auto block"
          >
            <img
              src={images[3].url}
              alt="Instagram Post"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <Camera className="text-white" size={24} />
            </div>
          </motion.a>

          {/* Small Images */}
          {images
            .slice(1, 3)
            .concat(images.slice(4))
            .map((img, i) => (
              <motion.a
                key={i}
                href="https://www.instagram.com/novafashion"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="col-span-1 row-span-1 relative group overflow-hidden rounded-[24px] md:rounded-[32px] shadow-sm aspect-square md:aspect-auto block"
              >
                <img
                  src={img.url}
                  alt="Instagram Post"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <Camera className="text-white" size={20} />
                </div>
              </motion.a>
            ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://www.instagram.com/novafashion"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 rounded-full border border-[#5C4033] text-[#5C4033] text-xs font-bold uppercase tracking-widest hover:bg-[#5C4033] hover:text-white transition-all duration-300 inline-block"
          >
            Follow our journey
          </a>
        </div>
      </div>
    </section>
  );
}