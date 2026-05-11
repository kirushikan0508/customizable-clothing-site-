"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import api from "@/lib/axios";
import type { IProduct } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  queryParams: string;
  viewAllHref: string;
  limit?: number;
  compact?: boolean;
  icon?: React.ReactNode;
}

export default function ProductSection({
  title, subtitle, queryParams, viewAllHref, limit = 8, compact = false, icon
}: ProductSectionProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products?${queryParams}&limit=${limit}`);
        setProducts(data.products);
      } catch {
        // Use empty array on error
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [queryParams, limit]);

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex items-end justify-between ${compact ? 'mb-6' : 'mb-10'} gap-4`}
      >
        <div>
          {subtitle && !compact && <p className="section-subheading mb-3">{subtitle}</p>}
          <h2 className={`${compact ? 'text-2xl font-serif font-bold flex items-center gap-2 text-primary' : 'section-heading'}`}>
            {icon} {title}
          </h2>
        </div>
        {!compact && (
          <Link
            href={viewAllHref}
            className="text-sm font-medium hover:text-[#C69C72] transition-colors border-b border-primary pb-0.5"
          >
            View all
          </Link>
        )}
      </motion.div>

      {isLoading ? (
        <SkeletonCard count={limit} />
      ) : products.length > 0 ? (
        <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4 md:gap-6`}>
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted py-12">No products found</p>
      )}
    </>
  );

  if (compact) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <section className="py-16 md:py-20 bg-secondary">
      <div className="container-custom">
        {content}
      </div>
    </section>
  );
}
