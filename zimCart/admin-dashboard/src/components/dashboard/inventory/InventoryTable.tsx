import React from "react";
import Image from "next/image";
import { Eye, Edit2, Warehouse, AlertTriangle, ArrowUpDown, ChevronRight, Box, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryItem } from "@/types/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  onAdjust: (item: InventoryItem) => void;
  onViewHistory: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onAdjust, onViewHistory }: InventoryTableProps) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Product Info</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Stock Levels</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Value</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {item.image ? (
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                           <Box className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{item.productName}</h4>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tight">SKU: {item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     <Warehouse className="w-3.5 h-3.5 text-slate-300" />
                     <p className="text-[12px] font-bold text-slate-500">{item.warehouseLocation}</p>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-2 min-w-[120px]">
                      <div className="flex justify-between items-end">
                        <span className="text-[13px] font-black text-slate-800">
                          {item.availableStock} <span className="text-[10px] text-slate-400">/ {item.currentStock}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">Thr: {item.restockThreshold}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
                         <div 
                           className={cn(
                             "h-full transition-all duration-700",
                             item.availableStock <= item.restockThreshold ? "bg-amber-400" : "bg-emerald-400"
                           )}
                           style={{ width: `${Math.min((item.availableStock / (item.currentStock || 1)) * 100, 100)}%` }}
                         />
                         {item.reservedStock > 0 && (
                           <div 
                             className="h-full bg-blue-300/40 border-l border-white/20"
                             style={{ width: `${(item.reservedStock / (item.currentStock || 1)) * 100}%` }}
                           />
                         )}
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.reservedStock} Reserved</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5",
                     item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                     item.status === 'Low Stock' ? "bg-amber-50 text-amber-600 border-amber-100" :
                     item.status === 'Out of Stock' ? "bg-red-50 text-red-600 border-red-100" :
                     "bg-blue-50 text-blue-600 border-blue-100 px-4"
                   )}>
                     {item.status}
                   </span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800">${item.totalValue.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-slate-400">@ ${item.unitPrice.toFixed(2)} / unit</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onAdjust(item)} 
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 hover:shadow-lg transition-all active:scale-95"
                        title="Adjust Stock"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => onViewHistory(item)}
                         className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all active:scale-95"
                         title="Inventory History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="xl:hidden p-4 space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="group bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.99] transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4 text-left">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" />
                  ) : <Box className="w-6 h-6 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors leading-tight mb-1">{item.productName}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{item.sku}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                      item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600" :
                      item.status === 'Low Stock' ? "bg-amber-50 text-amber-600" :
                      item.status === 'Out of Stock' ? "bg-red-50 text-red-600" :
                      "bg-blue-50 text-blue-600"
                    )}>{item.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-4 border-y border-slate-50 mb-4">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Warehouse className="w-3 h-3" /> Warehouse
                  </p>
                  <p className="text-xs font-black text-slate-600 truncate">{item.warehouseLocation}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Value</p>
                  <p className="text-sm font-black text-slate-800">${item.totalValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center px-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available / Total</p>
                 <p className="text-sm font-black text-slate-800">{item.availableStock} <span className="text-[10px] text-slate-400">PCS</span></p>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-700",
                      item.availableStock <= item.restockThreshold ? "bg-amber-400" : "bg-emerald-400"
                    )}
                    style={{ width: `${Math.min((item.availableStock / (item.currentStock || 1)) * 100, 100)}%` }}
                  />
               </div>
            </div>

            <div className="flex items-center justify-between mt-6">
               <div className="flex items-center gap-2">
                 <button onClick={() => onAdjust(item)} className="px-5 py-2.5 bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all flex items-center gap-2">
                   <Edit2 className="w-3.5 h-3.5" /> Adjust
                 </button>
               </div>
               <button onClick={() => onViewHistory(item)} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-[20px] flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                 <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
