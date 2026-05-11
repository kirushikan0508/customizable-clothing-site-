import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: "user" });
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });

    // Monthly revenue (last 12 months)
    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" }, createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }).limit(10).lean();

    // Top selling products
    const topProducts = await Product.find({ isActive: true })
      .sort({ soldCount: -1 }).limit(5).lean();

    // Low stock alerts
    const lowStock = await Product.find({ isActive: true, stock: { $lte: 10 } })
      .sort({ stock: 1 }).limit(10).lean();

    // Daily orders (last 30 days)
    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, orders: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } },
    ]);

    // Order status distribution
    const orderStatusDist = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders, totalProducts, totalCustomers, pendingOrders,
      },
      monthlyRevenue, recentOrders, topProducts, lowStock, dailyOrders, orderStatusDist,
    });
  } catch (error) { next(error); }
};

export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = "monthly" } = req.query;
    let groupFormat = "%Y-%m";
    let dateRange = 365 * 24 * 60 * 60 * 1000;

    if (period === "daily") { groupFormat = "%Y-%m-%d"; dateRange = 30 * 24 * 60 * 60 * 1000; }
    if (period === "weekly") { groupFormat = "%Y-%U"; dateRange = 90 * 24 * 60 * 60 * 1000; }

    const data = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" }, createdAt: { $gte: new Date(Date.now() - dateRange) } } },
      { $group: { _id: { $dateToString: { format: groupFormat, date: "$createdAt" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) { next(error); }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const topCustomers = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: "$user", totalSpent: { $sum: "$totalAmount" }, orderCount: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { "user.name": 1, "user.email": 1, "user.avatar": 1, totalSpent: 1, orderCount: 1 } },
    ]);
    res.json({ success: true, topCustomers });
  } catch (error) { next(error); }
};
