"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Customized T-Shirt", href: "/customize" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-secondary text-center py-2 text-xs tracking-widest uppercase font-sans">
        Free shipping on orders above Rs. 999 | Use code <span className="text-accent font-semibold">WELCOME10</span>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "bg-[#F5F1EC]/95 backdrop-blur-md shadow-sm" : "bg-[#F5F1EC]"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 hover:bg-[#E7D7C9] rounded-full transition-colors text-[#8B6B52]"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="font-serif text-2xl lg:text-3xl font-bold tracking-widest text-[#9C6B4F]">
                NOVA
              </h1>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "text-[15px] font-medium py-2 relative transition-colors duration-300",
                      isActive ? "text-[#5C4033]" : "text-[#8B6B52] hover:text-[#5C4033]"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[#9C6B4F]" 
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 sm:gap-4 text-[#8B6B52]">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-[#E7D7C9] rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              <Link
                href={mounted && isAuthenticated ? "/profile/wishlist" : "/login"}
                className="hidden sm:flex p-2 hover:bg-[#E7D7C9] rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.5} />
              </Link>
 
              <Link href="/cart" className="p-2 hover:bg-[#E7D7C9] rounded-full transition-colors relative" aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#9C6B4F] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
 
              {mounted && isAuthenticated ? (
                <Link
                  href={user?.role === "admin" ? "/admin" : "/profile"}
                  className="p-2 hover:bg-[#E7D7C9] rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User size={20} strokeWidth={1.5} />
                </Link>
              ) : (
                <Link href="/login" className="p-2 hover:bg-[#E7D7C9] rounded-full transition-colors">
                  <User size={20} strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-border"
            >
              <form onSubmit={handleSearch} className="container-custom py-4">
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search for plain, printed, normal t-shirts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-12 pr-4"
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-[#E7D7C9] bg-[#F5F1EC]"
            >
              <nav className="container-custom py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "block py-3 text-sm font-medium border-b border-[#E7D7C9]/50",
                      pathname === link.href ? "text-[#5C4033] font-bold" : "text-[#8B6B52]"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {mounted && !isAuthenticated && (
                  <Link href="/login" className="block py-3 text-sm font-medium text-[#8B6B52] border-b border-[#E7D7C9]/50">
                    Sign In
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
