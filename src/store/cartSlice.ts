import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sides?: string[]; // selected sides
  drinks?: { id: string; name: string; price: number }[];
  extras?: { id: string; name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
        // merge sides, drinks, extras
        existing.sides = Array.from(
          new Set([...(existing.sides || []), ...(action.payload.sides || [])])
        );
        existing.drinks = [
          ...(existing.drinks || []),
          ...(action.payload.drinks || []),
        ];
        existing.extras = [
          ...(existing.extras || []),
          ...(action.payload.extras || []),
        ];
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    incrementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, incrementQty, decrementQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
