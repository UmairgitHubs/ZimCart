"use client";

import React, { useState, useCallback } from "react";
import { 
  Package, 
  RefreshCw, 
  Download, 
  FileText, 
  AlertTriangle, 
  Database, 
  TrendingUp, 
  Truck,
  Loader2,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { InventoryTable } from "@/components/dashboard/inventory/InventoryTable";
import { InventoryFilters } from "@/components/dashboard/inventory/InventoryFilters";
import { UpdateStockModal } from "@/components/dashboard/inventory/UpdateStockModal";
import { InventoryHistoryModal } from "@/components/dashboard/inventory/InventoryHistoryModal";
import { DeleteInventoryModal } from "@/components/dashboard/inventory/DeleteInventoryModal";
import { useInventory, useUpdateStock, useDeleteInventory } from "@/hooks/useInventory";
import { InventoryItem } from "@/types/inventory";
import { exportInventoryToCSV, exportInventoryToPDF } from "@/utils/exportInventory";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-Driven State (The Senior Way)
  const searchTerm = searchParams.get("q") || "";
  const activeStatus = searchParams.get("status") || "All";
  const activeCategory = searchParams.get("category") || "All Categories";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  // Utility to update URL without page refresh - Wrapped in useCallback with dirty-check
  const updateQuery = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanged = false;

    Object.entries(updates).forEach(([key, value]) => {
      const currentValue = params.get(key);
      const isDefault = 
        value === null || 
        value === "" || 
        (key === 'status' && value === 'All') || 
        (key === 'category' && value === 'All Categories') || 
        (key === 'page' && value === '1');

      if (isDefault) {
        if (params.has(key)) {
          params.delete(key);
          hasChanged = true;
        }
      } else if (currentValue !== value) {
        params.set(key, value!);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Tanstack Query - Integrated with URL State
  const { data: inventoryResponse, isLoading, refetch } = useInventory({
    search: searchTerm,
    status: activeStatus === "All" ? undefined : activeStatus,
    category: activeCategory === "All Categories" ? undefined : activeCategory,
    page: currentPage,
    limit: itemsPerPage
  });

  const { mutateAsync: updateStock } = useUpdateStock();
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteInventory();

  const inventory = inventoryResponse?.data?.items || [];
  const pagination = inventoryResponse?.data?.pagination || { total: 0, pages: 1 };

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      await exportInventoryToCSV(inventory);
      setCsvSuccess(true);
      setTimeout(() => setCsvSuccess(false), 2000);
    } catch (e) {
      console.error("CSV Export Failed", e);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportInventoryToPDF(inventory);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    } catch (e) {
      console.error("PDF Export Failed", e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const stats = inventoryResponse?.data?.stats || {
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    reservedStockCount: 0
  };

  // Event Handlers - Optimized with useCallback
  const handleSearch = useCallback((q: string) => updateQuery({ q, page: "1" }), [updateQuery]);
  const handleStatusChange = useCallback((status: string) => updateQuery({ status, page: "1" }), [updateQuery]);
  const handleCategoryChange = useCallback((category: string) => updateQuery({ category, page: "1" }), [updateQuery]);
  const handlePageChange = useCallback((page: number) => updateQuery({ page: String(page) }), [updateQuery]);

  const handleAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };
  const handleViewHistory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsHistoryModalOpen(true);
  };

  const handleDeleteTrigger = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteItem(selectedItem.id);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            Inventory <span className="text-emerald-600">Management</span>
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time inventory tracking and comprehensive stock control.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
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

          <button 
            onClick={() => refetch()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 group"
          >
            <RefreshCw className={cn("w-4 h-4 transition-transform", isLoading && "animate-spin")} />
            <span>Sync Inventory</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Value" value={`$${(stats.totalValue / 1000).toFixed(1)}k`} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50/50" />
        <StatCard label="Low Items" value={stats.lowStockCount} icon={AlertTriangle} color="text-amber-600" bgColor="bg-amber-50/50" />
        <StatCard label="Out Of Stock" value={stats.outOfStockCount} icon={Package} color="text-red-600" bgColor="bg-red-50/50" />
        <StatCard label="Reserved" value={stats.reservedStockCount} icon={Truck} color="text-blue-600" bgColor="bg-blue-50/50" />
      </section>

      <section>
        <InventoryFilters 
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          activeStatus={activeStatus}
          setActiveStatus={handleStatusChange}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {isLoading ? (
               <div className="p-40 text-center flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-[32px] animate-pulse"></div>
                    <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-[32px] animate-spin"></div>
                    <Database className="absolute inset-0 m-auto w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Hydrating Stocks</h3>
                  <p className="text-slate-400 font-bold mt-2">Connecting to the vault...</p>
               </div>
            ) : inventory.length > 0 ? (
              <InventoryTable items={inventory} onAdjust={handleAdjust} onViewHistory={handleViewHistory} onDelete={handleDeleteTrigger} />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <Database className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Stock record not found</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">We couldn't find any inventory results matching your criteria.</p>
                 <button 
                   onClick={() => updateQuery({ q: null, status: null, category: null, page: null })}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset Inventory View
                 </button>
              </div>
            )}
            
            {!isLoading && inventory.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                       <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Tracking <span className="text-slate-800">{pagination.total}</span> SKUs across the network
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 disabled:text-slate-400 disabled:opacity-50 hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 uppercase tracking-widest"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= (pagination.pages || 1)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <UpdateStockModal 
        isOpen={isUpdateModalOpen}
        onClose={() => { setIsUpdateModalOpen(false); setSelectedItem(null); }}
        item={selectedItem}
        onConfirm={async (itemId, newStock, reason) => {
          try {
            await updateStock({ id: itemId, currentStock: newStock, reason });
            setIsUpdateModalOpen(false);
            setSelectedItem(null);
          } catch (error) {
            console.error("Stock update failed", error);
          }
        }}
      />

      <InventoryHistoryModal isOpen={isHistoryModalOpen} onClose={() => { setIsHistoryModalOpen(false); setSelectedItem(null); }} item={selectedItem} />
      <DeleteInventoryModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedItem(null); }} onConfirm={confirmDelete} item={selectedItem} isLoading={isDeleting} />
    </div>
  );
}
