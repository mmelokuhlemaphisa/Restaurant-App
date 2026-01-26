import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { auth, db } from "../../src/services/FireBase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sides?: string[];
  drinks?: { id: string; name: string; price: number }[];
  extras?: { id: string; name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// 🔥 Load cart from Firestore
export const syncCartWithFirestore = createAsyncThunk(
  "cart/syncCartWithFirestore",
  async (userId: string, thunkAPI) => {
    const cartDoc = doc(db, "carts", userId);
    const snapshot = await getDoc(cartDoc);

    if (snapshot.exists()) {
      return snapshot.data().items as CartItem[];
    }
    return [];
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
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

    // Save cart in state
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // ✅ UPDATE EXTRAS + DRINKS FOR A CART ITEM
    updateItemExtras: (
      state,
      action: PayloadAction<{
        itemId: string;
        extras: { id: string; name: string; price: number }[];
        drinks: { id: string; name: string; price: number }[];
      }>
    ) => {
      const { itemId, extras, drinks } = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        item.extras = extras;
        item.drinks = drinks;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(syncCartWithFirestore.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const {
  addItem,
  removeItem,
  incrementQty,
  decrementQty,
  clearCart,
  setCart,
  updateItemExtras, // ✅ Export it here
} = cartSlice.actions;

export default cartSlice.reducer;
