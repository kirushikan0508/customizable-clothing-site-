"use client";
import { useEffect, useState } from "react";
import { Search, Mail, Calendar, UserRound } from "lucide-react";
import { motion, Variants } from "framer-motion";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    api.get(`/users/admin/customers?${p}`)
      .then(({ data }) => setCustomers(data.customers))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [search]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-10 font-sans">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Customers</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Manage and view your registered customers.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search customers by name or email..." 
            className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" 
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-primary font-serif">
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Customer</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest hidden md:table-cell">Contact Info</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Joined Date</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="p-6"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-secondary rounded-full"></div><div className="h-4 bg-secondary rounded w-24"></div></div></td>
                    <td className="p-6 hidden md:table-cell"><div className="h-4 bg-secondary rounded w-48"></div></td>
                    <td className="p-6"><div className="h-4 bg-secondary rounded w-24"></div></td>
                  </tr>
                ))
              ) : customers.map((c) => (
                <motion.tr variants={itemVariants} key={c._id} className="hover:bg-secondary/30 transition-colors group bg-white">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full gradient-gold text-primary flex items-center justify-center font-bold font-serif text-sm shrink-0 border border-accent/20 group-hover:scale-105 transition-transform shadow-sm">
                        {c.name?.charAt(0) || <UserRound size={16} />}
                      </div>
                      <span className="font-bold text-primary">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="flex items-center gap-3 text-muted font-medium group-hover:text-primary transition-colors">
                      <Mail size={16} className="opacity-70 text-accent" />
                      <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-muted font-medium text-xs uppercase tracking-wide">
                      <Calendar size={16} className="opacity-70 text-accent" />
                      {formatDate(c.createdAt)}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>

          {!isLoading && customers.length === 0 && (
            <div className="text-center text-muted py-16 flex flex-col items-center bg-white">
              <UserRound size={48} className="text-surface-dark mb-4 opacity-50" />
              <p className="text-lg font-serif font-bold text-primary">No customers found</p>
              <p className="text-xs uppercase tracking-wider mt-2">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
