import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import type { ICart, ICartItem } from "@/types";

interface CartState {
  cart: ICart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, size: string, color?: string, customization?: any, customPrice?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  buyNowItem: ICartItem | null;
  setBuyNowItem: (item: ICartItem | null) => void;
  selectedCartItems: string[];
  setSelectedCartItems: (items: string[]) => void;
  clearSelectedCartItems: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get("/cart");
          set({ cart: data.cart, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, quantity, size, color, customization, customPrice) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/cart", { productId, quantity, size, color, customization, customPrice });
          set({ cart: data.cart, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateQuantity: async (itemId, quantity) => {
        try {
          const { data } = await api.put(`/cart/${itemId}`, { quantity });
          set({ cart: data.cart });
        } catch (error) {
          throw error;
        }
      },

      removeItem: async (itemId) => {
        try {
          const { data } = await api.delete(`/cart/${itemId}`);
          set({ cart: data.cart });
        } catch (error) {
          throw error;
        }
      },

      clearCart: async () => {
        try {
          await api.delete("/cart");
          set({ cart: null });
        } catch (error) {
          throw error;
        }
      },

      getItemCount: () => {
        const cart = get().cart;
        return cart?.items?.reduce((sum: number, item: ICartItem) => sum + item.quantity, 0) || 0;
      },
      buyNowItem: null,
      setBuyNowItem: (item) => set({ buyNowItem: item }),
      selectedCartItems: [],
      setSelectedCartItems: (items) => set({ selectedCartItems: items }),
      clearSelectedCartItems: () => set({ selectedCartItems: [] }),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart, selectedCartItems: state.selectedCartItems }),
    }
  )
);
