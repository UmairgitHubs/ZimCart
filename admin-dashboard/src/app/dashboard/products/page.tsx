"use client";

import React, { useState, useMemo, useCallback } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ProductTable } from "@/components/dashboard/products/ProductTable";
import { ProductFilters } from "@/components/dashboard/products/ProductFilters";
import { ProductEmptyState } from "@/components/dashboard/products/ProductEmptyState";
import { AddProductModal } from "@/components/dashboard/products/AddProductModal";
import { ProductDetailsModal } from "@/components/dashboard/products/ProductDetailsModal";
import { BulkUploadModal } from "@/components/dashboard/products/BulkUploadModal";
import { DeleteProductModal } from "@/components/dashboard/products/DeleteProductModal";
import { ProductHeader } from "@/components/dashboard/products/ProductHeader";
import { ProductStats } from "@/components/dashboard/products/ProductStats";
import { Product, ProductStatus } from "@/types/products";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-Driven State (The Senior Way)
  const searchTerm = searchParams.get("q") || "";
  const activeCategory = searchParams.get("category") || "All Categories";
  const activeStatus = searchParams.get("status") || "All";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  // Utility to update URL without page refresh - Wrapped in useCallback with dirty-check guard
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

  // 1. Data Fetching (Tanstack Query)
  const { 
    data: productsResponse, 
    isLoading: isFetching, 
    isError, 
    error: fetchError 
  } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    category: activeCategory === "All Categories" ? undefined : activeCategory,
    status: activeStatus === "All" ? undefined : activeStatus,
    search: searchTerm,
  });

  const products = productsResponse?.data?.products || [];
  const totalProducts = productsResponse?.data?.pagination?.total || 0;
  
  // 2. Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 3. Mutations (Modern Technique: useMutation with status feedback)
  const { mutateAsync: performDelete, isPending: isDeleting } = useDeleteProduct();

  // 4. Handlers - Optimized with useCallback
  const handleSearch = useCallback((q: string) => updateQuery({ q, page: "1" }), [updateQuery]);
  const handleCategoryChange = useCallback((val: string) => updateQuery({ category: val, page: "1" }), [updateQuery]);
  const handleStatusChange = useCallback((val: string) => updateQuery({ status: val, page: "1" }), [updateQuery]);
  const handlePageChange = useCallback((page: number) => updateQuery({ page: String(page) }), [updateQuery]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDeleteTrigger = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await performDelete(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      // Optional: Add toast success here if library exists
    } catch (err) {
      console.error("Purge Protocol Failed:", err);
      // Optional: Add toast error here
    }
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase">Network Disruption</h2>
          <p className="text-slate-500 font-medium">{(fetchError as any)?.message || "Failed to synchronize with the product fleet."}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
        <ProductHeader 
          onAddSingle={() => { setSelectedProduct(null); setIsAddModalOpen(true); }}
          onAddBulk={() => setIsBulkModalOpen(true)}
        />

        <ProductStats 
          totalProducts={totalProducts}
          products={products}
        />

        <section>
          <ProductFilters 
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
            activeStatus={activeStatus}
            setActiveStatus={handleStatusChange}
          />

          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[400px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 blur-[100px] -z-10 rounded-full"></div>
            
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-[400px] gap-4 leading-none">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing catalog</p>
              </div>
            ) : products.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProductTable 
                  products={products} 
                  onEdit={handleEdit}
                  onDelete={handleDeleteTrigger}
                  onView={handleView}
                />
                
                <footer className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm ring-1 ring-slate-900/5"></div>
                     </div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-tight">
                       Showing <span className="text-slate-800 font-black">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-800 font-black">{Math.min(currentPage * itemsPerPage, totalProducts)}</span> of <span className="text-slate-800 font-black">{totalProducts}</span> fleet items
                     </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black shadow-sm transition-all uppercase tracking-widest text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-200 hover:text-emerald-600 active:scale-95"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={products.length < itemsPerPage || (currentPage * itemsPerPage) >= totalProducts}
                      className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black shadow-sm transition-all uppercase tracking-widest text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-200 hover:text-emerald-600 active:scale-95"
                    >
                      Next Page
                    </button>
                  </div>
                </footer>
              </div>
            ) : (
              <ProductEmptyState onClear={() => updateQuery({ q: null, category: null, status: null, page: null })} />
            )}
          </div>
        </section>
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setSelectedProduct(null); }}
        product={selectedProduct}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setSelectedProduct(null); }}
        onEdit={handleEdit}
      />

      <BulkUploadModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />

      <DeleteProductModal 
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedProduct(null); }}
        onConfirm={confirmDelete}
        product={selectedProduct}
        isDeleting={isDeleting}
      />
    </>
  );
}
