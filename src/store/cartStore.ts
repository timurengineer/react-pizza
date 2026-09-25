import { create } from "zustand";
import { CartItem, DoughType, Pizza } from "../types";

interface CartState {
  items: CartItem[];
  addToCart: (pizza: Pizza, dough: DoughType, sizeCm: number, unitPrice: number) => void;
  increment: (cartId: string) => void;
  decrement: (cartId: string) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
  quantityOf: (pizzaId: number) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (pizza, dough, sizeCm, unitPrice) => {
    const cartId = `${pizza.id}-${dough}-${sizeCm}`;
    set((state) => {
      const existing = state.items.find((item) => item.cartId === cartId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            cartId,
            pizzaId: pizza.id,
            title: pizza.title,
            image: pizza.imageUrl,
            dough,
            sizeCm,
            unitPrice,
            quantity: 1,
          },
        ],
      };
    });
  },

  increment: (cartId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decrement: (cartId) =>
    set((state) => ({
      items: state.items
        .map((item) => (item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    })),

  removeItem: (cartId) =>
    set((state) => ({
      items: state.items.filter((item) => item.cartId !== cartId),
    })),

  clearCart: () => set({ items: [] }),

  quantityOf: (pizzaId) =>
    get()
      .items.filter((item) => item.pizzaId === pizzaId)
      .reduce((sum, item) => sum + item.quantity, 0),
}));

// totalCount va totalPrice uchun alohida selector-hooklar
// (faqat items o'zgarganda qayta hisoblanadi)
export const useCartTotalCount = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  );
