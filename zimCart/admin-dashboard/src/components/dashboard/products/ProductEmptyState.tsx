import React from "react";
import { PackageSearch, Plus } from "lucide-react";

interface ProductEmptyStateProps {
  onClear: () => void;
}

export function ProductEmptyState({ onClear }: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 border border-slate-100 animate-pulse">
        <PackageSearch className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">No Products Found</h3>
      <p className="text-slate-400 font-medium max-w-sm mx-auto mb-8 text-sm">
        We couldn't find any products matching your search criteria. Try adjusting your filters or adding a new product.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={onClear}
          className="px-6 py-2.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
        >
          Clear All Filters
        </button>
        <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>
    </div>
  );
}
