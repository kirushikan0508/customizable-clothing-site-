"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Shirts", href: "/shop?category=shirts" },
    { label: "T-Shirts", href: "/shop?category=t-shirts" },
    { label: "Dresses", href: "/shop?category=dresses" },
    { label: "Pants & Trousers", href: "/shop?category=pants" },
    { label: "New Arrivals", href: "/shop?filter=new" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Order", href: "/profile/orders" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#5C4033] text-white/70 py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-white font-bold tracking-widest">NOVA</h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Modern fashion, made for the bold. Premium fabrics, ethical production, fearless color.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {['instagram', 'twitter', 'youtube', 'facebook'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white/80"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-white/60 rounded-full" /> {/* Placeholder icons */}
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Shop</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/shop?category=plain-t-shirts" className="hover:text-white transition-colors">Plain T-Shirts</Link></li>
              <li><Link href="/shop?category=printed-t-shirts" className="hover:text-white transition-colors">Printed T-Shirts</Link></li>
              <li><Link href="/shop?category=normal-t-shirts" className="hover:text-white transition-colors">Normal T-Shirts</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Help</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Account</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/profile/orders" className="hover:text-white transition-colors">Orders</Link></li>
              <li><Link href="/profile/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs uppercase tracking-widest font-medium">
          <p>© {new Date().getFullYear()} NOVA. All rights reserved.</p>
          <p>Made with ♥ for fashion lovers.</p>
        </div>
      </div>
    </footer>
  );
}
