"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-auto md:min-h-[85vh] overflow-hidden bg-gradient-to-br from-[#8B6B52] via-[#C69C72] to-[#F5F1EC] pb-12 pt-16 md:pt-24 md:pb-24">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1)_0%,transparent_50%)] pointer-events-none" />

      <div className="container-custom h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center h-full">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full w-fit mb-8 border border-white/30 text-sm font-medium"
            >
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span>4.9/5 Average rating</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-serif text-6xl md:text-7xl lg:text-[90px] font-bold leading-[0.9] tracking-tight mb-6"
            >
              Wear <br />
              Your <br />
              <span className="italic font-medium text-[#E7D7C9]">Color.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-base md:text-lg max-w-md mb-10 leading-relaxed font-light"
            >
              Find your perfect shade, embrace your vibe.
              Design that speaks for your personality and looks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 mb-16 lg:mb-24"
            >
              <Link href="/shop" className="bg-white text-[#5C4033] px-8 py-3.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors">
                Shop T-Shirts
              </Link>
              <Link href="/shop?filter=new" className="bg-transparent border border-white text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-white/10 transition-colors">
                Explore
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-8 md:gap-12 text-white"
            >
              <div>
                <p className="text-3xl font-serif font-bold">300k+</p>
                <p className="text-xs text-white/80 uppercase tracking-widest mt-1">Happy customers</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold">4.9/5</p>
                <p className="text-xs text-white/80 uppercase tracking-widest mt-1">Average rating</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold">5k+</p>
                <p className="text-xs text-white/80 uppercase tracking-widest mt-1">Excellent reviews</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Staggered Images layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] w-full hidden lg:block"
          >
            {/* Left tall image */}
            <div className="absolute left-0 top-10 w-[45%] h-[500px] rounded-[32px] overflow-hidden shadow-xl z-20 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop"
                alt="Man wearing plain white t-shirt"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Right top medium image */}
            <div className="absolute right-0 top-0 w-[48%] h-[350px] rounded-[32px] overflow-hidden shadow-lg z-10 bg-gray-300">
              <img
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
                alt="Woman wearing printed t-shirt"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right bottom small image */}
            <div className="absolute right-0 bottom-10 w-[48%] h-[180px] rounded-3xl overflow-hidden shadow-lg z-30 bg-gray-900 border-4 border-white/10">
              <img
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop"
                alt="Folded stack of T-shirts"
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            {/* Floating review card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-6 left-[30%] bg-white rounded-2xl p-4 shadow-xl z-40 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-full h-full object-cover" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                   <img src="https://i.pravatar.cc/100?img=5" alt="user" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-[#5C4033]">Excellent 4.9 Rating</p>
                <div className="flex text-yellow-400 mt-0.5">
                   {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400" />)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
