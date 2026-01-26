import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import adminMenuReducer from "./adminMenuSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    adminMenu: adminMenuReducer,
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
