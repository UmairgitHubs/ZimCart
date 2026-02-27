import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  MoreHorizontal, 
  Clock, 
  Mail,
  Smartphone,
  ChevronRight,
  Printer,
  Pencil,
  Trash2,
  AlertTriangle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onEdit: (order: Order) => void;
  isLoading?: boolean;
}

export function OrderTable({ orders, onViewDetails, onEdit, isLoading }: OrderTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
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

  if (isLoading) {
    // Skeleton loader would go here in a real app
    return <div className="p-8 text-center text-slate-400 font-bold">Loading orders...</div>;
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">Order info</th>
              <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">Customer</th>
              <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">Amount</th>
              <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">Status</th>
              <th className="px-8 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">Payment</th>
              <th className="px-8 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0"
              >
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      #{order.id}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span className="text-[11px] font-bold text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={order.customer.avatar || `https://ui-avatars.com/api/?name=${order.customer.name}&background=10B981&color=fff`} 
                        alt={order.customer.name} 
                        className="w-10 h-10 rounded-2xl object-cover shadow-sm" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-slate-700">{order.customer.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-300" />
                        <span className="text-[11px] font-medium text-slate-400">{order.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-slate-800">${order.totalAmount.toFixed(2)}</span>
                    <span className="text-[11px] font-bold text-slate-400">{order.items.length} Items</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500">{order.paymentMethod}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-tighter",
                      order.paymentStatus === 'Paid' ? "text-emerald-500" : "text-amber-500"
                    )}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2 relative">
                    <button 
                      onClick={() => onViewDetails(order)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 group/view"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <div className="relative dropdown-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === order.id ? null : order.id);
                        }}
                        className={cn(
                          "p-2 rounded-xl transition-all active:scale-95",
                          openMenuId === order.id ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>

                      {openMenuId === order.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 z-50 py-3 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                          <div className="px-4 py-2 border-b border-slate-50 mb-1">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danger zone</p>
                          </div>
                          
                          <button 
                            onClick={() => { onEdit(order); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-blue-500" /> Edit Order
                          </button>
                          
                          <button 
                            onClick={() => { setOrderToDelete(order); setOpenMenuId(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Order
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
        {orders.map((order) => (
          <div 
            key={order.id}
            onClick={() => onViewDetails(order)}
            className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={order.customer.avatar || `https://ui-avatars.com/api/?name=${order.customer.name}`} 
                  className="w-12 h-12 rounded-2xl shadow-sm"
                  alt=""
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">#{order.id}</h4>
                  <p className="text-xs font-bold text-slate-400">{order.customer.name}</p>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                <p className="text-base font-black text-slate-800">${order.totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                <p className="text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setOrderToDelete(null)} />
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Delete Order?</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Are you sure you want to delete order <span className="font-bold text-slate-800">#{orderToDelete.id}</span>? 
              This action cannot be undone and will remove all associated data.
            </p>
            
            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsDeleting(true);
                  setTimeout(() => {
                    setIsDeleting(false);
                    setOrderToDelete(null);
                  }, 1500);
                }}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isDeleting ? <Clock className="w-4 h-4 animate-spin" /> : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
