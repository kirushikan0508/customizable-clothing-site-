"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, Truck } from "lucide-react";
import api from "@/lib/axios";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import type { IOrder } from "@/types";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(() => {});
  }, [id]);

  if (!order) return <div className="container-custom py-20 text-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-surface">
      <div className="container-custom py-12 md:py-20 max-w-3xl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-muted">Thank you for your order. We&apos;ll send updates to your email.</p>
          <p className="text-sm font-medium mt-4">Order Number: <span className="text-accent font-bold">{order.orderNumber}</span></p>
        </motion.div>

        <div className="bg-white p-6 md:p-8 space-y-6">
          {/* Order details */}
          <div className="flex flex-wrap gap-6 justify-between text-sm">
            <div><p className="text-xs text-muted uppercase tracking-wider mb-1">Date</p><p className="font-medium">{formatDate(order.createdAt)}</p></div>
            <div><p className="text-xs text-muted uppercase tracking-wider mb-1">Payment</p><p className="font-medium uppercase">{order.paymentMethod}</p></div>
            <div><p className="text-xs text-muted uppercase tracking-wider mb-1">Status</p>
              <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
            </div>
            <div><p className="text-xs text-muted uppercase tracking-wider mb-1">Total</p><p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p></div>
          </div>

          {/* Items */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><Package size={16} /> Items</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="w-16 h-20 bg-gray-100 shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted">{item.size} {item.color && `/ ${item.color}`} × {item.quantity}</p>
                </div>
                <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MapPin size={16} /> Shipping Address</h3>
            <p className="text-sm text-muted">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link href="/profile/orders" className="btn-secondary">View All Orders</Link>
          <Link href="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
