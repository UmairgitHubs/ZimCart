import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ListFilter, Plus, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "@/constants/products";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  activeStatus: string;
  setActiveStatus: (val: string) => void;
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeStatus,
  setActiveStatus,
}: ProductFiltersProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Debouncing for Search functionality (Senior level performance optimization)
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync Redux only when debounced value changes
  useEffect(() => {
    setSearchTerm(debouncedSearch);
  }, [debouncedSearch, setSearchTerm]);

  // Sync internal state when external resets happen
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 mb-6 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products by name, SKU, brand..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-700 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/20 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsStatusOpen(false);
              }}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-2xl text-sm font-bold transition-all min-w-[180px]",
                isCategoryOpen ? "border-emerald-500 text-emerald-600 ring-4 ring-emerald-50" : "border-slate-100 text-slate-600 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4" />
                <span className="truncate max-w-[100px]">{activeCategory}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isCategoryOpen && "rotate-180")} />
            </button>

            {isCategoryOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/20 z-20 py-2 animate-in fade-in zoom-in-95 duration-100 h-64 overflow-y-auto no-scrollbar">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setIsCategoryOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors",
                        activeCategory === cat ? "text-emerald-600 bg-emerald-50/50" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsCategoryOpen(false);
              }}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-2xl text-sm font-bold transition-all min-w-[160px]",
                isStatusOpen ? "border-emerald-500 text-emerald-600 ring-4 ring-emerald-50" : "border-slate-100 text-slate-600 hover:border-slate-200"
              )}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>{activeStatus}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusOpen && "rotate-180")} />
            </button>

            {isStatusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white border-2 border-emerald-500/20 rounded-2xl shadow-xl shadow-slate-200/40 z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
                  {PRODUCT_STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setActiveStatus(status);
                        setIsStatusOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm font-bold transition-all",
                        activeStatus === status ? "text-emerald-600 bg-emerald-50/80" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
