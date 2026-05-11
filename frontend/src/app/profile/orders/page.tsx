"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import api from "@/lib/axios";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { IOrder } from "@/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div className="bg-white rounded-[32px] p-20 text-center shadow-sm border border-[#E7D7C9]/50">
      <div className="w-12 h-12 border-4 border-[#9C6B4F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[#8B6B52] font-medium">Loading your orders...</p>
    </div>
  );

  if (orders.length === 0) return <EmptyState type="orders" />;

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-[#F5F1EC] text-[#5C4033]";
      case "shipped":
        return "bg-[#E7D7C9] text-[#9C6B4F]";
      case "processing":
        return "bg-[#9C6B4F] text-white";
      case "cancelled":
        return "bg-[#8B4513]/20 text-[#8B4513]"; // Reddish brown
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#E7D7C9]/50 min-h-[600px]">
      <h2 className="font-serif text-3xl font-bold text-[#5C4033] mb-10">Order history</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="group p-6 md:p-8 rounded-2xl border border-[#E7D7C9] hover:border-[#9C6B4F] hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-[#5C4033] tracking-tight">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</p>
                  <Link href={`/profile/orders/${order._id}`} className="text-[#9C6B4F] hover:text-[#5C4033] transition-colors">
                    <Eye size={18} />
                  </Link>
                </div>
                <p className="text-xs font-medium text-[#8B6B52]">
                  {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm transition-colors",
                  getStatusStyles(order.orderStatus)
                )}>
                  {order.orderStatus}
                </span>
                <p className="text-xl font-bold text-[#5C4033]">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
            
            {/* Hover Accent */}
            <div className="absolute left-0 top-0 h-full w-1 bg-[#9C6B4F] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
