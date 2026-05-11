"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const profileLinks = [
  { label: "My Profile", href: "/profile", icon: User },
  { label: "My Orders", href: "/profile/orders", icon: Package },
  { label: "Wishlist", href: "/profile/wishlist", icon: Heart },
  { label: "Addresses", href: "/profile/addresses", icon: MapPin },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F1EC]">
        {/* Header */}
        <div className="py-12 md:py-16">
          <div className="container-custom">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#5C4033] mb-2">My Account</h1>
            <p className="text-[#8B6B52] font-medium">Hello, {user?.name?.split(' ')[0] || 'guest'} 👋</p>
          </div>
        </div>

        <div className="container-custom pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <nav className="space-y-2">
                {profileLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl",
                        isActive 
                          ? "bg-gradient-to-r from-[#5C4033] to-[#9C6B4F] text-white shadow-lg translate-x-2" 
                          : "text-[#8B6B52] hover:text-[#5C4033] hover:bg-white/50"
                      )}
                    >
                      <link.icon size={20} />
                      <span className="tracking-wide">{link.label.replace('My ', '')}</span>
                    </Link>
                  );
                })}
                <button 
                  onClick={async () => { await logout(); router.push("/"); }}
                  className="flex items-center gap-4 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 w-full transition-all duration-300 rounded-2xl"
                >
                  <LogOut size={20} />
                  <span className="tracking-wide">Sign out</span>
                </button>
              </nav>
            </aside>

            {/* Content */}
            <main className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-b from-transparent to-[#E7D7C9]/30 py-24 border-t border-[#E7D7C9]/50">
          <div className="container-custom text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#5C4033] mb-6">
              Get 15% off your first order
            </h2>
            <p className="text-[#8B6B52] text-sm md:text-base font-medium mb-10 max-w-lg mx-auto">
              Join 240,000+ subscribers — early drops, weekly edits, no spam.
            </p>
            <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full sm:flex-1 bg-white border-none rounded-xl py-4 px-6 text-sm text-[#5C4033] placeholder:text-[#C69C72] focus:ring-2 focus:ring-[#9C6B4F] outline-none shadow-sm"
              />
              <button className="w-full sm:w-auto bg-[#5C4033] text-white rounded-xl py-4 px-10 text-sm font-bold hover:bg-[#3E2C24] transition-colors shadow-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
