"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowLeft, Image as ImageIcon, Save, Tag, DollarSign, Package as PackageIcon, Check, Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import type { ICategory } from "@/types";

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const defaultColors = [
  { name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1B2A4A" }, { name: "Gray", hex: "#6B7280" },
  { name: "Red", hex: "#DC2626" }, { name: "Blue", hex: "#2563EB" },
  { name: "Pink", hex: "#EC4899" }, { name: "Beige", hex: "#D2B48C" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ url: string; public_id: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "", gender: "unisex", brand: "FLAVOUR",
    price: "", discountPrice: "", featured: false, trending: false, isNewArrival: false,
  });
  const [sizes, setSizes] = useState(sizeOptions.map((s) => ({ size: s, stock: 0, enabled: false })));
  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string }[]>([]);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const toggleColor = (color: { name: string; hex: string }) => {
    setSelectedColors((prev) =>
      prev.find((c) => c.hex === color.hex) ? prev.filter((c) => c.hex !== color.hex) : [...prev, color]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      const { data } = await api.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((prev) => [...prev, ...data.images]);
      toast.success("Images uploaded!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price) return toast.error("Please fill all required fields");
    if (images.length === 0) return toast.error("Please add at least one image");

    setIsSubmitting(true);
    try {
      const activeSizes = sizes.filter((s) => s.enabled).map(({ size, stock }) => ({ size, stock }));

      await api.post("/products", {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        images,
        sizes: activeSizes,
        colors: selectedColors,
        stock: activeSizes.reduce((s, sz) => s + sz.stock, 0) || 0,
      });

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally { setIsSubmitting(false); }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto pb-10 space-y-6 font-sans">
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-xl bg-white border border-border text-primary hover:bg-surface transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Add New Product</h1>
          <p className="text-sm text-muted mt-1 uppercase tracking-wider">Create a new product listing in your store.</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={containerVariants} className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 mb-6">
              <Tag size={20} className="text-accent" /> Basic Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Product Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" 
                  placeholder="e.g. Classic Premium T-Shirt" required 
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none min-h-[160px] resize-y font-medium placeholder:text-muted/60" 
                  placeholder="Provide a detailed description of the product..." required 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Brand</label>
                  <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} 
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none font-medium placeholder:text-muted/60" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Target Gender *</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} 
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none cursor-pointer font-medium"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="boys">Men / Boys</option>
                    <option value="girls">Women / Girls</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 mb-6">
              <DollarSign size={20} className="text-accent" /> Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Regular Price (Rs.) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold font-serif">Rs.</span>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} 
                    className="w-full pl-8 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-base font-serif font-bold focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none placeholder:text-muted/60" 
                    min="0" placeholder="0.00" required 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Sale Price (Rs.)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold font-serif">Rs.</span>
                  <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} 
                    className="w-full pl-8 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-base font-serif font-bold focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none placeholder:text-muted/60" 
                    min="0" placeholder="0.00" 
                  />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted mt-2 font-bold">Leave blank if the product is not on sale.</p>
              </div>
            </div>
          </motion.div>

          {/* Sizes and Stock */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 mb-6">
              <PackageIcon size={20} className="text-accent" /> Sizes & Inventory
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sizes.map((s, i) => (
                <div key={s.size} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  s.enabled ? "border-accent/40 bg-secondary" : "border-border bg-white"
                )}>
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className={cn(
                      "w-5 h-5 rounded flex items-center justify-center transition-colors border",
                      s.enabled ? "bg-primary border-primary" : "bg-white border-border"
                    )}>
                      {s.enabled && <Check size={14} className="text-secondary" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={s.enabled}
                      onChange={(e) => { const ns = [...sizes]; ns[i].enabled = e.target.checked; setSizes(ns); }} 
                    />
                    <span className={cn("text-sm font-bold uppercase tracking-widest", s.enabled ? "text-primary" : "text-muted")}>{s.size}</span>
                  </label>
                  {s.enabled && (
                    <input type="number" value={s.stock} min="0"
                      onChange={(e) => { const ns = [...sizes]; ns[i].stock = Number(e.target.value); setSizes(ns); }}
                      className="w-20 px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-bold text-center focus:ring-1 focus:ring-accent focus:border-accent outline-none font-serif" 
                      placeholder="Qty" 
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Sidebar settings */}
        <motion.div variants={containerVariants} className="space-y-6">
          {/* Organization */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary mb-4">Organization</h3>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} 
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:bg-white focus:ring-1 focus:ring-accent focus:border-accent transition-all outline-none cursor-pointer font-medium" required
              >
                <option value="">Select a category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </motion.div>

          {/* Product Flags */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary mb-4">Product Status</h3>
            <div className="space-y-4">
              {[
                { key: "featured", label: "Featured Product", desc: "Show on home page" },
                { key: "trending", label: "Trending", desc: "Mark as highly popular" },
                { key: "isNewArrival", label: "New Arrival", desc: "Highlight as a new item" },
              ].map((flag) => (
                <label key={flag.key} className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="hidden" checked={(form as any)[flag.key]}
                      onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })} 
                    />
                    <div className={cn(
                      "w-5 h-5 rounded border transition-colors flex items-center justify-center",
                      (form as any)[flag.key] ? "bg-primary border-primary" : "bg-white border-border group-hover:border-accent"
                    )}>
                      {(form as any)[flag.key] && <Check size={14} className="text-secondary" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">{flag.label}</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider font-bold mt-0.5">{flag.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Media */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <ImageIcon size={18} className="text-accent" /> Media
            </h3>
            
            <div className="space-y-4">
              {/* Image Grid Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-secondary">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                />
                <div className={cn(
                  "w-full py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all",
                  uploading ? "bg-secondary border-accent/20" : "border-border hover:border-accent/40 hover:bg-secondary/30"
                )}>
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-secondary rounded-full text-accent shadow-sm">
                        <Upload size={18} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Upload Images</p>
                    </>
                  )}
                </div>
              </div>

              {/* Manual URL Input */}
              <div className="pt-2 border-t border-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Or add by URL</p>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    id="manual-url"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs focus:bg-white focus:ring-1 focus:ring-accent transition-all outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setImages([...images, { url: val, public_id: "" }]);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("manual-url") as HTMLInputElement;
                      if (input.value) {
                        setImages([...images, { url: input.value, public_id: "" }]);
                        input.value = "";
                      }
                    }}
                    className="px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colors */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-serif text-xl font-bold text-primary mb-4">Available Colors</h3>
            <div className="flex flex-wrap gap-2.5">
              {defaultColors.map((c) => {
                const isSelected = selectedColors.find((sc) => sc.hex === c.hex);
                return (
                  <button key={c.hex} type="button" onClick={() => toggleColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all",
                      isSelected ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-md" : "hover:scale-110 shadow-sm"
                    )}
                    style={{ backgroundColor: c.hex }} title={c.name}
                  >
                    {isSelected && <Check size={14} className={c.hex === "#FFFFFF" || c.hex === "#D2B48C" ? "text-primary" : "text-white"} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </form>

      {/* Sticky Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="fixed bottom-0 left-0 lg:left-[280px] right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border z-40 flex justify-end gap-3 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]"
      >
        <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-primary hover:bg-surface transition-colors">
          Discard
        </button>
        <button onClick={handleSubmit} disabled={isSubmitting} 
          className="btn-primary py-3 px-8 shadow-md border border-accent/20 flex items-center gap-2 text-xs uppercase tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSubmitting ? "Saving Product..." : "Save Product"}
        </button>
      </motion.div>
    </motion.div>
  );
}
