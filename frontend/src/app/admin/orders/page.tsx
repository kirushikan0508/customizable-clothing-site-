"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Eye, Filter, ShoppingBag } from "lucide-react";
import { motion, Variants } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import type { IOrder, OrderStatus } from "@/types";

const statusOptions: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "delivered": return "bg-[#E7D7C9] text-[#5C4033]";
    case "cancelled": return "bg-red-50 text-red-600";
    case "shipped": return "bg-accent/20 text-accent-dark";
    case "processing": return "bg-surface-dark/20 text-primary";
    default: return "bg-secondary text-muted";
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const { data } = await api.get(`/orders/admin/all?${params}`);
      setOrders(data.orders);
      setTotalPages(data.pagination.pages);
    } catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, search, statusFilter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch { toast.error("Failed to update status"); }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-10 font-sans">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Orders</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Track and process customer orders.</p>
        </div>
      </motion.div>

      {/* Filters Toolbar */}
      <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl shadow-sm border border-border flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order number..." 
            className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" 
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 custom-scrollbar">
          {["all", ...statusOptions].map((status) => (
            <button key={status} onClick={() => { setStatusFilter(status); setPage(1); }}
              className={cn("px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-primary text-secondary shadow-md shadow-primary/20 border border-primary" 
                  : "bg-secondary/50 border border-border text-primary hover:bg-surface-dark/10")}>
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-primary font-serif">
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Order Details</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest hidden md:table-cell">Customer</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest hidden sm:table-cell">Date</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Total Amount</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Status</th>
                <th className="text-right py-4 px-6 font-bold text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="p-6"><div className="h-10 bg-secondary rounded w-full"></div></td>
                    <td className="p-6 hidden md:table-cell"><div className="h-4 bg-secondary rounded w-24"></div></td>
                    <td className="p-6 hidden sm:table-cell"><div className="h-4 bg-secondary rounded w-20"></div></td>
                    <td className="p-6"><div className="h-4 bg-secondary rounded w-16"></div></td>
                    <td className="p-6"><div className="h-8 bg-secondary rounded-full w-24"></div></td>
                    <td className="p-6"><div className="h-8 bg-secondary rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : orders.map((order) => (
                <motion.tr variants={itemVariants} key={order._id} className="hover:bg-secondary/30 transition-colors group bg-white">
                  <td className="py-4 px-6">
                    <p className="font-bold text-primary">{order.orderNumber}</p>
                    <p className="text-[10px] text-muted mt-1 tracking-wider">{order.items.length} items • <span className="uppercase font-bold text-accent-dark">{order.paymentMethod}</span></p>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface text-primary flex items-center justify-center font-serif font-bold text-xs shadow-sm border border-accent/20">
                        {typeof order.user === "object" ? order.user.name.charAt(0) : "U"}
                      </div>
                      <span className="font-bold text-primary">{typeof order.user === "object" ? order.user.name : "Guest"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell text-muted font-medium text-xs uppercase tracking-wide">{formatDate(order.createdAt)}</td>
                  <td className="py-4 px-6 font-serif font-bold text-primary text-base">{formatPrice(order.totalAmount)}</td>
                  <td className="py-4 px-6">
                    <div className="relative inline-block">
                      <select 
                        value={order.orderStatus} 
                        onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                        className={cn(
                          "text-[10px] px-3 py-1.5 font-bold border border-transparent rounded-md appearance-none cursor-pointer uppercase tracking-widest pr-8 transition-all outline-none",
                          getStatusStyles(order.orderStatus),
                          "focus:border-accent"
                        )}
                      >
                        {statusOptions.map((s) => <option key={s} value={s} className="text-primary bg-white font-medium">{s}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/order-confirmation/${order._id}`} className="p-2 text-muted hover:text-primary hover:bg-surface rounded-lg inline-flex transition-colors opacity-0 group-hover:opacity-100" title="View Order Details">
                      <Eye size={18} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
          
          {!isLoading && orders.length === 0 && (
            <div className="text-center text-muted py-16 flex flex-col items-center bg-white">
              <ShoppingBag size={48} className="text-surface-dark mb-4 opacity-50" />
              <p className="text-lg font-serif font-bold text-primary">No orders found</p>
              <p className="text-xs uppercase tracking-wider mt-2">Try adjusting your filters or wait for new orders.</p>
            </div>
          )}
        </div>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={cn("w-10 h-10 rounded-xl text-sm font-bold transition-colors", page === p ? "bg-primary text-secondary shadow-md shadow-primary/20" : "bg-white border border-border text-muted hover:bg-surface hover:text-primary")}>
              {p}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
