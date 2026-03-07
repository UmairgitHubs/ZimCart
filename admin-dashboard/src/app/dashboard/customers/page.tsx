"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  Users, 
  UserPlus, 
  Download, 
  FileText, 
  UserCheck, 
  UserX, 
  Database,
  TrendingUp,
  Loader2,
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomerList } from "@/components/dashboard/customers/CustomerList";
import { CustomerFilters } from "@/components/dashboard/customers/CustomerFilters";
import { CustomerDetailsModal } from "@/components/dashboard/customers/CustomerDetailsModal";
import { EditCustomerModal } from "@/components/dashboard/customers/EditCustomerModal";
import { DeleteCustomerModal } from "@/components/dashboard/customers/DeleteCustomerModal";
import { AddCustomerModal } from "@/components/dashboard/customers/AddCustomerModal";
import { Customer } from "@/types/customers";
import { useCustomers } from "@/hooks/useCustomers";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ReportService } from "@/lib/reports";

export default function CustomersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-Driven State (Source of Truth)
  const searchTerm = searchParams.get("q") || "";
  const activeStatus = searchParams.get("status") || "All";
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
        (key === 'status' && value === 'All') || 
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
  
  // 1. Data Fetching (Server-Side Pagination & Filtering)
  const { 
    customers, 
    pagination,
    isLoading, 
    isFetching,
    createCustomer, 
    updateCustomer, 
    deleteCustomer, 
    error: fetchError 
  } = useCustomers({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      status: activeStatus
  });
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Modal States
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Derived Event Handlers - Optimized with useCallback
  const handleSearch = useCallback((q: string) => updateQuery({ q, page: "1" }), [updateQuery]);
  const handleStatusChange = useCallback((status: string) => updateQuery({ status, page: "1" }), [updateQuery]);
  const handlePageChange = useCallback((page: number) => updateQuery({ page: String(page) }), [updateQuery]);

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    try {
      ReportService.generateCSV(customers as any);
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
      ReportService.generatePDF(customers as any, activeStatus);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Note: These stats might be better coming from a dedicated stats endpoint for server-side logic
  const totalCount = pagination.total;
  // Approximation for other cards since we only have current page data here
  // Ideally, these come from the backend's paginated response or a separate summary API
  const activeCount = customers.filter(c => c.status === 'Active').length; 
  const blockedCount = customers.filter(c => c.status === 'Blocked').length;

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };
  
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteTrigger = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  // Confirm Handlers
  const onUpdateConfirm = async (updatedCustomer: Customer) => {
    try {
      await updateCustomer({ id: updatedCustomer.id, data: updatedCustomer });
      setIsEditModalOpen(false);
    } catch(err) {
      console.error("Management Sync Failure:", err);
    }
  };

  const onDeleteConfirm = async (customer: Customer) => {
    try {
      await deleteCustomer(customer.id);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch(err) {
      console.error("Purge Protocol Failure:", err);
      if ((err as any).response?.status === 403) {
          alert("Permission Denied: You can only purge customers who have engaged with your store.");
      } else {
          alert("Purge failed. Ensure the network is stable.");
      }
    }
  };

  const onAddConfirm = async (newCustomer: Customer) => {
    try {
      await createCustomer(newCustomer);
      setIsAddModalOpen(false);
    } catch(err) {
      console.error("Customer Induction Failure:", err);
    }
  };

  if (fetchError) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Registry Sync Lost</h2>
              <p className="text-slate-500 font-medium">Unable to fetch customer data. Please verify your administrative credentials.</p>
              <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95"
              >
                  Retry Connection
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Customer <span className="text-emerald-600">Management</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your user base, monitor engagement and track customer lifetime value.
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Add Customer</span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Users" value={totalCount} icon={Users} color="text-emerald-600" bgColor="bg-emerald-50/50" />
        <StatCard label="Value (LTV)" value="---" icon={TrendingUp} color="text-blue-600" bgColor="bg-blue-50/50" />
        <StatCard label="Active (P.1)" value={activeCount} icon={UserCheck} color="text-emerald-500" bgColor="bg-emerald-50/30" />
        <StatCard label="Blocked (P.1)" value={blockedCount} icon={UserX} color="text-red-500" bgColor="bg-red-50/50" />
      </section>

      <section>
        <CustomerFilters 
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          activeStatus={activeStatus}
          setActiveStatus={handleStatusChange}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {isLoading || isFetching ? (
               <div className="py-24 flex items-center justify-center h-[500px] flex-col gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Scanning Registry</p>
               </div>
            ) : customers.length > 0 ? (
              <CustomerList customers={customers} onView={handleView} onEdit={handleEdit} onDelete={handleDeleteTrigger} />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Database className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No customers found</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">Try adjusting your filters or search terms.</p>
                 <button onClick={() => updateQuery({ q: null, status: null, page: null })} className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-sm">
                   Clear All Filters
                 </button>
              </div>
            )}
            
            {totalCount > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                       <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Showing <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <span className="text-slate-800">{totalCount}</span> entries
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className={cn("flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black shadow-sm transition-all uppercase tracking-widest", currentPage === 1 ? "text-slate-400 cursor-not-allowed" : "text-slate-800 hover:border-emerald-200 hover:text-emerald-600 active:scale-95")}>
                    Previous
                  </button>
                  <button disabled={currentPage >= pagination.pages} onClick={() => handlePageChange(currentPage + 1)} className={cn("flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black shadow-sm transition-all uppercase tracking-widest", (currentPage >= pagination.pages) ? "text-slate-400 cursor-not-allowed" : "text-slate-800 hover:border-emerald-200 hover:text-emerald-600 active:scale-95")}>
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CustomerDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} customer={selectedCustomer} />
      <EditCustomerModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} customer={selectedCustomer} onConfirm={onUpdateConfirm} />
      <DeleteCustomerModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} customer={selectedCustomer} onConfirm={onDeleteConfirm} />
      <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onConfirm={onAddConfirm} />
    </div>
  );
}
