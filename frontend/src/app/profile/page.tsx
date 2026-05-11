"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ 
    name: user?.name || "", 
    phone: user?.phone || "",
    email: user?.email || "",
    birthday: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.put("/users/profile", form);
      setUser(data.user);
      toast.success("Profile updated!");
    } catch { toast.error("Failed to update"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#E7D7C9]/50">
      <h2 className="font-serif text-3xl font-bold text-[#5C4033] mb-10">Profile</h2>

      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-[#5C4033] text-white rounded-full flex items-center justify-center text-3xl font-bold font-serif shadow-lg">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.name?.charAt(0) || "U"
          )}
        </div>
        <div>
          <p className="text-[#8B6B52] text-sm font-medium">{user?.email || "guest@nova.shop"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#9C6B4F] ml-1">Full name</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              className="w-full px-6 py-4 bg-[#F5F1EC]/50 border border-[#E7D7C9] rounded-2xl text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#9C6B4F] transition-all"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#9C6B4F] ml-1">Email</label>
            <input 
              type="email" 
              value={form.email} 
              className="w-full px-6 py-4 bg-[#F5F1EC]/30 border border-[#E7D7C9] rounded-2xl text-[#5C4033]/50 focus:outline-none cursor-not-allowed" 
              readOnly 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#9C6B4F] ml-1">Phone</label>
            <input 
              type="tel" 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              className="w-full px-6 py-4 bg-[#F5F1EC]/50 border border-[#E7D7C9] rounded-2xl text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#9C6B4F] transition-all"
              placeholder="+1 555 010 0123"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#9C6B4F] ml-1">Birthday</label>
            <input 
              type="date" 
              value={form.birthday} 
              onChange={(e) => setForm({ ...form, birthday: e.target.value })} 
              className="w-full px-6 py-4 bg-[#F5F1EC]/50 border border-[#E7D7C9] rounded-2xl text-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#9C6B4F] transition-all"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="bg-[#9C6B4F] text-white px-10 py-4 rounded-xl text-sm font-bold hover:bg-[#5C4033] transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
