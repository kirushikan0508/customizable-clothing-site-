"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Users, Trophy } from "lucide-react";
import { motion, Variants } from "framer-motion";
import api from "@/lib/axios";
import { formatPrice, cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState("monthly");
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.get(`/analytics/revenue?period=${period}`),
      api.get("/analytics/top-customers")
    ]).then(([revRes, custRes]) => {
      setData(revRes.data.data);
      setTopCustomers(custRes.data.topCustomers);
    }).catch(() => { })
      .finally(() => setIsLoading(false));
  }, [period]);

  const chartData = (data || []).map((d: any) => ({
    name: d._id,
    revenue: d.revenue,
    orders: d.orders,
  }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10 font-sans">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Analytics</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Deep dive into your store's performance metrics.</p>
        </div>
        <div className="bg-secondary p-1 rounded-xl flex gap-1 border border-border">
          {["daily", "weekly", "monthly"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={cn(
                "px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                period === p ? "bg-white text-primary shadow-sm" : "text-muted hover:text-primary hover:bg-white/50"
              )}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
              <DollarSign size={20} className="text-accent" /> Revenue Trend
            </h3>
          </div>
          <div className="h-[350px] w-full">
            {isLoading ? (
              <div className="w-full h-full bg-secondary animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C69C72" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C69C72" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7D7C9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B6B52' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B6B52' }} tickFormatter={(val) => `Rs.${val / 1000}k`} />
                  <Tooltip cursor={{ stroke: '#C69C72', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#5C4033' }} formatter={(val: any) => formatPrice(Number(val))} />
                  <Area type="monotone" dataKey="revenue" stroke="#C69C72" fill="url(#colorRev)" strokeWidth={3} activeDot={{ r: 6, strokeWidth: 0, fill: '#5C4033' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Orders chart */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
              <ShoppingCart size={20} className="text-accent" /> Orders Trend
            </h3>
          </div>
          <div className="h-[350px] w-full">
            {isLoading ? (
              <div className="w-full h-full bg-secondary animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7D7C9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B6B52' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8B6B52' }} />
                  <Tooltip cursor={{ fill: '#F5F1EC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#5C4033' }} />
                  <Bar dataKey="orders" fill="#5C4033" radius={[6, 6, 6, 6]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Top customers */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-white">
          <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <Trophy size={20} className="text-accent" /> Top Customers
          </h3>
        </div>
        <div className="divide-y divide-border bg-secondary/30">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-4"><div className="w-6 h-6 bg-surface rounded"></div><div className="w-10 h-10 bg-surface rounded-full"></div><div><div className="w-32 h-4 bg-surface rounded mb-2"></div><div className="w-24 h-3 bg-surface rounded"></div></div></div>
              </div>
            ))
          ) : topCustomers.map((tc, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors group">
              <div className="flex items-center gap-4">
                <span className={cn(
                  "font-serif text-xl font-bold w-6 flex justify-center",
                  i === 0 ? "text-[#D4AF37]" : i === 1 ? "text-[#C0C0C0]" : i === 2 ? "text-[#CD7F32]" : "text-muted"
                )}>
                  {i + 1}
                </span>
                <div className="w-10 h-10 gradient-gold text-primary rounded-full flex items-center justify-center font-bold shadow-sm border border-accent/30 group-hover:scale-105 transition-transform">
                  {tc.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{tc.user?.name || "Guest User"}</p>
                  <p className="text-xs text-muted font-medium">{tc.user?.email || "No email provided"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{formatPrice(tc.totalSpent)}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-dark bg-surface/50 px-2 py-0.5 rounded-md inline-block mt-1">{tc.orderCount} orders</p>
              </div>
            </div>
          ))}
          {!isLoading && topCustomers.length === 0 && (
            <div className="p-10 text-center text-muted flex flex-col items-center">
              <Users size={40} className="text-surface-dark mb-3" />
              <p className="font-bold text-primary">No customer data yet</p>
              <p className="text-xs uppercase tracking-wider mt-1">When customers place orders, they will appear here.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
