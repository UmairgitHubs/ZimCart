import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, CalendarDays, ChevronDown, Check } from "lucide-react";

interface WasteFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeReason: string;
  setActiveReason: (reason: string) => void;
  activeTimeFilter: string;
  setActiveTimeFilter: (time: string) => void;
}

export function WasteFilters({
  searchTerm,
  setSearchTerm,
  activeReason,
  setActiveReason,
  activeTimeFilter,
  setActiveTimeFilter,
}: WasteFiltersProps) {
  const reasons = ["All", "Expired", "Damaged", "Leaked", "Spoilage", "Lost"];
  const timeFilters = ["All Time", "Today", "This Week", "This Month"];
  
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  
  const reasonRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (reasonRef.current && !reasonRef.current.contains(event.target as Node)) {
        setIsReasonOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative z-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search logs by product name, SKU, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Reason Dropdown Filter */}
        <div className="relative shrink-0" ref={reasonRef}>
          <button
            onClick={() => { setIsReasonOpen(!isReasonOpen); setIsTimeOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Reason: <span className="text-emerald-600">{activeReason}</span></span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isReasonOpen ? "rotate-180" : ""}`} />
          </button>

          {isReasonOpen && (
            <div className="absolute top-full right-0 sm:left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setActiveReason(reason);
                    setIsReasonOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold transition-all ${
                    activeReason === reason
                      ? "bg-slate-50 text-emerald-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span>{reason}</span>
                  {activeReason === reason && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Time Dropdown Filter */}
        <div className="relative shrink-0" ref={timeRef}>
          <button
            onClick={() => { setIsTimeOpen(!isTimeOpen); setIsReasonOpen(false); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">{activeTimeFilter}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isTimeOpen ? "rotate-180" : ""}`} />
          </button>

          {isTimeOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
              {timeFilters.map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    setActiveTimeFilter(time);
                    setIsTimeOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-bold transition-all ${
                    activeTimeFilter === time
                      ? "bg-slate-50 text-slate-800"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span>{time}</span>
                  {activeTimeFilter === time && <Check className="w-4 h-4 text-slate-800" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
