import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductStatus } from '@/types/products';

interface ProductsState {
  filters: {
    searchTerm: string;
    category: string;
    status: ProductStatus | 'All';
    page: number;
    limit: number;
  };
  selectedProductIds: string[];
}

const initialState: ProductsState = {
  filters: {
    searchTerm: '',
    category: 'All Categories',
    status: 'All',
    page: 1,
    limit: 10,
  },
  selectedProductIds: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.filters.page = 1; // Reset to first page on search
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.filters.page = 1;
    },
    setStatus: (state, action: PayloadAction<ProductStatus | 'All'>) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
    },
    setSelectedProductIds: (state, action: PayloadAction<string[]>) => {
      state.selectedProductIds = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setSearchTerm,
  setCategory,
  setStatus,
  setPage,
  setLimit,
  setSelectedProductIds,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
