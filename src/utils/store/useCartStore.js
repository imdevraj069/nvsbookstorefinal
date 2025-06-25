// utils/store/useCartStore.js
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import axios from "axios"
import debounce from "lodash.debounce"

export const useCartStore = create(
  devtools((set, get) => {
    const syncCartWithDB = debounce(async () => {
      const cartItems = get().cartItems;
      try {
        const items = cartItems.map((item) => ({
          productId: item._id, // product._id from frontend
          quantity: item.quantity,
        }));

        await axios.post("/api/user/cart", { items });
      } catch (error) {
        console.error("Sync failed:", error);
      }
    }, 2000);

    return {
      cartItems: [],
      loaded: false,

      loadCartFromDB: async (force = false) => {
        if ( get().loaded) return;
        try {
          const res = await axios.get("/api/user/cart");
          const items = res.data.cartItems || [];

          const cartItems = items.map((entry) => ({
            ...entry.product,
            quantity: entry.quantity,
          }));

          set({ cartItems, loaded: true });
        } catch (err) {
          console.error("Failed to load cart", err);
        }
      },

      addToCart: (product) => {
        const { cartItems } = get()
        const existing = cartItems.find((item) => item._id === product._id)
        let updatedCart

        if (existing) {
          updatedCart = cartItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          updatedCart = [...cartItems, { ...product, quantity: 1 }]
        }

        set({ cartItems: updatedCart })
        syncCartWithDB()
      },

      decreaseFromCart: (productId) => {
        const { cartItems } = get()
        const updatedCart = cartItems
          .map((item) =>
            item._id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)

        set({ cartItems: updatedCart })
        syncCartWithDB()
      },

      removeFromCart: (productId) => {
        const updatedCart = get().cartItems.filter((item) => item._id !== productId)
        set({ cartItems: updatedCart })
        syncCartWithDB()
      },

      clearCart: () => {
        set({ cartItems: [], loaded: false })
      },
      
      clearCartAndSync: async () => {
        set({ cartItems: [], loaded: false });
        try {
          await axios.post("/api/user/cart", { items: [] }); // instantly syncs cleared cart to DB
        } catch (err) {
          console.error("Failed to clear cart in DB", err);
        }
      },

      getCartCount: () => get().cartItems.reduce((acc, item) => acc + item.quantity, 0),
    }
  })
)
