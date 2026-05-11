import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import type { IProduct } from "@/types";

interface WishlistState {
  wishlist: IProduct[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get("/users/wishlist");
          set({ wishlist: data.wishlist, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      toggleWishlist: async (productId) => {
        try {
          const { data } = await api.post("/users/wishlist", { productId });
          set({ wishlist: data.wishlist });
        } catch (error) {
          throw error;
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((p) => p._id === productId);
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ wishlist: state.wishlist }),
    }
  )
);
