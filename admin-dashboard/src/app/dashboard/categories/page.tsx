"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Plus, Download, FileText, Tags, CheckCircle2, AlertCircle, EyeOff, Loader2, ChevronDown, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryList } from "@/components/dashboard/categories/CategoryList";
import { CategoryFilters } from "@/components/dashboard/categories/CategoryFilters";
import { AddCategoryModal } from "@/components/dashboard/categories/AddCategoryModal";
import { CategoryDetailsModal } from "@/components/dashboard/categories/CategoryDetailsModal";
import { DeleteCategoryModal } from "@/components/dashboard/categories/DeleteCategoryModal";
import { Category } from "@/types/categories";
import { useCategories } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { ReportService } from "@/lib/reports";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function CategoriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-Driven State (The Senior Way)
  const searchTerm = searchParams.get("q") || "";
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
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

  const { data: categoriesResponse, isLoading } = useCategories({
    search: debouncedSearchTerm.trim().length >= 3 || debouncedSearchTerm.length === 0 ? debouncedSearchTerm : "",
    status: activeStatus
  });
  
  // Robust Data Extraction
  const apiPayload = categoriesResponse?.data?.data || categoriesResponse?.data;
  const categories: Category[] = apiPayload?.items || [];
  const stats = apiPayload?.stats || { total: 0, published: 0, draft: 0, hidden: 0 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const filteredCategories = categories;

  // Derive paginated chunk
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Handle Event Triggers - Optimized with useCallback
  const handleSearch = useCallback((q: string) => updateQuery({ q, page: "1" }), [updateQuery]);
  const handleStatusChange = useCallback((status: string) => updateQuery({ status, page: "1" }), [updateQuery]);
  const handlePageChange = useCallback((page: number) => updateQuery({ page: String(page) }), [updateQuery]);

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    try {
      ReportService.generateCategoryCSV(filteredCategories);
      setCsvSuccess(true);
      setTimeout(() => setCsvSuccess(false), 2000);
    } catch (error) {
       console.error("CSV Export Failed:", error);
    } finally {
       setIsExportingCSV(false);
    }
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const context = activeStatus !== "All" ? activeStatus : "All Systems";
      ReportService.generateCategoryPDF(filteredCategories, context);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2000);
    } catch (error) {
       console.error("PDF Export Failed:", error);
    } finally {
       setIsExportingPDF(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };
  const handleDelete = (cat: Category) => {
    setSelectedCategory(cat);
    setIsDeleteModalOpen(true);
  };
  const handleView = (cat: Category) => {
    setSelectedCategory(cat);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Category <span className="text-emerald-600">Registry</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Organize your product hierarchy and catalog visibility.
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
            onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create Category</span>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total" value={stats.total} icon={Tags} color="text-emerald-600" bgColor="bg-emerald-50/50" />
        <StatCard label="Published" value={stats.published} icon={CheckCircle2} color="text-blue-600" bgColor="bg-blue-50/50" />
        <StatCard label="Pending/Draft" value={stats.draft} icon={AlertCircle} color="text-amber-600" bgColor="bg-amber-50/50" />
        <StatCard label="Hidden" value={stats.hidden} icon={Archive} color="text-slate-500" bgColor="bg-slate-100" />
      </section>

      <section>
        <CategoryFilters 
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          activeStatus={activeStatus}
          setActiveStatus={handleStatusChange}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 relative group min-h-[400px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 blur-[100px] z-0 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
               <div className="p-20 text-center flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                  <p className="text-slate-500 font-bold">Synchronizing hierarchy...</p>
               </div>
            ) : paginatedCategories.length > 0 ? (
              <CategoryList 
                categories={paginatedCategories} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                    <Tags className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">No categories found</h3>
                 <p className="text-slate-400 font-bold mt-2">Adjust your filters or try a different search term.</p>
                 <button 
                   onClick={() => updateQuery({ q: null, status: null, page: null })}
                   className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95"
                 >
                   Clear All Filters
                 </button>
              </div>
            )}
            
            {filteredCategories.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Showing <span className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredCategories.length)}</span> of <span className="text-slate-800">{filteredCategories.length}</span> categories
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

      <AddCategoryModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedCategory(null); }} category={selectedCategory} />
      <CategoryDetailsModal isOpen={isDetailsModalOpen} onClose={() => { setIsDetailsModalOpen(false); setSelectedCategory(null); }} category={selectedCategory} onEdit={handleEdit} />
      <DeleteCategoryModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedCategory(null); }} category={selectedCategory} onConfirm={() => { setIsDeleteModalOpen(false); setSelectedCategory(null); }} />
    </div>
  );
}
