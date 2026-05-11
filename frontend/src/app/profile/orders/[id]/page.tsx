"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck, Calendar, CreditCard, Check, X } from "lucide-react";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { IOrder } from "@/types";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .catch(() => {
        // toast.error("Failed to load order");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-20 text-center shadow-sm border border-[#E7D7C9]/50">
        <div className="w-12 h-12 border-4 border-[#9C6B4F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8B6B52] font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-[32px] p-20 text-center shadow-sm border border-[#E7D7C9]/50">
        <p className="text-[#5C4033] font-bold text-xl mb-4">Order not found</p>
        <button onClick={() => router.back()} className="text-[#9C6B4F] font-medium flex items-center justify-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-50 text-green-700 border-green-100";
      case "shipped": return "bg-blue-50 text-blue-700 border-blue-100";
      case "processing": return "bg-[#9C6B4F]/10 text-[#9C6B4F] border-[#9C6B4F]/20";
      case "cancelled": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStep = steps.indexOf(order.orderStatus.toLowerCase());
  const isCancelled = order.orderStatus.toLowerCase() === "cancelled";

  return (
    <div className="space-y-6">
      {/* Status Tracker */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-[#E7D7C9]/50">
        <h3 className="text-sm font-bold text-[#5C4033] uppercase tracking-wider mb-8">Tracking status</h3>
        
        {isCancelled ? (
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <X size={20} />
            </div>
            <div>
              <p className="font-bold text-red-700">Order Cancelled</p>
              <p className="text-xs text-red-600 font-medium">This order has been cancelled and will not be processed.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-[#F5F1EC] z-0" />
            <div 
              className="absolute top-5 left-0 h-0.5 bg-[#9C6B4F] transition-all duration-1000 z-0" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
            
            <div className="relative z-10 flex justify-between items-start">
              {steps.map((step, i) => {
                const isActive = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step} className="flex flex-col items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4",
                      isActive ? "bg-[#9C6B4F] border-[#9C6B4F] text-white shadow-lg" : "bg-white border-[#F5F1EC] text-[#C69C72]",
                      isCurrent && "ring-4 ring-[#9C6B4F]/20 scale-110"
                    )}>
                      {i === 0 && <Calendar size={16} />}
                      {i === 1 && <Package size={16} />}
                      {i === 2 && <Truck size={16} />}
                      {i === 3 && <Check size={16} />}
                    </div>
                    <div className="text-center">
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        isActive ? "text-[#5C4033]" : "text-[#C69C72]"
                      )}>{step}</p>
                      {isCurrent && <p className="text-[9px] text-[#9C6B4F] font-bold mt-0.5">Current</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#E7D7C9]/50">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full border border-[#E7D7C9] flex items-center justify-center text-[#8B6B52] hover:bg-[#F5F1EC] transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#5C4033]">Order #{order.orderNumber}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-[#9C6B4F]" />
                <p className="text-sm text-[#8B6B52] font-medium">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>
          <span className={cn(
            "px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border shadow-sm",
            getStatusStyles(order.orderStatus)
          )}>
            {order.orderStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-[#E7D7C9] pt-10">
          {/* Items */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#5C4033] font-bold">
              <Package size={20} />
              <h3 className="font-serif text-xl">Items Ordered</h3>
            </div>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#F5F1EC]/30 border border-[#E7D7C9]/50">
                  <div className="w-20 h-24 bg-white rounded-lg overflow-hidden shrink-0 shadow-sm border border-[#E7D7C9]">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#C69C72] bg-[#F5F1EC]"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="text-[#5C4033] font-bold text-sm leading-tight mb-1">{item.title}</h4>
                    <p className="text-[11px] font-bold text-[#9C6B4F] uppercase tracking-wider mb-2">
                      {item.size} {item.color && `• ${item.color}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#8B6B52]">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#5C4033]">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5C4033] font-bold">
                <MapPin size={20} />
                <h3 className="font-serif text-xl">Shipping Address</h3>
              </div>
              <div className="p-6 rounded-2xl bg-[#F5F1EC]/30 border border-[#E7D7C9]/50 space-y-1">
                <p className="font-bold text-[#5C4033]">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-[#8B6B52] font-medium">{order.shippingAddress.street}</p>
                <p className="text-sm text-[#8B6B52] font-medium">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-[#8B6B52] font-medium">{order.shippingAddress.country}</p>
                <p className="text-sm text-[#9C6B4F] font-bold pt-2">📞 {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#5C4033] font-bold">
                <CreditCard size={20} />
                <h3 className="font-serif text-xl">Payment & Summary</h3>
              </div>
              <div className="p-6 rounded-2xl bg-[#F5F1EC]/30 border border-[#E7D7C9]/50 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8B6B52] font-medium uppercase tracking-wider text-[10px]">Payment Method</span>
                  <span className="font-bold text-[#5C4033] uppercase">{order.paymentMethod}</span>
                </div>
                <div className="h-px bg-[#E7D7C9]" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B6B52]">Subtotal</span>
                    <span className="text-[#5C4033] font-medium">{formatPrice(order.itemsTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B6B52]">Shipping</span>
                    <span className="text-[#5C4033] font-medium">{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-[#5C4033] pt-2">
                    <span>Total Amount</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
