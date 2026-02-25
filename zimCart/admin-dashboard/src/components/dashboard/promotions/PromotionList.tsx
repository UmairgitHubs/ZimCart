import React from "react";
import { 
  Eye, 
  MoreHorizontal, 
  ChevronRight, 
  Ticket, 
  Calendar, 
  Users, 
  Zap, 
  Clock,
  TrendingUp,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Promotion } from "@/types/promotions";

interface PromotionListProps {
  promotions: Promotion[];
  onView: (promo: Promotion) => void;
  onEdit: (promo: Promotion) => void;
}

export function PromotionList({ promotions, onView, onEdit }: PromotionListProps) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Campaign & Code</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Discount Details</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {promotions.map((promo) => (
              <tr key={promo.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-slate-800 leading-tight uppercase tracking-tight">{promo.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-white bg-slate-800 px-2 py-0.5 rounded-md tracking-widest">{promo.code}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-black text-slate-800">
                      {promo.type === 'Percentage' ? `${promo.value}% Off` : 
                       promo.type === 'Fixed Amount' ? `$${promo.value} Off` : 'Free Shipping'}
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                       Min. Purchase: ${promo.minPurchase || 0}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        <span>{new Date(promo.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span>{new Date(promo.endDate).toLocaleDateString()}</span>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="space-y-2 max-w-[120px]">
                      <div className="flex justify-between items-end">
                         <span className="text-[11px] font-black text-slate-700">{promo.usageCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : 'Redeems'}</span>
                         {promo.usageLimit && (
                           <span className="text-[9px] font-bold text-slate-400">{Math.round((promo.usageCount / promo.usageLimit) * 100)}%</span>
                         )}
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                           style={{ width: `${promo.usageLimit ? (promo.usageCount / promo.usageLimit) * 100 : 100}%` }}
                         />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5",
                     promo.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                     promo.status === 'Scheduled' ? "bg-blue-50 text-blue-600 border-blue-100" :
                     promo.status === 'Expired' ? "bg-amber-50 text-amber-600 border-amber-100" :
                     "bg-red-50 text-red-600 border-red-100"
                   )}>
                     {promo.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onView(promo)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 transition-all active:scale-95">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all">
                        <MoreHorizontal className="w-4 h-4" />
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
        {promotions.map((promo) => (
          <div 
            key={promo.id}
            className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.99] transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Ticket className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-black text-slate-800 uppercase tracking-tighter leading-tight mb-1">{promo.name}</h4>
                    <span className="text-[10px] font-black text-white bg-slate-800 px-2 py-0.5 rounded-md tracking-[2px]">{promo.code}</span>
                  </div>
               </div>
               <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                  promo.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  promo.status === 'Scheduled' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  promo.status === 'Expired' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  "bg-red-50 text-red-600 border-red-100"
               )}>{promo.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount</p>
                  <p className="text-sm font-black text-slate-800">
                     {promo.type === 'Percentage' ? `${promo.value}% OFF` : 
                      promo.type === 'Fixed Amount' ? `$${promo.value} OFF` : 'FREE SHIP'}
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Usage</p>
                  <p className="text-sm font-black text-slate-800">{promo.usageCount} Times</p>
               </div>
            </div>

            <div className="flex items-center justify-between mt-6">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-500">Expires {new Date(promo.endDate).toLocaleDateString()}</span>
               </div>
               <button onClick={() => onView(promo)} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
