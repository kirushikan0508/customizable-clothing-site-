import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// @desc    Get recent reviews across all products
// @route   GET /api/reviews/recent
router.get("/recent", async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const reviews = await Review.find({})
      .populate("user", "name avatar")
      .populate("product", "title slug images")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
});

export default router;
