"use client";

import React, { useState, useMemo } from "react";
import { Plus, Download, FileText, Package, AlertTriangle, CheckCircle2, Archive, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductTable } from "@/components/dashboard/products/ProductTable";
import { ProductFilters } from "@/components/dashboard/products/ProductFilters";
import { ProductEmptyState } from "@/components/dashboard/products/ProductEmptyState";
import { AddProductModal } from "@/components/dashboard/products/AddProductModal";
import { ProductDetailsModal } from "@/components/dashboard/products/ProductDetailsModal";
import { Product } from "@/types/products";

export default function ProductsPage() {
  const { items: products } = useSelector((state: RootState) => state.products);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeStatus, setActiveStatus] = useState("All");

  // Export states
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Optimized filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      const matchesCategory = 
        activeCategory === "All Categories" || 
        product.category === activeCategory;
      
      if (!matchesCategory) return false;

      // 2. Status Filter
      const matchesStatus = 
        activeStatus === "All" || 
        product.status === activeStatus;
      
      if (!matchesStatus) return false;

      // 3. Search Filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [products, searchTerm, activeCategory, activeStatus]);

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

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsAddModalOpen(true);
  };
  const handleDelete = (product: Product) => console.log("Delete:", product.id);
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All Categories");
    setActiveStatus("All");
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Add Product</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total" 
          value={products.length} 
          icon={Package} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Low Stock" 
          value={products.filter(p => p.status === 'Low Stock').length} 
          icon={AlertTriangle} 
          color="text-amber-600" 
          bgColor="bg-amber-50/50" 
        />
        <StatCard 
          label="Out of Stock" 
          value={products.filter(p => p.status === 'Out of Stock').length} 
          icon={Archive} 
          color="text-red-600" 
          bgColor="bg-red-50/50" 
        />
        <StatCard 
          label="In Store" 
          value={products.filter(p => p.status === 'In Stock').length} 
          icon={CheckCircle2} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <ProductFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[400px]">
          {/* Subtle Decorative Background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 blur-[100px] -z-10 rounded-full"></div>
          
          {filteredProducts.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ProductTable 
                products={filteredProducts} 
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
              
              {/* Pagination Placeholder */}
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
                <p className="text-xs font-black text-slate-400">
                  Showing <span className="text-slate-700">{filteredProducts.length}</span> of {products.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-400 cursor-not-allowed transition-all">Previous</button>
                  <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95">Next</button>
                </div>
              </div>
            </div>
          ) : (
            <ProductEmptyState onClear={clearFilters} />
          )}
        </div>
      </section>

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProduct(null);
        }}
        onEdit={handleEdit}
      />
    </div>
  );
}
