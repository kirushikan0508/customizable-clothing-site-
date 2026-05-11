"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with ${email}`);
      setEmail("");
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#DBCBBD] to-[#E7D7C9] py-20 border-b border-border">
      <div className="container-custom flex flex-col items-center text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
          Get 15% off your first order
        </h2>
        <p className="text-primary/80 mb-8 max-w-md">
          Subscribe to our newsletter and get an exclusive discount code delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3.5 rounded-full border border-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm bg-white"
            required
          />
          <button type="submit" className="bg-[#5C4033] text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#6F4E37] transition-colors shadow-sm">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
