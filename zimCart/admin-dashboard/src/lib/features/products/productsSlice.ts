import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/products";
import { MOCK_PRODUCTS } from "@/constants/products";

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  submitSuccess: boolean;
}

const initialState: ProductsState = {
  items: MOCK_PRODUCTS,
  isLoading: false,
  error: null,
  submitSuccess: false,
};

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const newProduct: Product = {
        ...productData,
        id: `PROD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        lastUpdated: new Date().toISOString(),
        sales: 0,
      } as Product;
      
      return newProduct;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { id, data };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
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
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.submitSuccess = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.submitSuccess = false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.data, lastUpdated: new Date().toISOString() };
        }
        state.submitSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.submitSuccess = false;
      });
  },
});

export const { resetSubmitSuccess, clearError } = productsSlice.actions;
export default productsSlice.reducer;
