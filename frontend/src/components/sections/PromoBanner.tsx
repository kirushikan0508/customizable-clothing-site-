"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PromoBanner() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Banner */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#DBCBBD] rounded-[32px] p-10 md:p-14 flex flex-col justify-center min-h-[300px]"
          >
            <p className="text-white text-xs uppercase tracking-widest font-medium mb-3">Summer Sale</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-8 max-w-xs">
              Up to 40% off summer wardrobe
            </h2>
            <Link
              href="/shop?sale=true"
              className="bg-white text-[#5C4033] px-8 py-3 rounded-full font-medium text-sm w-fit hover:bg-gray-100 transition-colors"
            >
              Shop now
            </Link>
          </motion.div>

          {/* Right Banner */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#5C4033] rounded-[32px] p-10 md:p-14 flex flex-col justify-center min-h-[300px]"
          >
            <p className="text-white/70 text-xs uppercase tracking-widest font-medium mb-3">Newsletter</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-8 max-w-xs">
              Early access to every drop
            </h2>
            <Link
              href="#newsletter"
              className="bg-[#8B6B52] bg-opacity-40 text-white px-8 py-3 rounded-full font-medium text-sm w-fit hover:bg-opacity-60 border border-white/20 transition-colors"
            >
              Subscribe
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
