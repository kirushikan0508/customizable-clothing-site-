"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setIsLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
      <div className="bg-white p-8 md:p-10 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold">FLAVOUR</Link>
          <h2 className="font-serif text-2xl font-bold mt-6">Forgot Password</h2>
          <p className="text-sm text-muted mt-2">
            {sent ? "Check your email for reset instructions" : "Enter your email to reset your password"}
          </p>
        </div>
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" className="input-field pl-11" required />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 disabled:opacity-50">
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-green-600" />
            </div>
            <p className="text-sm text-muted">We sent a password reset link to <strong>{email}</strong></p>
          </div>
        )}
        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted hover:text-primary mt-6">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    </motion.div>
  );
}
