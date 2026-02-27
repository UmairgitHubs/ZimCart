import React, { useState, useEffect } from "react";
import { Eye, MoreHorizontal, Box, ArrowUpDown, ChevronRight, ShoppingCart, Pencil, Trash2, AlertTriangle, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Product } from "@/types/products";
import { ProductStatusBadge } from "./ProductStatusBadge";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete, onView }: ProductTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30">
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider pl-8">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors">
                  Product Info
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600 transition-colors">
                  Price
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Inventory</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right pr-8">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr 
                key={product.id} 
                className="group hover:bg-slate-50/50 transition-all duration-200 border-b last:border-0 border-slate-50"
              >
                <td className="px-6 py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50 relative group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      {product.images?.[0] ? (
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Box className="w-6 h-6 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                      
                      {/* Discount/Deal Badge */}
                      {(product.discountPercentage && product.discountPercentage > 0) && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-md shadow-lg z-10 animate-pulse">
                          -{product.discountPercentage}%
                        </div>
                      )}
                      {product.isDeal && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-black rounded-md shadow-lg z-10">
                          DEAL
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[13px] font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">{product.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">ID: {product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[11px] font-black text-slate-500 bg-slate-100/80 px-2.5 py-1.5 rounded-lg whitespace-nowrap inline-block tracking-wider">
                    {product.sku}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[12px] font-bold text-slate-500 bg-emerald-50/30 px-2 py-1 rounded-lg border border-emerald-100/20">{product.category}</span>
                </td>
                <td className="px-6 py-5">
                   {/* Price logic */}
                   <div className="flex flex-col text-left">
                    <span className="font-extrabold text-slate-800 text-[14px] leading-none">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-[10px] font-bold text-slate-400 line-through mt-1">${product.compareAtPrice.toFixed(2)}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-left">
                  <div className="flex flex-col gap-2">
                    <span className={cn(
                      "text-[12px] font-black tracking-tight",
                      product.inventory === 0 ? "text-red-500" :
                      product.inventory <= 10 ? "text-amber-500" : "text-slate-700"
                    )}>
                      {product.inventory} <span className="text-[10px] text-slate-400 font-bold">PCS</span>
                    </span>
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          product.inventory === 0 ? "bg-red-400 w-0" :
                          product.inventory <= 10 ? "bg-amber-400 w-1/3" : "bg-emerald-400 w-full"
                        )}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <ProductStatusBadge status={product.status} />
                </td>
                <td className="px-6 py-5 text-right pr-8">
                  <div className="flex items-center justify-end gap-2 relative">
                    <button 
                      onClick={() => onView(product)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 group/view"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <div className="relative dropdown-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === product.id ? null : product.id);
                        }}
                        className={cn(
                          "p-2 rounded-xl transition-all active:scale-95",
                          openMenuId === product.id ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {openMenuId === product.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 z-50 py-3 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                          
                          
                          <button 
                            onClick={() => { onEdit(product); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-blue-500" /> Edit Product
                          </button>
                          
                          <button 
                            onClick={() => { setProductToDelete(product); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" /> Delete Product
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-4">
        {products.map((product) => (
          <div 
            key={product.id}
            onClick={() => onView(product)}
            className="group bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 blur-2xl -z-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative shrink-0">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt="" fill className="object-cover" />
                  ) : <Box className="w-6 h-6 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                  
                  {/* Discount/Deal Badge */}
                  {(product.discountPercentage && product.discountPercentage > 0) && (
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-md shadow-lg z-10 animate-pulse">
                      -{product.discountPercentage}%
                    </div>
                  )}
                  {product.isDeal && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-black rounded-md shadow-lg z-10">
                      DEAL
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{product.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 mt-1">ID: {product.id}</p>
                </div>
              </div>
              <ProductStatusBadge status={product.status} />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Pricing</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-black text-slate-800">${product.price.toFixed(2)}</p>
                  {product.compareAtPrice && <p className="text-xs font-bold text-slate-300 line-through">${product.compareAtPrice.toFixed(2)}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Available Stock</p>
                <div className="flex items-center gap-2 justify-end">
                   <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", product.inventory <= 10 ? "bg-amber-400 w-1/3" : "bg-emerald-400 w-full")}></div>
                   </div>
                   <p className="text-sm font-black text-slate-700">{product.inventory} <span className="text-[10px] text-slate-400">PCS</span></p>
                </div>
              </div>
              <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setProductToDelete(null)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Delete Product?</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-800">{productToDelete.name}</span>? 
              This action cannot be undone and will remove the product from your catalog forever.
            </p>
            
            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsDeleting(true);
                  // Simulate delete for now, then call onDelete
                  setTimeout(() => {
                    onDelete(productToDelete);
                    setIsDeleting(false);
                    setProductToDelete(null);
                  }, 1500);
                }}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Archive className="w-4 h-4 animate-pulse" /> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
