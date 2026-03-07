import React from "react";
import { Search, Filter } from "lucide-react";

interface RiderFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeStatus: string;
  setActiveStatus: (status: string) => void;
}

export function RiderFilters({
  searchTerm,
  setSearchTerm,
  activeStatus,
  setActiveStatus,
}: RiderFiltersProps) {
  const statuses = ["All", "Available", "Dispatched", "Offline", "Banned"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search riders by name, ID, or license plate..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
        <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl mr-1">
           <Filter className="w-4 h-4 text-slate-500" />
           <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Status</span>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
                activeStatus === status
                  ? status === "Available" ? "bg-emerald-100 text-emerald-700 shadow-sm"
                  : status === "Dispatched" ? "bg-blue-100 text-blue-700 shadow-sm"
                  : status === "Banned" ? "bg-red-100 text-red-700 shadow-sm"
                  : "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
