import React, { useState, useRef, useEffect } from "react";
import { Plus, Download, FileText, ChevronDown, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductHeaderProps {
  onAddSingle: () => void;
  onAddBulk: () => void;
}

export function ProductHeader({ onAddSingle, onAddBulk }: ProductHeaderProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const entryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (entryRef.current && !entryRef.current.contains(event.target as Node)) {
        setShowAddOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    setTimeout(() => {
      setIsExportingCSV(false);
      setCsvSuccess(true);
      setTimeout(() => setCsvSuccess(false), 2000);
    }, 1500);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      setIsExportingPDF(false);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    }, 1500);
  };

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Product <span className="text-emerald-600">Catalog</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Manage your inventory, prices and stock levels conveniently.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Export Actions */}
        <div className="relative group/export hidden sm:block">
          <button 
            onClick={() => setShowExportOptions(!showExportOptions)}
            className={cn(
              "flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 whitespace-nowrap",
              showExportOptions && "border-emerald-200 bg-emerald-50/30 ring-4 ring-emerald-500/5 text-emerald-700"
            )}
          >
            <Download className={cn("w-4 h-4 text-emerald-600 transition-transform", showExportOptions && "scale-110")} />
            <span>Export Report</span>
            <ChevronDown className={cn("w-3.5 h-3.5 ml-0.5 text-slate-400 transition-transform duration-300", showExportOptions && "rotate-180 text-emerald-500")} />
          </button>

          {showExportOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowExportOptions(false)} />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-50 py-1 px-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col">
                  <button 
                    onClick={() => { handleExportCSV(); setShowExportOptions(false); }}
                    disabled={isExportingCSV || csvSuccess}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[12px] font-bold transition-all group/item",
                      csvSuccess ? 'bg-emerald-50 text-emerald-700' :
                      isExportingCSV ? 'text-slate-400 cursor-not-allowed bg-slate-50' : 
                      'text-slate-600 hover:bg-slate-50 hover:text-emerald-700 active:scale-95'
                    )}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                      {isExportingCSV ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : 
                       csvSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : 
                       <Download className="w-4 h-4 text-emerald-600 group-hover/item:scale-110 transition-transform" />}
                    </div>
                    <span className="tracking-tight uppercase">CSV Report</span>
                  </button>
                  <div className="h-[1px] w-full bg-slate-50 my-1" />
                  <button 
                    onClick={() => { handleExportPDF(); setShowExportOptions(false); }}
                    disabled={isExportingPDF || pdfSuccess}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[12px] font-bold transition-all group/item",
                      pdfSuccess ? 'bg-emerald-50 text-emerald-700' :
                      isExportingPDF ? 'text-slate-400 cursor-not-allowed bg-slate-50' : 
                      'text-slate-600 hover:bg-slate-50 hover:text-emerald-700 active:scale-95'
                    )}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                      {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> : 
                       pdfSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : 
                       <FileText className="w-4 h-4 text-emerald-600 group-hover/item:scale-110 transition-transform" />}
                    </div>
                    <span className="tracking-tight uppercase">PDF Report</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add Product Actions */}
        <div className="relative group/add" ref={entryRef}>
          <button 
            onClick={() => setShowAddOptions(!showAddOptions)}
            className={cn(
              "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/15 group",
              showAddOptions && "ring-4 ring-emerald-500/10"
            )}
          >
            <Plus className={cn("w-4 h-4 transition-transform duration-300", showAddOptions && "rotate-90")} />
            <span>Add Product</span>
            <ChevronDown className={cn("w-3.5 h-3.5 ml-1 text-white/50 transition-transform duration-300", showAddOptions && "rotate-180 text-white")} />
          </button>

          {showAddOptions && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-slate-100 z-50 py-2 px-3 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300">
              <button 
                onClick={() => { onAddSingle(); setShowAddOptions(false); }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-[12px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-95 group/item outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors shadow-sm">
                  <Plus className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="uppercase tracking-tight">Single Entry</span>
              </button>
              <div className="h-[1px] w-full bg-slate-50 my-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
              <button 
                onClick={() => { onAddBulk(); setShowAddOptions(false); }}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-[12px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-95 group/item outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors shadow-sm">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="uppercase tracking-tight">Bulk Sync</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
