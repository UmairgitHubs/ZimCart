import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import ordersReducer from "./features/orders/ordersSlice";
import productsReducer from "./features/products/productsSlice";
import inventoryReducer from "./features/inventory/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    products: productsReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
