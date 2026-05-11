"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export default function AddressesPage() {
  const { user, fetchUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "USA", isDefault: false, label: "Home"
  });

  const addresses = user?.addresses || [];

  const resetForm = () => {
    setForm({ fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "USA", isDefault: false, label: "Home" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/users/addresses/${editId}`, form);
        toast.success("Address updated!");
      } else {
        await api.post("/users/addresses", form);
        toast.success("Address added!");
      }
      await fetchUser();
      resetForm();
    } catch { toast.error("Failed to save address"); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      await fetchUser();
      toast.success("Address deleted!");
    } catch { toast.error("Failed to delete"); }
  };

  const handleEdit = (addr: any) => {
    setForm({ 
      fullName: addr.fullName, 
      phone: addr.phone, 
      street: addr.street, 
      city: addr.city, 
      state: addr.state, 
      zipCode: addr.zipCode, 
      country: addr.country, 
      isDefault: addr.isDefault,
      label: addr.label || "Home"
    });
    setEditId(addr._id);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#E7D7C9]/50 min-h-[600px]">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-serif text-3xl font-bold text-[#5C4033]">Saved addresses</h2>
        {!showForm && (
          <button 
            onClick={() => { resetForm(); setShowForm(true); }} 
            className="flex items-center gap-2 bg-[#5C4033] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#3E2C24] transition-all shadow-md active:scale-95"
          >
            <Plus size={14} /> Add new
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-12 p-8 bg-[#F5F1EC]/30 rounded-[24px] border border-[#E7D7C9] space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-xl font-bold text-[#5C4033]">{editId ? "Edit Address" : "New Address"}</h3>
            <button type="button" onClick={resetForm} className="text-[#8B6B52] hover:text-[#5C4033]"><Trash2 size={18} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">Full name</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" required />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">Street address</label>
              <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">City</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">State</label>
              <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">ZIP Code</label>
              <input type="text" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9C6B4F]">Label (e.g. Home, Office)</label>
              <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-5 py-3 bg-white border border-[#E7D7C9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9C6B4F]" />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-3 text-xs font-bold text-[#5C4033] cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 rounded border-[#E7D7C9] accent-[#9C6B4F]" />
              Set as default address
            </label>
            <div className="flex gap-4 ml-auto">
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#8B6B52] hover:text-[#5C4033]">Cancel</button>
              <button type="submit" className="bg-[#5C4033] text-white px-8 py-2.5 rounded-xl text-xs font-bold hover:bg-[#3E2C24] transition-all shadow-md">
                {editId ? "Update address" : "Save address"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr._id} className="group bg-[#F5F1EC]/40 p-8 rounded-[24px] border border-[#E7D7C9] hover:border-[#9C6B4F] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-[#E7D7C9] text-[#5C4033] px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest">
                  {addr.label || "Home"}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold text-[#9C6B4F] uppercase tracking-wider">Default</span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-[#5C4033]">{addr.fullName}</p>
                <div className="text-sm text-[#8B6B52] font-medium leading-relaxed">
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                  <p>{addr.country || "USA"}</p>
                  <p className="mt-3 text-[#9C6B4F]">{addr.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#E7D7C9]">
              <button 
                onClick={() => handleEdit(addr)} 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E7D7C9] rounded-full text-[10px] font-bold text-[#5C4033] hover:bg-[#F5F1EC] transition-all shadow-sm"
              >
                <Edit2 size={12} /> Edit
              </button>
              <button 
                onClick={() => handleDelete(addr._id!)} 
                className="flex items-center gap-2 text-[10px] font-bold text-[#8B4513] hover:text-red-600 transition-colors ml-auto"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <div className="md:col-span-2 py-20 text-center">
            <p className="text-[#8B6B52] font-medium">No addresses saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
