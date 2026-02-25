import { Eye, MoreHorizontal, Box, ArrowUpDown, ChevronRight, ShoppingCart } from "lucide-react";
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
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30">
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">
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
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map((product) => (
              <tr 
                key={product.id} 
                className="group hover:bg-slate-50/50 transition-all duration-200 border-b last:border-0 border-slate-50"
              >
                <td className="px-6 py-5">
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
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onView(product)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
    </div>
  );
}
