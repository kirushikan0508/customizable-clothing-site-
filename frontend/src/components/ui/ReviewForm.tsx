"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { IReview } from "@/types";

interface ReviewFormProps {
  productId: string;
  onReviewAdded: (review: IReview) => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a review");

    setIsSubmitting(true);
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment: comment.trim(),
      });
      toast.success("Review submitted successfully!");
      onReviewAdded(data.review);
      setRating(0);
      setComment("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-5 rounded-lg border border-border">
      <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Write a Review</h4>

      {/* Star selector */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted mb-2">Your Rating *</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                size={24}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-gray-300"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-xs text-muted ml-2 self-center">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-muted mb-2">Your Review *</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={3}
          className="input-field resize-none text-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="btn-primary py-2.5 px-8 text-xs disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
