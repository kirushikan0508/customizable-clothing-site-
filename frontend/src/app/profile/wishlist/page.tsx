"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import ProductCard from "@/components/ui/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistPage() {
  const { wishlist, fetchWishlist, isLoading } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { if (isAuthenticated) fetchWishlist(); }, [isAuthenticated, fetchWishlist]);

  if (isLoading) return <div className="bg-white p-8 text-center"><p>Loading...</p></div>;
  if (wishlist.length === 0) return <EmptyState type="wishlist" />;

  return (
    <div>
      <div className="bg-white p-6 mb-6">
        <h2 className="font-serif text-xl font-bold">My Wishlist ({wishlist.length})</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {wishlist.map((product, i) => (
          <ProductCard key={product._id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
