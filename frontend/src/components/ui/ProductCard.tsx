"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { cn, formatPrice, getDiscountPercent } from "@/lib/utils";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const isFavorite = isInWishlist(product._id);

  const discount = getDiscountPercent(product.price, product.discountPrice);
  const categoryName = typeof product.category === "object" ? product.category.name : "";

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist");
      return;
    }

    try {
      await toggleWishlist(product._id);
      if (isFavorite) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-transparent"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1EC] rounded-[24px]">
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <Image
            src={product.images?.[0]?.url || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Second image on hover */}
          {product.images?.[1] && (
            <Image
              src={product.images[1].url}
              alt={product.title}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Badges - Vertically stacked */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-[#E7D7C9] text-[#5C4033] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#5C4033] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              -{discount}%
            </span>
          )}
          {product.trending && (
            <span className="bg-[#C69C72] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
              Hot
            </span>
          )}
        </div>

        {/* Heart icon - Always visible */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all z-10",
            isFavorite
              ? "bg-[#5C4033] text-white"
              : "bg-white/90 backdrop-blur-sm text-[#8B6B52] hover:bg-white hover:scale-110"
          )}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={14} className={isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      {/* Product info */}
      <div className="pt-4 pb-2">
        {categoryName && (
          <p className="text-[9px] uppercase tracking-widest text-[#8B6B52] mb-1">
            {categoryName}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[13px] text-[#5C4033] leading-tight hover:text-[#9C6B4F] transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Price & Rating */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#5C4033]">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice > 0 && product.discountPrice < product.price && (
              <span className="text-[11px] text-[#A68A78] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
            <span className="text-[10px] text-[#8B6B52]">{product.ratings.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
