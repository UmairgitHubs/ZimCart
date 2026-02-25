import React, { useState } from "react";
import { Search, Filter, ChevronDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 mb-6 p-4 md:p-6 group relative overflow-hidden">
      {/* Search & Filter Unit */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
        {/* Modern Search */}
        <div className="relative flex-1 group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter categories by name or ID..."
            className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/20 transition-all outline-none text-slate-700"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={cn(
              "w-full lg:w-48 flex items-center justify-between gap-3 px-5 py-2.5 md:py-3 bg-white border rounded-2xl text-sm font-black transition-all",
              isStatusOpen 
                ? "border-emerald-500 text-emerald-600 ring-4 ring-emerald-50 shadow-lg shadow-emerald-500/5 scale-[1.02]" 
                : "border-slate-100 text-slate-600 hover:border-slate-200"
            )}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
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
  );
}
