import React from 'react';
import { Search, Calendar, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/orders";

interface OrderFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  statusTabs: string[];
  timeRange: string;
  setTimeRange: (val: string) => void;
}

const timeRanges = ["All Time", "Today", "This Week", "This Month"];

export function OrderFilters({ 
  searchTerm, 
  setSearchTerm, 
  activeTab, 
  setActiveTab,
  statusTabs,
  timeRange,
  setTimeRange
}: OrderFiltersProps) {
  const [isStatusOpen, setIsStatusOpen] = React.useState(false);
  const [isTimeOpen, setIsTimeOpen] = React.useState(false);

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 overflow-visible mb-6">
      {/* Control Bar */}
      <div className="p-4 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, customer..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 focus:bg-white focus:border-emerald-500/20 transition-all outline-none"
            />
          </div>

          {/* Status Dropdown Filter */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsTimeOpen(false);
              }}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-2xl text-sm font-bold transition-all min-w-[160px]",
                isStatusOpen ? "border-emerald-500 text-emerald-600 ring-4 ring-emerald-50" : "border-slate-100 text-slate-600 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>{activeTab}</span>
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusOpen && "rotate-180")} />
            </button>

            {isStatusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/20 z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
                  {statusTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setIsStatusOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm font-semibold transition-colors",
                        activeTab === tab 
                          ? "text-emerald-600 bg-emerald-50/50" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Dropdown */}
          <div className="relative flex-1 lg:flex-none">
            <button 
              onClick={() => {
                setIsTimeOpen(!isTimeOpen);
                setIsStatusOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white border rounded-2xl text-[13px] font-bold transition-all min-w-[150px]",
                isTimeOpen ? "border-emerald-500 text-emerald-600 ring-4 ring-emerald-50" : "border-slate-100 text-slate-600 hover:border-slate-300"
              )}
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{timeRange}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isTimeOpen && "rotate-180")} />
            </button>

            {isTimeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTimeOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/20 z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setIsTimeOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm font-semibold transition-colors",
                        timeRange === range 
                          ? "text-emerald-600 bg-emerald-50/50" 
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {range}
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
