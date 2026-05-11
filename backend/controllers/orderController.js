import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { NotFoundError, BadRequestError } from "../utils/ApiError.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, couponCode, notes, items: directItems } = req.body;
    let orderItems = [];
    let cart = null;

    if (directItems && directItems.length > 0) {
      // Buy Now flow
      for (const item of directItems) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.quantity)
          throw new BadRequestError(`Insufficient stock for ${product?.title || "a product"}`);
        
        orderItems.push({
          product: product._id, title: product.title,
          image: product.images?.[0]?.url || "", size: item.size,
          color: item.color, quantity: item.quantity, price: item.price,
        });
      }
    } else {
      // Regular cart flow
      cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
      if (!cart || cart.items.length === 0) throw new BadRequestError("Cart is empty");

      for (const item of cart.items) {
        if (!item.product || item.product.stock < item.quantity)
          throw new BadRequestError(`Insufficient stock for ${item.product?.title || "a product"}`);
      }

      orderItems = cart.items.map((item) => ({
        product: item.product._id, title: item.product.title,
        image: item.product.images?.[0]?.url || "", size: item.size,
        color: item.color, quantity: item.quantity, price: item.price,
      }));
    }

    const itemsTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingFee = itemsTotal >= 999 ? 0 : 99;
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(), isActive: true,
        startDate: { $lte: new Date() }, endDate: { $gte: new Date() },
      });
      if (coupon) {
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
          throw new BadRequestError("Coupon usage limit reached");
        if (itemsTotal < coupon.minOrderAmount)
          throw new BadRequestError(`Min order Rs. ${coupon.minOrderAmount}`);
        discount = coupon.discountType === "percentage"
          ? Math.min((itemsTotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
          : coupon.discountValue;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const order = await Order.create({
      user: req.user._id, items: orderItems, shippingAddress,
      paymentMethod: "cod", itemsTotal, shippingFee, discount,
      totalAmount: itemsTotal + shippingFee - discount,
      couponCode: couponCode || "", notes: notes || "",
    });

    // Update stock and soldCount
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Only clear cart if order was from cart
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({ success: true, order });
  } catch (error) { next(error); }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    res.json({ success: true, orders, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) throw new NotFoundError("Order not found");
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      throw new NotFoundError("Order not found");
    res.json({ success: true, order });
  } catch (error) { next(error); }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status && status !== "all") query.orderStatus = status;
    if (search) query.orderNumber = { $regex: search, $options: "i" };
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query).populate("user", "name email")
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    res.json({ success: true, orders, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) throw new NotFoundError("Order not found");
    order.orderStatus = orderStatus;
    if (orderStatus === "delivered") { order.isPaid = true; order.paidAt = new Date(); order.deliveredAt = new Date(); }
    if (orderStatus === "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
      }
    }
    await order.save();
    res.json({ success: true, order });
  } catch (error) { next(error); }
};
