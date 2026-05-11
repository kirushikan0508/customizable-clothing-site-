"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Tag, Settings, Ticket, LogOut, ChevronLeft, Menu,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-secondary flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-primary text-secondary flex flex-col transition-all duration-300 ease-in-out border-r border-surface-dark shadow-2xl",
        collapsed ? "w-20" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-surface-dark/50 bg-primary/95">
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="font-serif text-2xl font-bold text-gradient tracking-widest uppercase"
              style={{ backgroundImage: 'linear-gradient(135deg, #F5F1EC 0%, #C69C72 100%)' }}
            >
              NOVA
            </motion.span>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-dark/50 text-accent transition-colors"
          >
            <ChevronLeft size={18} className={cn("transition-transform duration-300", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link href={link.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                      isActive ? "text-primary bg-secondary shadow-md" : "text-surface hover:text-secondary hover:bg-surface-dark/30",
                      collapsed && "justify-center py-4"
                    )}>
                    {isActive && (
                      <motion.div layoutId="activeNavIndicator" className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent rounded-r-full shadow-sm" />
                    )}
                    <link.icon size={20} className={cn("transition-transform duration-300", isActive ? "text-accent scale-110" : "group-hover:scale-110")} />
                    {!collapsed && <span className="z-10 relative tracking-wide uppercase text-xs">{link.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-surface-dark/50 bg-primary/95">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-primary font-serif font-bold shadow-md border border-accent/30">
                {user?.name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-serif font-bold text-secondary truncate">{user?.name}</p>
                <p className="text-xs text-accent uppercase tracking-widest">{user?.role}</p>
              </div>
            </div>
          )}
          <button onClick={async () => { await logout(); router.push("/"); }}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-300 w-full bg-surface-dark/20 hover:bg-surface-dark/50 text-surface hover:text-white border border-surface-dark/30", 
              collapsed && "justify-center"
            )}>
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => setMobileOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-w-0 h-screen transition-all duration-500 ease-in-out", collapsed ? "lg:ml-20" : "lg:ml-64")}>
        {/* Top bar (Glassmorphic) */}
        <header className="h-20 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 bg-secondary/80 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2.5 bg-white text-primary border border-border rounded-xl shadow-sm hover:shadow transition-all">
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full inline-block"></span>
              {sidebarLinks.find((l) => l.href === pathname)?.label || "Admin Overview"}
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="btn-secondary py-2 px-5 text-xs hidden sm:inline-flex">
              View Storefront <span className="opacity-70 text-lg">↗</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
