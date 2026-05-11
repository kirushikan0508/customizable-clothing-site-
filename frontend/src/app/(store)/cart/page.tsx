"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated, fetchCart]);

  const handleQuantity = async (itemId: string, qty: number) => {
    try { await updateQuantity(itemId, qty); } catch { toast.error("Failed to update"); }
  };

  const handleRemove = async (itemId: string) => {
    try { await removeItem(itemId); toast.success("Removed from cart"); } catch { toast.error("Failed to remove"); }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-20">
        <EmptyState type="cart" description="Please login to view your cart" actionLabel="Login" actionHref="/login" />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white py-8 border-b border-border">
        <div className="container-custom">
          <h1 className="section-heading">Shopping Cart</h1>
          <p className="text-sm text-muted mt-1">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {items.length === 0 ? (
          <EmptyState type="cart" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-4 md:p-6 flex gap-4 md:gap-6"
                >
                  <Link href={`/product/${item.product?.slug}`} className="shrink-0">
                    <div className="relative w-24 h-32 md:w-28 md:h-36 bg-gray-100 overflow-hidden">
                      <Image
                        src={item.product?.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.product?.title || "Product"}
                        fill className="object-cover" sizes="112px"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link href={`/product/${item.product?.slug}`}>
                          <h3 className="text-sm font-medium hover:text-muted transition-colors line-clamp-2">
                            {item.product?.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <p className="text-sm font-bold whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border">
                        <button onClick={() => item.quantity > 1 && handleQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface"><Minus size={14} /></button>
                        <span className="w-10 h-8 flex items-center justify-center text-xs font-medium border-x border-border">{item.quantity}</span>
                        <button onClick={() => handleQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-surface"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => handleRemove(item._id)} className="text-muted hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-6">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && <p className="text-xs text-muted">Free shipping on orders above Rs. 999</p>}
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                    <span>Total</span><span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Link href="/checkout" className="btn-primary w-full mt-6 py-4">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                <Link href="/shop" className="btn-secondary w-full mt-3 py-3 text-xs">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
