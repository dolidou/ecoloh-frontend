import { create } from 'zustand';
import { CartState, CartItem } from '../types/cart';

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  eventId: null,
  eventName: null,

  addItem: (item: CartItem, eventId: number, eventName: string) => {
    const existingItem = get().items.find((i) => i.ticketTypeId === item.ticketTypeId);

    if (existingItem) {
      // Update quantity if item exists
      set({
        items: get().items.map((i) =>
          i.ticketTypeId === item.ticketTypeId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      });
    } else {
      // Add new item
      set({
        items: [...get().items, item],
        eventId,
        eventName,
      });
    }
  },

  removeItem: (ticketTypeId: number) => {
    set({
      items: get().items.filter((i) => i.ticketTypeId !== ticketTypeId),
    });
  },

  updateQuantity: (ticketTypeId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(ticketTypeId);
      return;
    }

    set({
      items: get().items.map((i) =>
        i.ticketTypeId === ticketTypeId ? { ...i, quantity } : i
      ),
    });
  },

  clearCart: () => {
    set({
      items: [],
      eventId: null,
      eventName: null,
    });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + parseFloat(item.price) * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
