"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const COLORS = ["#5C4033", "#C69C72", "#8B6B52", "#9C6B4F", "#6F4E37", "#E7D7C9"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/dashboard")
      .then(({ data }) => setStats(data))
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 h-32 rounded-2xl shadow-sm border border-border skeleton" />
        ))}
      </div>
    );
  }

  const s = stats?.stats || {};
  const monthlyData = (stats?.monthlyRevenue || []).map((m: any) => ({
    name: `${m._id.month}/${m._id.year}`,
    revenue: m.revenue,
    orders: m.orders,
  }));

  const statusData = (stats?.orderStatusDist || []).map((d: any) => ({
    name: d._id, value: d.count,
  }));

  const statCards = [
    { label: "Total Revenue", value: formatPrice(s.totalRevenue || 0), icon: DollarSign, bg: "bg-[#F5F1EC]", text: "text-primary" },
    { label: "Total Orders", value: s.totalOrders || 0, icon: ShoppingCart, bg: "bg-[#E7D7C9]", text: "text-primary" },
    { label: "Products", value: s.totalProducts || 0, icon: Package, bg: "bg-[#F5F1EC]", text: "text-accent-dark" },
    { label: "Customers", value: s.totalCustomers || 0, icon: Users, bg: "bg-[#E7D7C9]", text: "text-accent-dark" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 font-sans">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Overview</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Here's what's happening with your store today.</p>
        </div>
      </motion.div>

      {/* Stat cards (Bento Grid Style) */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-bl-full -z-10 opacity-50`} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">{card.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${card.bg} ${card.text}`}>
                <card.icon size={20} className="group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <p className="font-serif text-3xl font-bold text-primary">{card.value}</p>
            <p className="text-xs text-primary mt-2 flex items-center gap-1 font-medium bg-surface w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} /> +12% from last month
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-primary">Revenue Analytics</h3>
            <select className="text-xs border-border rounded-lg text-muted focus:ring-accent focus:border-accent py-1.5 pl-3 pr-8 bg-secondary uppercase tracking-widest font-semibold cursor-pointer outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7D7C9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B6B52' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B6B52' }} tickFormatter={(val) => `Rs.${val / 1000}k`} />
                <Tooltip cursor={{ fill: '#F5F1EC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#5C4033' }} />
                <Bar dataKey="revenue" fill="#C69C72" radius={[6, 6, 6, 6]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order status pie */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col">
          <h3 className="font-serif text-xl font-bold text-primary mb-2">Order Status</h3>
          <p className="text-xs uppercase tracking-wider text-muted mb-6">Distribution of current orders</p>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                    {statusData.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {statusData.map((d: any, i: number) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="capitalize text-muted font-medium text-xs tracking-wide">{d.name}</span>
                  <span className="ml-auto text-primary font-bold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid for Lists */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-white">
            <h3 className="font-serif text-xl font-bold text-primary">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-accent-dark hover:text-primary font-bold flex items-center gap-1 group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="divide-y divide-border flex-1 bg-secondary/30">
            {(stats?.recentOrders || []).slice(0, 5).map((order: any) => (
              <div key={order._id} className="p-4 sm:px-6 hover:bg-secondary/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface text-primary flex items-center justify-center font-serif font-bold text-sm shrink-0 shadow-sm border border-accent/20 group-hover:scale-105 transition-transform">
                    {order.user?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{order.user?.name || "Guest User"}</p>
                    <p className="text-xs text-muted font-medium">{order.orderNumber} • {formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                  <span className={cn(
                    "inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md",
                    order.orderStatus === "delivered" ? "bg-[#E7D7C9] text-[#5C4033]" :
                      order.orderStatus === "cancelled" ? "bg-red-50 text-red-600" :
                        "bg-surface text-primary"
                  )}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <div className="p-8 text-center text-muted text-sm font-medium">No recent orders found</div>
            )}
          </div>
        </motion.div>

        {/* Low stock alerts */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex justify-between items-center bg-white">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
              <AlertTriangle size={20} className="text-accent" /> Low Stock Alerts
            </h3>
          </div>
          <div className="divide-y divide-border flex-1 bg-secondary/30">
            {(stats?.lowStock || []).slice(0, 5).map((product: any) => (
              <div key={product._id} className="p-4 sm:px-6 hover:bg-secondary/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface shrink-0 overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform">
                    {product.images?.[0]?.url && (
                      <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary line-clamp-1">{product.title}</p>
                    <p className="text-xs text-muted font-medium mt-0.5">{formatPrice(product.price)}</p>
                  </div>
                </div>
                <div className="bg-accent/20 text-accent-dark px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                  {product.stock} left
                </div>
              </div>
            ))}
            {(!stats?.lowStock || stats.lowStock.length === 0) && (
              <div className="p-8 text-center text-muted text-sm flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-surface text-primary rounded-full flex items-center justify-center mb-2 shadow-sm border border-accent/20">
                  <Package size={24} />
                </div>
                <p className="font-bold">Inventory is looking good!</p>
                <p className="text-xs uppercase tracking-wider">No low stock alerts at this time.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
