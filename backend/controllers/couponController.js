import Coupon from "../models/Coupon.js";
import { NotFoundError, BadRequestError } from "../utils/ApiError.js";

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(), isActive: true,
      startDate: { $lte: new Date() }, endDate: { $gte: new Date() },
    });
    if (!coupon) throw new BadRequestError("Invalid or expired coupon");
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
      throw new BadRequestError("Coupon usage limit reached");
    if (orderTotal < coupon.minOrderAmount)
      throw new BadRequestError(`Minimum order amount is Rs. ${coupon.minOrderAmount}`);

    let discount = coupon.discountType === "percentage"
      ? Math.min((orderTotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
      : coupon.discountValue;

    res.json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: Math.round(discount) } });
  } catch (error) { next(error); }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, coupons });
  } catch (error) { next(error); }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) { next(error); }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) throw new NotFoundError("Coupon not found");
    res.json({ success: true, coupon });
  } catch (error) { next(error); }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new NotFoundError("Coupon not found");
    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) { next(error); }
};
