import React from "react";
import { 
  Eye, 
  MoreHorizontal, 
  ChevronRight, 
  CreditCard, 
  Smartphone, 
  ArrowUpRight, 
  ArrowDownLeft,
  XCircle,
  Clock,
  CheckCircle2,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/transactions";

interface TransactionListProps {
  transactions: Transaction[];
  onView: (trx: Transaction) => void ;
}

export function TransactionList({ transactions, onView }: TransactionListProps) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Transaction & Ref</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Customer / Order</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((trx) => (
              <tr key={trx.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                      trx.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                      trx.status === 'Failed' ? "bg-red-50 border-red-100 text-red-600" :
                      "bg-blue-50 border-blue-100 text-blue-600"
                    )}>
                      {trx.status === 'Completed' ? <ArrowUpRight className="w-5 h-5" /> : 
                       trx.status === 'Failed' ? <XCircle className="w-5 h-5" /> : 
                       <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-slate-800 leading-tight uppercase tracking-tight">{trx.id}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest leading-none">{trx.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-black text-slate-700">{trx.customerName}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{trx.orderId}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-slate-800">
                    {trx.currency} {trx.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                         {trx.paymentMethod.includes('EcoCash') || trx.paymentMethod.includes('InnBucks') ? 
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" /> : 
                          <CreditCard className="w-3.5 h-3.5 text-slate-500" />}
                      </div>
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{trx.paymentMethod}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5",
                     trx.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                     trx.status === 'Pending' ? "bg-blue-50 text-blue-600 border-blue-100" :
                     trx.status === 'Failed' ? "bg-red-50 text-red-600 border-red-100" :
                     "bg-amber-50 text-amber-600 border-amber-100"
                   )}>
                     {trx.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onView(trx)} className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-100 shadow-sm transition-all active:scale-95">
                        <Receipt className="w-4 h-4" />
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

      {/* Mobile Card View */}
      <div className="xl:hidden p-4 space-y-4">
        {transactions.map((trx) => (
          <div 
            key={trx.id}
            className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.99] transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm",
                    trx.status === 'Completed' ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    trx.status === 'Failed' ? "bg-red-50 border-red-100 text-red-600" :
                    "bg-blue-50 border-blue-100 text-blue-600"
                  )}>
                    {trx.status === 'Completed' ? <ArrowUpRight className="w-6 h-6" /> : 
                     trx.status === 'Failed' ? <XCircle className="w-6 h-6" /> : 
                     <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tighter leading-tight mb-0.5">{trx.id}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trx.reference}</span>
                  </div>
               </div>
               <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                  trx.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  trx.status === 'Pending' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  trx.status === 'Failed' ? "bg-red-50 text-red-600 border-red-100" :
                  "bg-amber-50 text-amber-600 border-amber-100"
               )}>{trx.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                  <p className="text-[12px] font-black text-slate-700 truncate">{trx.customerName}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-[14px] font-black text-slate-800">{trx.currency} {trx.amount.toFixed(2)}</p>
               </div>
            </div>

            <div className="flex items-center justify-between mt-6">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                    {trx.paymentMethod.includes('EcoCash') || trx.paymentMethod.includes('InnBucks') ? 
                     <Smartphone className="w-3.5 h-3.5 text-slate-400" /> : 
                     <CreditCard className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{trx.paymentMethod}</span>
               </div>
               <button onClick={() => onView(trx)} className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
