"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid,
  ChevronRight, ArrowLeft, ArrowRight
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import type { IProduct, IPagination } from "@/types";

const sortOptions = [
  { value: "-createdAt", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Popularity" },
  { value: "rating", label: "Top Rated" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const genderOptions = [
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
  { value: "unisex", label: "Unisex" },
];
const priceRanges = [
  { label: "Under Rs.500", min: 0, max: 500 },
  { label: "Rs.500 - Rs.999", min: 500, max: 999 },
  { label: "Rs.1000 - Rs.1999", min: 1000, max: 1999 },
  { label: "Rs.2000 - Rs.2999", min: 2000, max: 2999 },
  { label: "Rs.3000+", min: 3000, max: 99999 },
];

const colorOptions = [
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Cyan", hex: "#00FFFF" },
  { name: "Green", hex: "#008000" },
  { name: "Lime", hex: "#00FF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceRange, setPriceRange] = useState(1250);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["Category", "Gender", "Price", "Color", "Size"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const debouncedSearch = useDebounce(search, 500);

  // Fetch categories
  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories)).catch(() => { });
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "12");
      params.set("sort", sort);
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category) params.set("category", category);
      if (gender) params.set("gender", gender);
      if (size) params.set("size", size);
      if (color) params.set("color", color);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, sort, debouncedSearch, category, gender, size, color, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setSearch(""); setCategory(""); setGender(""); setSize("");
    setColor(""); setMinPrice(""); setMaxPrice(""); setPriceRange(1250); setPage(1);
  };

  const hasActiveFilters = category || gender || size || color || minPrice || maxPrice || debouncedSearch;

  return (
    <div className="min-h-screen bg-[#F5F1EC]">
      <div className="container-custom py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left Column: Header + Sidebar */}
          <div className="w-full lg:w-64 lg:shrink-0">
            <div className="mb-10">
              <h1 className="font-serif text-[44px] leading-[1.1] font-bold text-[#4A3B32] mb-3">
                Shop everything
              </h1>
              <p className="text-[#8B6B52] text-[13px] font-medium">
                {pagination ? pagination.total : 36} pieces - refresh your wardrobe
              </p>
            </div>

            {/* Sidebar filters */}
            <aside className={cn(
              "fixed inset-0 z-50 bg-[#F5F1EC] lg:static lg:block lg:w-full transition-transform duration-300",
              showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
              <div className="h-full overflow-y-auto p-6 lg:p-0">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h3 className="font-serif text-xl font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#4A3B32] mb-4">Category</h4>
                  <div className="space-y-3">
                    <button onClick={() => { setCategory(""); setPage(1); }} className="flex items-center gap-3 group w-full text-left">
                      <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", !category ? "border-[#4A3B32]" : "border-[#A68A78]")}>
                        {!category && <div className="w-[6px] h-[6px] rounded-full bg-[#4A3B32]" />}
                      </div>
                      <span className={cn("text-[13px]", !category ? "text-[#4A3B32] font-medium" : "text-[#8B6B52]")}>All</span>
                    </button>
                    {categories.map((cat) => (
                      <button key={cat._id} onClick={() => { setCategory(cat._id); setPage(1); }} className="flex items-center gap-3 group w-full text-left">
                        <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", category === cat._id ? "border-[#4A3B32]" : "border-[#A68A78]")}>
                          {category === cat._id && <div className="w-[6px] h-[6px] rounded-full bg-[#4A3B32]" />}
                        </div>
                        <span className={cn("text-[13px]", category === cat._id ? "text-[#4A3B32] font-medium" : "text-[#8B6B52]")}>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-8">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#4A3B32] mb-4">Gender</h4>
                  <div className="space-y-3">
                    {genderOptions.map((g) => (
                      <button key={g.value} onClick={() => { setGender(g.value); setPage(1); }} className="flex items-center gap-3 group w-full text-left">
                        <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", gender === g.value ? "border-[#4A3B32]" : "border-[#A68A78]")}>
                          {gender === g.value && <div className="w-[6px] h-[6px] rounded-full bg-[#4A3B32]" />}
                        </div>
                        <span className={cn("text-[13px]", gender === g.value ? "text-[#4A3B32] font-medium" : "text-[#8B6B52]")}>{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#4A3B32] mb-4">Price : {minPrice || 0} — {priceRange}</h4>
                  <input
                    type="range"
                    min="0"
                    max="1250"
                    step="10"
                    value={priceRange}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPriceRange(val);
                      setMaxPrice(String(val));
                      setPage(1);
                    }}
                    className="w-full h-[3px] bg-[#4A3B32] rounded-lg appearance-none cursor-pointer accent-[#4A3B32]"
                  />
                </div>

                {/* Colors */}
                <div className="mb-8">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#4A3B32] mb-4">Color</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {colorOptions.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => { setColor(color === c.name ? "" : c.name); setPage(1); }}
                        className={cn(
                          "w-[22px] h-[22px] rounded-full transition-all duration-300 relative",
                          color === c.name ? "ring-2 ring-offset-2 ring-offset-[#F5F1EC] ring-[#4A3B32]" : ""
                        )}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {c.name === "White" && <div className="absolute inset-0 rounded-full border border-gray-300" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-8">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#4A3B32] mb-4">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSize(size === s ? "" : s); setPage(1); }}
                        className={cn(
                          "w-9 h-9 rounded-full border text-[11px] font-medium flex items-center justify-center transition-all duration-300",
                          size === s
                            ? "bg-[#F5F1EC] text-[#4A3B32] border-[#4A3B32]"
                            : "bg-transparent border-[#D8CFC4] text-[#8B6B52] hover:border-[#4A3B32] hover:text-[#4A3B32]"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 rounded-full border border-[#4A3B32] text-[#4A3B32] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#4A3B32] hover:text-white transition-all duration-300"
                  >
                    Reset all
                  </button>
                )}
              </div>
            </aside>
          </div>

          {/* Right Column: Topbar + Grid */}
          <div className="flex-1 mt-2 lg:mt-0">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 lg:pl-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-3 w-full sm:w-auto text-xs font-bold uppercase tracking-widest text-[#4A3B32] border border-[#D8CFC4] rounded-full px-6 py-3"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <div className="flex items-center gap-4 w-full sm:w-auto ml-auto">
                <div className="relative shrink-0">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="bg-[#FAF8F5] border border-[#E7D7C9] rounded-full py-2.5 pl-4 pr-10 text-[13px] text-[#4A3B32] focus:outline-none focus:border-[#C69C72] appearance-none cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A3B32] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product grid */}
            <div className="lg:pl-4">
              {isLoading ? (
                <SkeletonCard count={12} className="lg:grid-cols-3" />
              ) : products.length > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10"
                  >
                    {products.map((p, i) => (
                      <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                        <ProductCard product={p} index={i} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2.5 mt-16">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={cn(
                            "w-8 h-8 rounded-full text-[12px] font-medium transition-all flex items-center justify-center",
                            page === p
                              ? "bg-[#8B6B52] text-white"
                              : "bg-[#FAF8F5] text-[#8B6B52] border border-[#D8CFC4] hover:border-[#8B6B52] hover:text-[#4A3B32]"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <EmptyState type="products" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showFilters && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowFilters(false)} />}

      {/* Newsletter Section */}
      <div className="bg-gradient-to-b from-transparent to-[#E7D7C9]/60 py-20 mt-10">
        <div className="container-custom text-center">
          <h2 className="font-serif text-3xl md:text-[38px] font-bold text-[#4A3B32] mb-3">
            Get 15% off your first order
          </h2>
          <p className="text-[#8B6B52] text-[13px] mb-8 font-medium">
            Join 240,000+ subscribers — early drops, weekly edits. no spam.
          </p>
          <form className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#FAF8F5] border border-[#D8CFC4] rounded-[8px] py-3 px-4 text-sm focus:outline-none focus:border-[#C69C72] text-[#4A3B32]"
            />
            <button className="bg-[#4A3B32] text-white rounded-[8px] py-3 px-8 text-sm font-semibold hover:bg-[#3E2C24] transition-colors shadow-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-custom py-20"><SkeletonCard count={12} /></div>}>
      <ShopContent />
    </Suspense>
  );
}
