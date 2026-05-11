"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Truck, CreditCard, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart, buyNowItem, setBuyNowItem } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "Sri Lanka",
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    fetchCart();
    // Pre-fill from default address
    if (user?.addresses?.length) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddress({
        fullName: def.fullName, phone: def.phone, street: def.street,
        city: def.city, state: def.state, zipCode: def.zipCode, country: def.country,
      });
    }
  }, [isAuthenticated, user, router, fetchCart]);

  const items = buyNowItem ? [buyNowItem] : (cart?.items || []);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping - discount;

  const applyCoupon = async () => {
    try {
      const { data } = await api.post("/coupons/validate", { code: couponCode, orderTotal: subtotal });
      setDiscount(data.coupon.discount);
      setCouponApplied(true);
      toast.success(`Coupon applied! You save ${formatPrice(data.coupon.discount)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.zipCode) {
      return toast.error("Please fill all address fields");
    }
    setIsSubmitting(true);
    try {
      const payload: any = {
        shippingAddress: address,
        couponCode: couponApplied ? couponCode : "",
      };

      if (buyNowItem) {
        payload.items = [{
          product: buyNowItem.product._id,
          quantity: buyNowItem.quantity,
          size: buyNowItem.size,
          color: buyNowItem.color,
          price: buyNowItem.price
        }];
      }

      const { data } = await api.post("/orders", payload);
      toast.success("Order placed successfully!");
      if (buyNowItem) setBuyNowItem(null);
      router.push(`/order-confirmation/${data.order._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <div className="container-custom py-20 text-center"><p className="text-muted">Your cart is empty</p></div>;
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white py-8 border-b border-border">
        <div className="container-custom">
          <h1 className="section-heading">Checkout</h1>
          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { icon: MapPin, label: "Address" },
              { icon: CreditCard, label: "Payment" },
              { icon: Check, label: "Confirm" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <step.icon size={14} />
                </div>
                <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
                {i < 2 && <div className="w-8 md:w-16 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping address */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6">
              <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin size={20} /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Full Name *</label>
                  <input type="text" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Phone *</label>
                  <input type="tel" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="input-field" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Street Address *</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">City *</label>
                  <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">State *</label>
                  <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">ZIP Code *</label>
                  <input type="text" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Country</label>
                  <input type="text" value={address.country} className="input-field bg-surface" readOnly />
                </div>
              </div>
            </motion.div>

            {/* Payment method */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6">
              <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} /> Payment Method
              </h2>
              <div className="border-2 border-primary p-4 flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Cash on Delivery (COD)</p>
                  <p className="text-xs text-muted">Pay when your order is delivered</p>
                </div>
                <Truck size={24} className="ml-auto text-muted" />
              </div>
            </motion.div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 text-sm">
                    <div className="relative w-12 h-16 bg-gray-100 shrink-0">
                      <img src={item.product?.images?.[0]?.url || ""} alt="" className="w-full h-full object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs">{item.product?.title}</p>
                      <p className="text-xs text-muted">{item.size} {item.color && `/ ${item.color}`}</p>
                    </div>
                    <p className="font-medium text-xs">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code" className="input-field py-2 text-xs flex-1" disabled={couponApplied} />
                  <button type="button" onClick={applyCoupon} disabled={couponApplied || !couponCode}
                    className="btn-secondary py-2 px-4 text-xs disabled:opacity-50">
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-6 py-4 disabled:opacity-50">
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
