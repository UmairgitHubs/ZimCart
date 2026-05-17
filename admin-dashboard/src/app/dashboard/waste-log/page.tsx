"use client";

import React, { useState, useMemo } from "react";
import { 
  PackageMinus, 
  Trash2, 
  Download, 
  FileText, 
  Plus, 
  Database,
  DollarSign,
  AlertOctagon,
  TrendingDown,
  Loader2,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
// Import Components
import { WasteList } from "@/components/dashboard/waste/WasteList";
import { WasteFilters } from "@/components/dashboard/waste/WasteFilters";
// Import Modals
import { WasteDetailsModal } from "@/components/dashboard/waste/WasteDetailsModal";
import { AddWasteModal } from "@/components/dashboard/waste/AddWasteModal";
import { EditWasteModal } from "@/components/dashboard/waste/EditWasteModal";
import { DeleteWasteModal } from "@/components/dashboard/waste/DeleteWasteModal";
import { WasteLogEntry } from "@/types/waste";
import { useInventory } from "@/hooks/useInventory";
import { useWasteLogs, useWasteMutations } from "@/hooks/useWasteLogs";

export default function WasteLogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeReason, setActiveReason] = useState("All");
  const [activeTimeFilter, setActiveTimeFilter] = useState("This Week");

  // Modal States
  const [selectedLog, setSelectedLog] = useState<WasteLogEntry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const { data: inventoryResponse, isLoading: inventoryLoading } = useInventory({
    page: 1,
    limit: 200,
  });
  const inventoryItems = inventoryResponse?.data?.items || [];
  const { create, update, remove } = useWasteMutations();

  const {
    data: wasteLogs = [],
    isLoading: logsLoading,
    refetch: refetchWasteLogs,
  } = useWasteLogs({
    search: searchTerm || undefined,
    reason: activeReason,
  });

  const filteredLogs = useMemo(() => {
    return wasteLogs.filter((log) => {
      const matchesReason = 
        activeReason === "All" || 
        log.reason === activeReason;
      
      const matchesSearch = 
        log.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTime = true;
      if (activeTimeFilter !== "All Time") {
        const logDate = new Date(log.timestamp);
        const now = new Date();
        if (activeTimeFilter === "Today") {
          matchesTime = logDate.toDateString() === now.toDateString();
        } else if (activeTimeFilter === "This Week") {
          const diffTime = Math.abs(now.getTime() - logDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          matchesTime = diffDays <= 7;
        } else if (activeTimeFilter === "This Month") {
          matchesTime =
            logDate.getFullYear() === now.getFullYear() &&
            logDate.getMonth() === now.getMonth();
        }
      }
      
      return matchesReason && matchesSearch && matchesTime;
    });
  }, [wasteLogs, searchTerm, activeReason, activeTimeFilter]);

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

  const totalWasteLoss = filteredLogs.reduce((acc, curr) => acc + curr.totalLoss, 0);
  const totalItemsWasted = filteredLogs.reduce((acc, curr) => acc + curr.quantity, 0);
  const latestEntry = filteredLogs.length > 0 ? filteredLogs[0] : null;

  const handleView = (log: WasteLogEntry) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (log: WasteLogEntry) => {
    setSelectedLog(log);
    setIsEditModalOpen(true);
  };

  const handleDelete = (log: WasteLogEntry) => {
    setSelectedLog(log);
    setIsDeleteModalOpen(true);
  };

  const handleAddConfirm = async (newLog: WasteLogEntry) => {
    const target = inventoryItems.find(
      (item: { id: string; sku: string; productName: string }) =>
        item.sku.toLowerCase() === newLog.sku.toLowerCase() ||
        item.productName.toLowerCase() === newLog.productName.toLowerCase()
    );
    if (!target) {
      throw new Error("Product not found in inventory. Use exact SKU or product name.");
    }
    await create.mutateAsync({
      productId: target.id,
      quantity: newLog.quantity,
      reason: newLog.reason,
      unitCost: newLog.unitCost,
      notes: newLog.notes,
    });
    await refetchWasteLogs();
  };

  const handleEditConfirm = async (updatedLog: WasteLogEntry) => {
    if (!selectedLog) throw new Error("No waste entry selected.");
    await update.mutateAsync({
      id: selectedLog.id,
      quantity: updatedLog.quantity,
      reason: updatedLog.reason,
      notes: updatedLog.notes,
      unitCost: updatedLog.unitCost,
    });
    await refetchWasteLogs();
  };

  const handleDeleteConfirm = async (log: WasteLogEntry) => {
    await remove.mutateAsync(log.id);
    await refetchWasteLogs();
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0 text-left">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Waste <span className="text-rose-600">Logging</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track inventory shrinkages, manage spoilages, and analyze cost implications.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Actions Step */}
          <div className="relative group/export hidden sm:block">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className={cn(
                "flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-sm hover:border-rose-200 hover:bg-rose-50/30 whitespace-nowrap",
                showExportOptions && "border-rose-200 bg-rose-50/30 ring-4 ring-rose-500/5 text-rose-700"
              )}
            >
              <Download className={cn("w-4 h-4 text-rose-600 transition-transform", showExportOptions && "scale-110")} />
              <span>Export Analysis</span>
              <ChevronDown className={cn("w-3.5 h-3.5 ml-0.5 text-slate-400 transition-transform duration-300", showExportOptions && "rotate-180 text-rose-500")} />
            </button>

            {showExportOptions && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportOptions(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-50 py-1 px-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col">
                    <button 
                      onClick={() => { handleExportCSV(); setShowExportOptions(false); }}
                      disabled={isExportingCSV || csvSuccess}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[12px] font-bold transition-all group/item",
                        csvSuccess ? 'bg-rose-50 text-rose-700' :
                        isExportingCSV ? 'text-slate-400 cursor-not-allowed bg-slate-50' : 
                        'text-slate-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                        {isExportingCSV ? <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> : 
                         csvSuccess ? <CheckCircle2 className="w-4 h-4 text-rose-600" /> : 
                         <Download className="w-4 h-4 text-rose-600 group-hover/item:scale-110 transition-transform" />}
                      </div>
                      <span className="tracking-tight uppercase">CSV Report</span>
                    </button>
                    
                    <div className="h-[1px] w-full bg-slate-50 my-1" />

                    <button 
                      onClick={() => { handleExportPDF(); setShowExportOptions(false); }}
                      disabled={isExportingPDF || pdfSuccess}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[12px] font-bold transition-all group/item",
                        pdfSuccess ? 'bg-rose-50 text-rose-700' :
                        isExportingPDF ? 'text-slate-400 cursor-not-allowed bg-slate-50' : 
                        'text-slate-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95'
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                        {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> : 
                         pdfSuccess ? <CheckCircle2 className="w-4 h-4 text-rose-600" /> : 
                         <FileText className="w-4 h-4 text-rose-600 group-hover/item:scale-110 transition-transform" />}
                      </div>
                      <span className="tracking-tight uppercase">PDF Report</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/10 group uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Record New Waste</span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Loss value" 
          value={`$${totalWasteLoss.toFixed(2)}`} 
          icon={TrendingDown} 
          color="text-rose-600" 
          bgColor="bg-rose-50/50" 
        />
        <StatCard 
          label="Items Shrinkage" 
          value={`${totalItemsWasted} Units`} 
          icon={PackageMinus} 
          color="text-orange-500" 
          bgColor="bg-orange-50/30" 
        />
        <StatCard 
          label="Total Reports" 
          value={wasteLogs.length} 
          icon={Trash2} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Recent Alert" 
          value={latestEntry?.reason || 'None'} 
          icon={AlertOctagon} 
          color="text-amber-500" 
          bgColor="bg-amber-50/50" 
        />
      </section>

      <section>
        <WasteFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeReason={activeReason}
          setActiveReason={setActiveReason}
          activeTimeFilter={activeTimeFilter}
          setActiveTimeFilter={setActiveTimeFilter}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px] shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {inventoryLoading || logsLoading ? (
              <div className="py-24 flex items-center justify-center leading-none">
                <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
              </div>
            ) : filteredLogs.length > 0 ? (
              <WasteList 
                logs={filteredLogs} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Database className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">No records found</h3>
                 <p className="text-slate-400 font-semibold mt-2 max-w-sm mx-auto text-sm">Adjust your filters or search terms to find specific log entries.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveReason("All"); }}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset filters
                 </button>
              </div>
            )}
            
            {filteredLogs.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-500">
                         <DollarSign className="w-3 h-3" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                   </div>
                   <p className="font-bold text-slate-400 text-[11px] uppercase tracking-widest">
                     Directory contains <span className="text-slate-800 underline decoration-rose-500/20 underline-offset-4">{filteredLogs.length}</span> matching records
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <button className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-300 cursor-not-allowed transition-all uppercase tracking-widest">Previous</button>
                   <button className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 uppercase tracking-widest">Next Page</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <WasteDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        log={selectedLog}
      />

      <AddWasteModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={async (newLog) => {
          await handleAddConfirm(newLog);
        }}
      />

      <EditWasteModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={async (updatedLog) => {
          await handleEditConfirm(updatedLog);
        }}
        log={selectedLog}
      />

      <DeleteWasteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async (log) => {
          await handleDeleteConfirm(log);
        }}
        log={selectedLog}
      />
    </div>
  );
}
