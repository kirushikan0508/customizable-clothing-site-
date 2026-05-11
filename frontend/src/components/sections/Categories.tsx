"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { name: "Plain T-Shirts", slug: "plain-t-shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", count: "120" },
  { name: "Printed T-Shirts", slug: "printed-t-shirts", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", count: "85" },
  { name: "Normal T-Shirts", slug: "normal-t-shirts", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop", count: "95" },
];

export default function Categories() {
  return (
    <section className="py-16 md:py-20 bg-secondary">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="section-subheading mb-2">Explore By</p>
            <h2 className="section-heading">Categories</h2>
          </div>
          <Link href="/categories" className="text-sm font-medium hover:text-[#C69C72] transition-colors border-b border-primary pb-0.5">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group block relative aspect-[4/5] rounded-[32px] overflow-hidden bg-surface"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p className="text-white/80 text-xs tracking-widest uppercase mb-1">{cat.count} Products</p>
                  <h3 className="text-white font-serif text-2xl md:text-3xl font-bold">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
