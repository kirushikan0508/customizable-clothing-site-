"use client";
import { Store, Globe, Truck, CreditCard } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-2xl font-bold">Store Settings</h1>

      <div className="bg-white p-6 border border-border space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2"><Store size={16} /> General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Store Name</label>
            <input type="text" defaultValue="FLAVOUR" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Contact Email</label>
            <input type="email" defaultValue="hello@flavour.com" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Phone</label>
            <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Currency</label>
            <input type="text" defaultValue="LKR (Rs.)" className="input-field bg-surface" readOnly />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-border space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2"><Truck size={16} /> Shipping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Shipping Fee (Rs.)</label>
            <input type="number" defaultValue="99" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Free Shipping Above (Rs.)</label>
            <input type="number" defaultValue="999" className="input-field" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 border border-border space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2"><CreditCard size={16} /> Payment</h3>
        <label className="flex items-center gap-3 text-sm cursor-pointer p-3 border border-border">
          <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
          <div>
            <p className="font-medium">Cash on Delivery (COD)</p>
            <p className="text-xs text-muted">Allow customers to pay on delivery</p>
          </div>
        </label>
      </div>

      <button className="btn-primary py-3">Save Settings</button>
    </div>
  );
}
