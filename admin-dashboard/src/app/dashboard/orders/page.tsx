"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  ShoppingBag, 
  Download,
  FileText,
  Clock,
  XCircle,
  Plus,
  Loader2,
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrderTable } from "@/components/dashboard/orders/OrderTable";
import { OrderFilters } from "@/components/dashboard/orders/OrderFilters";
import { OrderEmptyState } from "@/components/dashboard/orders/OrderEmptyState";
import { ManualOrderModal } from "@/components/dashboard/orders/ManualOrderModal";
import { OrderDetailsModal } from "@/components/dashboard/orders/OrderDetailsModal";
import { Order } from "@/types/orders";
import { STATUS_TABS } from "@/constants/orders";
import { useOrders } from "@/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { ReportService } from "@/lib/reports";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-Driven State (Source of Truth)
  const searchTerm = searchParams.get("q") || "";
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const activeTab = searchParams.get("status") || "All Orders";
  const timeRange = searchParams.get("range") || "All Time";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  // Utility to update URL without page refresh - Wrapped in useCallback with change tracking
  const updateQuery = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    let hasChanged = false;

    Object.entries(updates).forEach(([key, value]) => {
      const currentValue = params.get(key);
      const isDefault = 
        value === null || 
        value === "" || 
        (key === 'status' && value === 'All Orders') || 
        (key === 'range' && value === 'All Time') || 
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
  
  const { orders, stats, isLoading, updateStatus, isUpdating, deleteOrder: removeOrder } = useOrders();

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  
  // Modal State
  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Synchronize the modal's snapshot with live remote updates
  useEffect(() => {
    if (selectedOrder) {
      const latestSnapshot = orders.find(o => o.id === selectedOrder.id);
      if (latestSnapshot && latestSnapshot.status !== selectedOrder.status) {
        setSelectedOrder(latestSnapshot);
      }
    }
  }, [orders, selectedOrder]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All Orders" || order.status === activeTab;
      const matchesSearch = 
        order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      let matchesTime = true;
      if (timeRange !== "All Time") {
         const orderDate = new Date(order.createdAt);
         const now = new Date();
         if (timeRange === "Today") {
            matchesTime = orderDate.toDateString() === now.toDateString();
         } else if (timeRange === "This Week") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesTime = orderDate >= weekAgo;
         } else if (timeRange === "This Month") {
            matchesTime =
              orderDate.getFullYear() === now.getFullYear() &&
              orderDate.getMonth() === now.getMonth();
         }
      }

      return matchesTab && matchesSearch && matchesTime;
    });
  }, [orders, activeTab, debouncedSearchTerm, timeRange]);

  // Optimized Event Handlers
  const handleSearch = useCallback((q: string) => updateQuery({ q, page: "1" }), [updateQuery]);
  const handleTabChange = useCallback((status: string) => updateQuery({ status, page: "1" }), [updateQuery]);
  const handleRangeChange = useCallback((range: string) => updateQuery({ range, page: "1" }), [updateQuery]);
  const handlePageChange = useCallback((page: number) => updateQuery({ page: String(page) }), [updateQuery]);

  // Derive paginated chunk
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    try {
      ReportService.generateCSV(filteredOrders);
      setCsvSuccess(true);
      setTimeout(() => setCsvSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      ReportService.generatePDF(filteredOrders, activeTab);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Order <span className="text-emerald-600">Fulfillment</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Track, manage and process your store's incoming transactions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Actions Step */}
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
            onClick={() => { setOrderToEdit(null); setIsManualOrderOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create Order</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Sales Volume" 
          value={stats.totalVolume} 
          icon={ShoppingBag} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Pending Sync" 
          value={stats.pendingOrders} 
          icon={Clock} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="True Revenue" 
          value={`Rs ${stats.grossRevenue.toLocaleString()}`} 
          icon={CheckCircle2} 
          color="text-emerald-500" 
          bgColor="bg-emerald-50/30" 
        />
        <StatCard 
          label="Drop Rate" 
          value={stats.canceledRate} 
          icon={XCircle} 
          color="text-red-500" 
          bgColor="bg-red-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <OrderFilters 
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          statusTabs={STATUS_TABS}
          timeRange={timeRange}
          setTimeRange={handleRangeChange}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 blur-[100px] z-0 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {isLoading ? (
               <div className="py-24 flex items-center justify-center leading-none">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
               </div>
            ) : paginatedOrders.length > 0 ? (
              <OrderTable 
                orders={paginatedOrders} 
                onViewDetails={setSelectedOrder}
                onDelete={removeOrder}
                onEdit={(order) => {
                   setOrderToEdit(order);
                   setIsManualOrderOpen(true);
                }}
              />
            ) : (
              <OrderEmptyState 
                action={
                  <button 
                    onClick={() => updateQuery({ q: null, status: null, range: null, page: null })}
                    className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-sm"
                  >
                    Reset Filters
                  </button>
                }
              />
            )}
            
            {/* Standardized Pagination Controls */}
            {filteredOrders.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Showing <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="text-slate-800">{filteredOrders.length}</span> results
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={cn(
                      "flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black shadow-sm transition-all uppercase tracking-widest",
                      currentPage === 1 ? "text-slate-400 cursor-not-allowed" : "text-slate-800 hover:border-emerald-200 hover:text-emerald-600 active:scale-95"
                    )}
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={cn(
                      "flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black shadow-sm transition-all uppercase tracking-widest",
                      (currentPage === totalPages || totalPages === 0) ? "text-slate-400 cursor-not-allowed" : "text-slate-800 hover:border-emerald-200 hover:text-emerald-600 active:scale-95"
                    )}
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <ManualOrderModal 
        isOpen={isManualOrderOpen}
        onClose={() => {
          setIsManualOrderOpen(false);
          setOrderToEdit(null);
        }}
        editOrder={orderToEdit}
      />

      <OrderDetailsModal 
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={async (id, status) => { await updateStatus({ id, status }); }}
        isUpdating={isUpdating}
      />
    </div>
  );
}
