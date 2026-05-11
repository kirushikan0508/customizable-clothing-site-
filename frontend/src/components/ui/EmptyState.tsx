"use client";

import { ShoppingBag, FileText, Heart, Package } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  type?: "cart" | "orders" | "wishlist" | "products" | "generic";
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const icons = {
  cart: ShoppingBag,
  orders: FileText,
  wishlist: Heart,
  products: Package,
  generic: Package,
};

const defaults = {
  cart: { title: "Your cart is empty", description: "Looks like you haven't added anything to your cart yet." },
  orders: { title: "No orders yet", description: "Start shopping to see your orders here." },
  wishlist: { title: "Your wishlist is empty", description: "Save items you love for later." },
  products: { title: "No products found", description: "Try adjusting your filters or search terms." },
  generic: { title: "Nothing here", description: "This section is empty." },
};

export default function EmptyState({ type = "generic", title, description, actionLabel, actionHref }: EmptyStateProps) {
  const Icon = icons[type];
  const d = defaults[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6">
        <Icon size={32} className="text-muted" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-primary mb-2">{title || d.title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">{description || d.description}</p>
      {(actionLabel || type !== "generic") && (
        <Link href={actionHref || "/shop"} className="btn-primary">
          {actionLabel || "Start Shopping"}
        </Link>
      )}
    </div>
  );
}
