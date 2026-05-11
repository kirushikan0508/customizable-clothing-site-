"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);

  const fetch = () => {
    setIsLoading(true);
    api.get("/categories/admin/all")
      .then(({ data }) => setCategories(data.categories))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };
  
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) { await api.put(`/categories/${editId}`, form); toast.success("Category updated successfully"); }
      else { await api.post("/categories", form); toast.success("Category created successfully"); }
      setForm({ name: "", description: "" }); setEditId(null); setShowForm(false); fetch();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error saving category"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    await api.delete(`/categories/${id}`); toast.success("Category deleted"); fetch();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 pb-10 font-sans">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Categories</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Organize your products into distinct categories.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", description: "" }); }} 
          className="btn-primary py-3 px-6 shadow-md border border-accent/20 flex items-center gap-2"
        >
          {showForm ? <span className="font-bold uppercase tracking-widest px-1">Cancel</span> : <><Plus size={18} /> <span className="font-bold uppercase tracking-widest">Add Category</span></>}
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0, scale: 0.95 }} 
            animate={{ opacity: 1, height: "auto", scale: 1 }} 
            exit={{ opacity: 0, height: 0, scale: 0.95, margin: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-5 overflow-hidden"
          >
            <h3 className="font-serif text-xl font-bold text-primary">{editId ? "Edit Category" : "Create New Category"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="e.g. Summer Collection" 
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" required 
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="Brief description of this category..." 
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" 
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary py-3 px-6 shadow-md border border-accent/20 font-bold uppercase tracking-widest text-xs">
                {editId ? "Update Category" : "Save Category"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        <motion.div variants={containerVariants} className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 flex items-center justify-between animate-pulse bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-xl"></div>
                  <div><div className="w-32 h-4 bg-secondary rounded mb-2"></div><div className="w-24 h-3 bg-secondary rounded"></div></div>
                </div>
                <div className="flex gap-2"><div className="w-8 h-8 bg-secondary rounded-lg"></div><div className="w-8 h-8 bg-secondary rounded-lg"></div></div>
              </div>
            ))
          ) : categories.map((c) => (
            <motion.div variants={itemVariants} key={c._id} className="p-6 flex justify-between items-center hover:bg-secondary/30 transition-colors group bg-white">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl gradient-gold text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-accent/20 group-hover:scale-105 transition-transform shadow-sm">
                  <Tag size={18} />
                </div>
                <div>
                  <p className="font-bold text-primary">{c.name}</p>
                  <p className="text-[10px] text-muted mt-1 uppercase tracking-widest font-bold">
                    /{c.slug} {!c.isActive && <span className="text-accent-dark ml-2">• Inactive</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setForm({ name: c.name, description: c.description }); setEditId(c._id); setShowForm(true); }} className="p-2 text-muted hover:text-accent-dark hover:bg-surface rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(c._id)} className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {!isLoading && categories.length === 0 && (
            <div className="text-center text-muted py-16 flex flex-col items-center bg-white">
              <Tag size={48} className="text-surface-dark mb-4 opacity-50" />
              <p className="text-lg font-serif font-bold text-primary">No categories found</p>
              <p className="text-xs uppercase tracking-wider mt-2">Create your first category to start organizing products.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
