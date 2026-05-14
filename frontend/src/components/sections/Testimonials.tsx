"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/axios";

interface ReviewData {
  _id: string;
  rating: number;
  comment: string;
  user: { name: string; avatar?: string };
  product: { title: string; slug: string; images?: { url: string }[] };
  createdAt: string;
}

const fallbackTestimonials = [
  {
    text: "The quality is amazing! The colors are exactly as shown and the fit is perfect.",
    name: "Sarah J.",
    rating: 5,
  },
  {
    text: "I love the material. It feels premium and extremely comfortable for everyday wear.",
    name: "Emily C.",
    rating: 5,
  },
  {
    text: "Absolutely gorgeous collection. I always get compliments when I wear their designs.",
    name: "Jessica A.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/reviews/recent?limit=6");
        setReviews(data.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const hasRealReviews = reviews.length > 0;

  return (
    <section className="py-16 md:py-20 bg-[#E7D7C9]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="section-subheading mb-2">Testimonials</p>
          <h2 className="section-heading">What people are saying</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 animate-pulse">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <div key={j} className="w-4 h-4 bg-gray-200 rounded" />)}</div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                <div className="h-4 bg-gray-200 rounded mb-6 w-3/4" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div><div className="h-3 bg-gray-200 rounded w-20 mb-1" /><div className="h-2 bg-gray-200 rounded w-16" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hasRealReviews
              ? reviews.slice(0, 6).map((review, i) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex text-yellow-400 mb-4">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={14}
                            className={j < review.rating ? "fill-yellow-400" : "fill-gray-200 text-gray-200"}
                          />
                        ))}
                      </div>
                      <p className="text-[#5C4033] font-medium leading-relaxed mb-4">
                        &quot;{review.comment}&quot;
                      </p>
                      {review.product && (
                        <p className="text-xs text-muted mb-4">
                          Reviewed: <span className="font-semibold">{review.product.title}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {review.user?.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#5C4033] flex items-center justify-center text-white font-bold text-sm">
                          {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-primary">{review.user?.name || "Anonymous"}</p>
                        <p className="text-xs text-muted">Verified Buyer</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              : fallbackTestimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex text-yellow-400 mb-4">
                        {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-yellow-400" />)}
                      </div>
                      <p className="text-[#5C4033] font-medium leading-relaxed mb-6">
                        &quot;{t.text}&quot;
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5C4033] flex items-center justify-center text-white font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{t.name}</p>
                        <p className="text-xs text-muted">Verified Buyer</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
