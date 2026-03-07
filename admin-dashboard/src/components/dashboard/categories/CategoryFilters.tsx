import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

interface CategoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeStatus: string;
  setActiveStatus: (val: string) => void;
}

const STATUS_OPTIONS = ["All", "Published", "Draft", "Hidden"];

export function CategoryFilters({
  searchTerm,
  setSearchTerm,
  activeStatus,
  setActiveStatus,
}: CategoryFiltersProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 400);

  // Sync external resets
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounce dispatch
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchTerm, setSearchTerm]);

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 mb-6 p-4 md:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Modern Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search categories by name, ID or description..."
            className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-slate-50/50 border-2 border-slate-200/60 rounded-2xl text-[13px] font-bold focus:ring-8 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/40 transition-all outline-none text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={cn(
              "flex items-center justify-between gap-3 px-6 py-3 md:py-3.5 bg-white border-2 rounded-2xl text-[13px] font-black tracking-tight transition-all min-w-[180px]",
              isStatusOpen 
                ? "border-emerald-500 text-emerald-600 ring-8 ring-emerald-50 shadow-lg shadow-emerald-500/5" 
                : "border-slate-100 text-slate-600 hover:border-slate-200"
            )}
          >
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4" />
              <span>{activeStatus}</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isStatusOpen && "rotate-180")} />
          </button>

          {isStatusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white border-2 border-emerald-500/20 rounded-2xl shadow-xl shadow-slate-200/40 z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setActiveStatus(status);
                      setIsStatusOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-3 text-[13px] font-bold transition-all",
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
  );
}
