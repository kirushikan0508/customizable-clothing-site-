"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "@/components/ui/ProductCard";
import StarRating from "@/components/ui/StarRating";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import api from "@/lib/axios";
import { cn, formatPrice, getDiscountPercent, formatDate } from "@/lib/utils";
import type { IProduct, IReview } from "@/types";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0].size);
        if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0].name);
        // Fetch reviews
        const revData = await api.get(`/products/${data.product._id}/reviews`);
        setReviews(revData.data.reviews);
      } catch { toast.error("Failed to load product"); }
      finally { setIsLoading(false); }
    };
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error("Please login to add to cart");
    if (!selectedSize) return toast.error("Please select a size");
    try {
      await addToCart(product!._id, quantity, selectedSize, selectedColor);
      toast.success("Added to cart!");
    } catch { toast.error("Failed to add to cart"); }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return toast.error("Please login to buy");
    if (!selectedSize) return toast.error("Please select a size");
    try {
      const { setBuyNowItem } = useCartStore.getState();
      setBuyNowItem({
        _id: "buynow", // temporary ID
        product: product!,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
        price: product!.discountPrice || product!.price
      });
      router.push("/checkout");
    } catch { toast.error("Failed to process order"); }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error("Please login to manage wishlist");
    const isFavorite = isInWishlist(product!._id);
    try {
      await toggleWishlist(product!._id);
      if (isFavorite) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    } catch { toast.error("Failed to update wishlist"); }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-gray-200 skeleton" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 bg-gray-200 skeleton rounded" />
            <div className="h-8 w-2/3 bg-gray-200 skeleton rounded" />
            <div className="h-6 w-1/4 bg-gray-200 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="container-custom py-20 text-center"><p>Product not found</p></div>;

  const discount = getDiscountPercent(product.price, product.discountPrice);
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface py-3 border-b border-border">
        <div className="container-custom flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-primary truncate">{product.title}</span>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div
              className="relative aspect-[3/4] overflow-hidden bg-surface cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={product.images?.[selectedImage]?.url || "/placeholder.jpg"}
                alt={product.title}
                fill
                className={cn("object-cover transition-transform duration-300", isZoomed && "scale-150")}
                style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5">-{discount}%</span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={cn("relative w-20 h-24 shrink-0 overflow-hidden border-2 transition-colors",
                      selectedImage === i ? "border-primary" : "border-transparent hover:border-gray-300")}>
                    <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="section-subheading mb-2">{product.brand}</p>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold">{product.title}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.ratings} size={18} />
              <span className="text-sm text-muted">({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.discountPrice || product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className={cn("text-sm font-medium", inStock ? "text-green-600" : "text-red-500")}>
              {inStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3">Color: {selectedColor}</p>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button key={c.hex} onClick={() => setSelectedColor(c.name)}
                      className={cn("w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === c.name ? "border-primary scale-110 ring-2 ring-primary/20" : "border-gray-300")}
                      style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3">Size: {selectedSize}</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s) => (
                    <button key={s.size} onClick={() => setSelectedSize(s.size)} disabled={s.stock === 0}
                      className={cn("w-14 h-12 border text-sm font-medium transition-all",
                        selectedSize === s.size ? "bg-primary text-white border-primary" : "border-border hover:border-primary",
                        s.stock === 0 && "opacity-30 cursor-not-allowed line-through")}>
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-surface">
                  <Minus size={16} />
                </button>
                <span className="w-14 h-12 flex items-center justify-center text-sm font-medium border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-12 h-12 flex items-center justify-center hover:bg-surface">
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAddToCart} disabled={!inStock} className="btn-secondary flex-1 py-4 disabled:opacity-50">
                <ShoppingBag size={18} /> Add to Cart
              </button>

              <button onClick={handleBuyNow} disabled={!inStock} className="btn-primary flex-1 py-4 disabled:opacity-50">
                Buy Now
              </button>

              <button onClick={handleWishlist}
                className={cn("w-12 h-12 border flex items-center justify-center transition-colors",
                  product && isInWishlist(product._id) ? "bg-red-50 border-red-200 text-red-500" : "border-border hover:bg-surface")}>
                <Heart size={18} fill={product && isInWishlist(product._id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {[
                { icon: Truck, label: "Free Shipping", sub: "On orders Rs. 999+" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30 day returns" },
                { icon: Shield, label: "Secure", sub: "COD Available" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon size={20} className="mx-auto mb-2 text-muted" />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px] text-muted">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="pt-6 border-t border-border">
              <div className="flex gap-6 border-b border-border mb-6">
                {(["description", "reviews"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn("pb-3 text-sm uppercase tracking-wider font-medium transition-colors border-b-2 -mb-px",
                      activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary")}>
                    {tab === "reviews" ? `Reviews (${product.numReviews})` : "Description"}
                  </button>
                ))}
              </div>
              {activeTab === "description" ? (
                <p className="text-sm text-muted leading-relaxed">{product.description}</p>
              ) : (
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map((r) => (
                    <div key={r._id} className="border-b border-border pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <StarRating rating={r.rating} size={14} />
                        <span className="text-sm font-medium">{r.user?.name}</span>
                        <span className="text-xs text-muted">{formatDate(r.createdAt)}</span>
                      </div>
                      <p className="text-sm text-muted">{r.comment}</p>
                    </div>
                  )) : <p className="text-sm text-muted">No reviews yet.</p>}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="section-heading text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
