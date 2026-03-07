import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/types/orders";
import { MOCK_ORDERS } from "@/constants/orders";

export interface OrdersState {
  items: Order[];
  isLoading: boolean;
  error: string | null;
  submitSuccess: boolean;
}

const initialState: OrdersState = {
  items: MOCK_ORDERS,
  isLoading: false,
  error: null,
  submitSuccess: false,
};

export const createManualOrder = createAsyncThunk(
  "orders/createManualOrder",
  async (orderData: Partial<Order>, { rejectWithValue }) => {
    try {
      // Simulate network request latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newOrder: Order = {
        ...orderData,
        id: `ORD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        status: "Pending",
        paymentStatus: orderData.paymentMethod === "Paid Online" ? "Paid" : "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Order;
      
      return newOrder;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createManualOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(createManualOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.items.unshift(action.payload); // Add to top of the list
        state.submitSuccess = true;
      })
      .addCase(createManualOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.submitSuccess = false;
      });
  },
});

export const { resetSubmitSuccess, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
