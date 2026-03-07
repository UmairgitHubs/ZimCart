import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Eye, 
  Edit2, 
  MoreHorizontal, 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Trash2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/customers";

interface CustomerListProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerList({ customers, onView, onEdit, onDelete }: CustomerListProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-trigger')) {
           setActiveMenuId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-visible pb-12">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.map((cust) => (
              <tr key={cust.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 relative">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 bg-white relative shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {cust.avatar ? (
                        <Image src={cust.avatar} alt={cust.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                           <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{cust.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tight">ID: {cust.id} • {cust.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-500">
                         <Mail className="w-3.5 h-3.5" />
                         <span className="text-xs font-bold">{cust.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                         <Phone className="w-3.5 h-3.5" />
                         <span className="text-[11px] font-bold">{cust.phone}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5",
                     cust.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                     cust.status === 'Inactive' ? "bg-amber-50 text-amber-600 border-amber-100" :
                     "bg-red-50 text-red-600 border-red-100"
                   )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full",
                        cust.status === 'Active' ? "bg-emerald-500" :
                        cust.status === 'Inactive' ? "bg-amber-500" : "bg-red-500"
                      )}></span>
                      {cust.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-center px-0">
                   <span className="text-sm font-black text-slate-700 bg-slate-100/50 px-3 py-1 rounded-lg">{cust.totalOrders}</span>
                </td>
                <td className="px-6 py-5">
                   <span className="text-sm font-black text-slate-800">${cust.totalSpent.toLocaleString()}</span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        onClick={() => onView(cust)} 
                        className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             setActiveMenuId(activeMenuId === cust.id ? null : cust.id);
                          }}
                          className={cn(
                            "dropdown-trigger p-2 rounded-xl transition-all",
                            activeMenuId === cust.id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === cust.id && (
                          <div 
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-200"
                          >
                            <button 
                              onClick={() => { onEdit(cust); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" /> Edit Profile
                            </button>
                            <div className="my-1 border-t border-slate-50"></div>
                            <button 
                              onClick={() => { onDelete(cust); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Customer
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
        {customers.map((cust) => (
          <div 
            key={cust.id}
            className="group bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden"
          >
            <div className="flex items-center gap-4 text-left">
              <div 
                onClick={() => onView(cust)}
                className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-white relative shrink-0 shadow-sm"
              >
                {cust.avatar ? (
                  <Image src={cust.avatar} alt={cust.name} fill className="object-cover" unoptimized />
                ) : <User className="w-7 h-7 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 onClick={() => onView(cust)} className="text-sm font-black text-slate-800 uppercase tracking-tighter truncate group-hover:text-emerald-600 transition-colors leading-none pr-2">{cust.name}</h4>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-tighter shrink-0",
                    cust.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    cust.status === 'Inactive' ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-red-50 text-red-600 border-red-100"
                  )}>{cust.status}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">{cust.id} • {cust.location}</p>
                
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Spent</span>
                      <span className="text-sm font-black text-slate-800">${cust.totalSpent.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Orders</span>
                      <span className="text-sm font-black text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-100">{cust.totalOrders}</span>
                   </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Joined {new Date(cust.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onView(cust)}
                      className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 active:scale-90 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onEdit(cust)}
                      className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all border border-slate-100"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
