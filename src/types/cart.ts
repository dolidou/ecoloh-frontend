export interface CartItem {
  ticketTypeId: number;
  ticketTypeName: string;
  price: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  eventId: number | null;
  eventName: string | null;
  addItem: (item: CartItem, eventId: number, eventName: string) => void;
  removeItem: (ticketTypeId: number) => void;
  updateQuantity: (ticketTypeId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
