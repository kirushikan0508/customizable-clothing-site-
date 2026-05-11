"use client";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { formatDate, cn } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "", description: "", discountType: "percentage", discountValue: "",
    minOrderAmount: "", maxDiscount: "", usageLimit: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "", isActive: true,
  });

  const fetch = () => api.get("/coupons").then(({ data }) => setCoupons(data.coupons)).catch(() => {});
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        usageLimit: Number(form.usageLimit) || 0,
      };
      if (editId) { await api.put(`/coupons/${editId}`, payload); toast.success("Updated!"); }
      else { await api.post("/coupons", payload); toast.success("Created!"); }
      setShowForm(false); setEditId(null); fetch();
    } catch (err: any) { toast.error(err.response?.data?.message || "Error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await api.delete(`/coupons/${id}`); toast.success("Deleted"); fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-bold">Coupons</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="btn-primary text-xs py-2.5"><Plus size={16} /> Add Coupon</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Code *</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="input-field">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Value *</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Min Order (Rs.)</label>
              <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input-field" required />
            </div>
          </div>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="input-field" />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary py-2">{editId ? "Update" : "Create"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary py-2">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-surface">
            <th className="text-left p-4 text-xs font-semibold uppercase">Code</th>
            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell">Type</th>
            <th className="text-left p-4 text-xs font-semibold uppercase">Value</th>
            <th className="text-left p-4 text-xs font-semibold uppercase hidden sm:table-cell">Expires</th>
            <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell">Used</th>
            <th className="text-left p-4 text-xs font-semibold uppercase">Status</th>
            <th className="text-right p-4 text-xs font-semibold uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-surface/50">
                <td className="p-4 font-mono font-bold">{c.code}</td>
                <td className="p-4 hidden md:table-cell capitalize text-muted">{c.discountType}</td>
                <td className="p-4 font-medium">{c.discountType === "percentage" ? `${c.discountValue}%` : `Rs.${c.discountValue}`}</td>
                <td className="p-4 hidden sm:table-cell text-muted">{formatDate(c.endDate)}</td>
                <td className="p-4 hidden lg:table-cell text-muted">{c.usedCount}{c.usageLimit > 0 ? `/${c.usageLimit}` : ""}</td>
                <td className="p-4">
                  <span className={cn("text-xs px-2 py-1 font-medium", c.isActive && new Date(c.endDate) > new Date() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                    {c.isActive && new Date(c.endDate) > new Date() ? "Active" : "Expired"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setForm({ ...c, startDate: c.startDate?.split("T")[0], endDate: c.endDate?.split("T")[0], discountValue: String(c.discountValue), minOrderAmount: String(c.minOrderAmount), maxDiscount: String(c.maxDiscount), usageLimit: String(c.usageLimit) }); setEditId(c._id); setShowForm(true); }} className="p-2 hover:bg-surface rounded"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-center text-muted py-12">No coupons yet</p>}
      </div>
    </div>
  );
}
