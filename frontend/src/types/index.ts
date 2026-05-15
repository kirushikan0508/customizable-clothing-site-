// ==================== User Types ====================
export interface IAddress {
  _id?: string;
  label?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "user" | "admin";
  addresses: IAddress[];
  wishlist: IProduct[] | string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== Product Types ====================
export interface IProductImage {
  url: string;
  public_id: string;
}

export interface IProductSize {
  size: string;
  stock: number;
}

export interface IProductColor {
  name: string;
  hex: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: ICategory | string;
  gender: "boys" | "girls" | "unisex";
  brand: string;
  price: number;
  discountPrice: number;
  images: IProductImage[];
  sizes: IProductSize[];
  colors: IProductColor[];
  stock: number;
  ratings: number;
  numReviews: number;
  featured: boolean;
  trending: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Category Types ====================
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image?: IProductImage;
  description: string;
  isActive: boolean;
}

// ==================== Cart Types ====================
export interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
  size: string;
  color: string;
  price: number;
  customization?: {
    front: { image?: string; text?: string; details?: any };
    back: { image?: string; text?: string; details?: any };
    isCustom: boolean;
    tshirtType?: string;
  };
}

export interface ICart {
  _id?: string;
  user: string;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}

// ==================== Order Types ====================
export interface IOrderItem {
  product: string;
  title: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrder {
  _id: string;
  user: IUser | string;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: string;
  itemsTotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  couponCode: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Review Types ====================
export interface IReview {
  _id: string;
  user: Pick<IUser, "_id" | "name" | "avatar">;
  product: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

// ==================== Coupon Types ====================
export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// ==================== API Response Types ====================
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// ==================== Dashboard Types ====================
export interface IDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
}

export interface IMonthlyRevenue {
  _id: { month: number; year: number };
  revenue: number;
  orders: number;
}

export interface IDailyOrders {
  _id: string;
  orders: number;
  revenue: number;
}
