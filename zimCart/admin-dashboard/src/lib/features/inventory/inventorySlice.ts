import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StockStatus } from '@/types/inventory';

interface InventoryState {
  filters: {
    searchTerm: string;
    category: string;
    status: StockStatus | 'All';
    warehouse: string;
    page: number;
    limit: number;
  };
}

const initialState: InventoryState = {
  filters: {
    searchTerm: '',
    category: 'All Categories',
    status: 'All',
    warehouse: 'All Warehouses',
    page: 1,
    limit: 10,
  },
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload;
      state.filters.page = 1;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
      state.filters.page = 1;
    },
    setStatus: (state, action: PayloadAction<StockStatus | 'All'>) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setWarehouse: (state, action: PayloadAction<string>) => {
      state.filters.warehouse = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
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
  setWarehouse,
  setPage,
  setLimit,
  clearFilters,
} = inventorySlice.actions;

export default inventorySlice.reducer;
