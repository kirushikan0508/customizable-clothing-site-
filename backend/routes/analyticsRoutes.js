import express from "express";
import { getDashboardStats, getRevenueAnalytics, getTopCustomers } from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);
router.get("/dashboard", getDashboardStats);
router.get("/revenue", getRevenueAnalytics);
router.get("/top-customers", getTopCustomers);

export default router;
