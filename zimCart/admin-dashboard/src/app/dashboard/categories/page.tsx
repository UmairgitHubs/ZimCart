"use client";

import React, { useState, useMemo } from "react";
import { Plus, Download, FileText, Tags, CheckCircle2, AlertCircle, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryList } from "@/components/dashboard/categories/CategoryList";
import { CategoryFilters } from "@/components/dashboard/categories/CategoryFilters";
import { AddCategoryModal } from "@/components/dashboard/categories/AddCategoryModal";
import { CategoryDetailsModal } from "@/components/dashboard/categories/CategoryDetailsModal";
import { DeleteCategoryModal } from "@/components/dashboard/categories/DeleteCategoryModal";
import { MOCK_CATEGORIES } from "@/constants/categories";
import { Category } from "@/types/categories";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [categories, setCategories] = useState(MOCK_CATEGORIES); // Convert to state
  const [isModalOpen, setIsModalOpen] = useState(false); // Visibility state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // Selection state

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesStatus = 
        activeStatus === "All" || 
        cat.status === activeStatus;
      
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeStatus, categories]);

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
      {/* Header Section */}
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
            onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create Category</span>
          </button>
        </div>
      </section>

      {/* Analytics Overview Section */}
      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total" 
          value={categories.length} 
          icon={Tags} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Published" 
          value={categories.filter(c => c.status === 'Published').length} 
          icon={CheckCircle2} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Pending/Draft" 
          value={categories.filter(c => c.status === 'Draft').length} 
          icon={AlertCircle} 
          color="text-amber-600" 
          bgColor="bg-amber-50/50" 
        />
        <StatCard 
          label="Hidden" 
          value={categories.filter(c => c.status === 'Hidden').length} 
          icon={EyeOff} 
          color="text-red-600" 
          bgColor="bg-red-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <CategoryFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 blur-[100px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredCategories.length > 0 ? (
              <CategoryList 
                categories={filteredCategories} 
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
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95"
                 >
                   Clear All Filters
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
              <p className="text-xs font-black text-slate-400">
                Showing <span className="text-slate-700">{filteredCategories.length}</span> of {categories.length} categories
              </p>
              <div className="flex items-center gap-2">
                <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-400 cursor-not-allowed transition-all">Previous</button>
                <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95">Next</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddCategoryModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />

      <CategoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onEdit={handleEdit}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={(cat) => {
          setCategories(prev => prev.filter(c => c.id !== cat.id));
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
      />
    </div>
  );
}
