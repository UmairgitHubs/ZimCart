"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { ProductTable } from "@/components/dashboard/products/ProductTable";
import { ProductFilters } from "@/components/dashboard/products/ProductFilters";
import { ProductEmptyState } from "@/components/dashboard/products/ProductEmptyState";
import { AddProductModal } from "@/components/dashboard/products/AddProductModal";
import { ProductDetailsModal } from "@/components/dashboard/products/ProductDetailsModal";
import { BulkUploadModal } from "@/components/dashboard/products/BulkUploadModal";
import { ProductHeader } from "@/components/dashboard/products/ProductHeader";
import { ProductStats } from "@/components/dashboard/products/ProductStats";
import { Product, ProductStatus } from "@/types/products";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { RootState } from "@/lib/store";
import { 
  setSearchTerm, 
  setCategory, 
  setStatus, 
  clearFilters, 
  setPage 
} from "@/lib/features/products/productsSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.products);
  
  // 1. Data Fetching (Tanstack Query)
  const { 
    data: productsResponse, 
    isLoading: isFetching, 
    isError, 
    error: fetchError 
  } = useProducts({
    page: filters.page,
    limit: filters.limit,
    category: filters.category === "All Categories" ? undefined : filters.category,
    status: filters.status === "All" ? undefined : filters.status,
    search: filters.searchTerm,
  });

  const products = productsResponse?.data?.products || [];
  const totalProducts = productsResponse?.data?.pagination?.total || 0;
  
  // 2. Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 3. Mutations
  const { mutate: deleteProduct } = useDeleteProduct();

  // 4. Handlers
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProduct(product.id);
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
          <h2 className="text-xl font-bold text-slate-800">Failed to fetch products</h2>
          <p className="text-slate-500">{(fetchError as any)?.message || "Internal Server Error"}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold">Retry</button>
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
            searchTerm={filters.searchTerm}
            setSearchTerm={(val) => dispatch(setSearchTerm(val))}
            activeCategory={filters.category}
            setActiveCategory={(val) => dispatch(setCategory(val))}
            activeStatus={filters.status}
            setActiveStatus={(val) => dispatch(setStatus(val as ProductStatus | 'All'))}
          />

          <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[400px]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/20 blur-[100px] -z-10 rounded-full"></div>
            
            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Catalog...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProductTable 
                  products={products} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
                
                <footer className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
                  <p className="text-xs font-black text-slate-400">
                    Showing <span className="text-slate-700">{products.length}</span> of {totalProducts} products
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => dispatch(setPage(Math.max(1, filters.page - 1)))}
                      disabled={filters.page === 1}
                      className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-200 transition-all active:scale-95"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => dispatch(setPage(filters.page + 1))}
                      disabled={products.length < filters.limit}
                      className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-200 transition-all active:scale-95"
                    >
                      Next
                    </button>
                  </div>
                </footer>
              </div>
            ) : (
              <ProductEmptyState onClear={() => dispatch(clearFilters())} />
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
    </>
  );
}
