"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, Eye, Filter, Package } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { formatPrice, cn } from "@/lib/utils";
import type { IProduct } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const { data } = await api.get(`/products/admin/all?${params}`);
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
    } catch {} finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-10 font-sans">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Products</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Manage your store's inventory and product details.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary py-3 px-6 shadow-md border border-accent/20">
          <Plus size={18} /> Add Product
        </Link>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products by name or brand..." 
            className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" 
          />
        </div>
        <button className="px-5 py-3 bg-secondary/50 border border-border rounded-xl text-sm font-bold uppercase tracking-widest text-primary hover:bg-surface-dark/10 transition-colors flex items-center gap-2">
          <Filter size={16} /> Filters
        </button>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-primary font-serif">
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Product</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest">Price</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest hidden sm:table-cell">Stock</th>
                <th className="text-left py-4 px-6 font-bold text-xs uppercase tracking-widest hidden lg:table-cell">Status</th>
                <th className="text-right py-4 px-6 font-bold text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white">
                    <td className="p-6"><div className="h-12 bg-secondary rounded w-full"></div></td>
                    <td className="p-6 hidden md:table-cell"><div className="h-4 bg-secondary rounded w-20"></div></td>
                    <td className="p-6"><div className="h-4 bg-secondary rounded w-16"></div></td>
                    <td className="p-6 hidden sm:table-cell"><div className="h-4 bg-secondary rounded w-12"></div></td>
                    <td className="p-6 hidden lg:table-cell"><div className="h-6 bg-secondary rounded-full w-16"></div></td>
                    <td className="p-6"><div className="h-8 bg-secondary rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : products.map((product) => (
                <motion.tr variants={itemVariants} key={product._id} className="hover:bg-secondary/30 transition-colors group bg-white">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface shrink-0 overflow-hidden border border-border shadow-sm group-hover:scale-105 transition-transform">
                        {product.images?.[0]?.url && <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-primary truncate max-w-[200px]">{product.title}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted mt-1 font-bold">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell text-muted font-medium text-xs uppercase tracking-wide">
                    {typeof product.category === "object" ? product.category.name : "—"}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-serif font-bold text-primary text-base">{formatPrice(product.discountPrice || product.price)}</p>
                    {product.discountPrice > 0 && <p className="text-xs text-muted line-through mt-0.5">{formatPrice(product.price)}</p>}
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <span className={cn("text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider", product.stock <= 10 ? "bg-red-50 text-red-600" : "bg-accent/20 text-accent-dark")}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 px-6 hidden lg:table-cell">
                    <span className={cn("text-[10px] px-3 py-1 font-bold rounded-full uppercase tracking-widest", product.isActive ? "bg-[#E7D7C9] text-[#5C4033]" : "bg-surface text-muted")}>
                      {product.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/product/${product.slug}`} className="p-2 text-muted hover:text-primary hover:bg-surface rounded-lg transition-colors" title="View in store">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/admin/products/${product._id}/edit`} className="p-2 text-muted hover:text-accent-dark hover:bg-surface rounded-lg transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>

          {!isLoading && products.length === 0 && (
            <div className="text-center text-muted py-16 flex flex-col items-center bg-white">
              <Package size={48} className="text-surface-dark mb-4 opacity-50" />
              <p className="text-lg font-serif font-bold text-primary">No products found</p>
              <p className="text-xs uppercase tracking-wider mt-2">Try adjusting your search or add a new product.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-muted font-bold">Showing page <span className="text-primary">{page}</span> of <span className="text-primary">{totalPages}</span></p>
            <div className="flex justify-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={cn("w-8 h-8 rounded-lg text-sm font-bold transition-colors", page === p ? "bg-primary text-secondary shadow-md" : "bg-white border border-border text-muted hover:bg-surface hover:text-primary")}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
