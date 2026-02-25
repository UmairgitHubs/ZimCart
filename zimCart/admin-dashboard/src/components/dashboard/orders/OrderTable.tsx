import React from 'react';
import { 
  Eye, 
  MoreHorizontal, 
  Clock, 
  Mail,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  isLoading?: boolean;
}

export function OrderTable({ orders, onViewDetails, isLoading }: OrderTableProps) {
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
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewDetails(order)}
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
    </div>
  );
}
