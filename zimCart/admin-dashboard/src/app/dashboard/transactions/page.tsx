"use client";

import React, { useState, useMemo } from "react";
import { 
  CreditCard, 
  Download, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Database,
  Search,
  RefreshCw,
  Wallet,
  ArrowUpRight
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionList } from "@/components/dashboard/transactions/TransactionList";
import { TransactionFilters } from "@/components/dashboard/transactions/TransactionFilters";
import { MOCK_TRANSACTIONS } from "@/constants/transactions";
import { Transaction } from "@/types/transactions";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((trx) => {
      const matchesStatus = 
        activeStatus === "All" || 
        trx.status === activeStatus;
      
      const matchesSearch = 
        trx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeStatus]);

  const totalRevenue = MOCK_TRANSACTIONS
    .filter(t => t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingAmount = MOCK_TRANSACTIONS
    .filter(t => t.status === 'Pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleView = (trx: Transaction) => console.log("Viewing Transaction:", trx.id);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Financial <span className="text-emerald-600">Ledger</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
            <span className="truncate">Monitor real-time cash flow, payment reconciliations, and payout status.</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white border border-slate-100 rounded-xl p-1 gap-1">
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[12px] font-bold text-slate-600 transition-all active:scale-95">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-100"></div>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[12px] font-bold text-slate-600 transition-all active:scale-95">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDF</span>
            </button>
          </div>

          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-slate-200 group">
            <RefreshCw className="w-4 h-4 transition-transform group-active:rotate-180" />
            <span>Reconcile</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Settled (USD)" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="In Transit" 
          value={`$${pendingAmount.toLocaleString()}`} 
          icon={Clock} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Success Rate" 
          value="94.2%" 
          icon={CheckCircle2} 
          color="text-emerald-500" 
          bgColor="bg-emerald-50/30" 
        />
        <StatCard 
          label="Refunded" 
          value={`$${MOCK_TRANSACTIONS.filter(t => t.status === 'Refunded').reduce((a,c)=>a+c.amount,0).toLocaleString()}`} 
          icon={ArrowUpRight} 
          color="text-amber-600" 
          bgColor="bg-amber-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <TransactionFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredTransactions.length > 0 ? (
              <TransactionList 
                transactions={filteredTransactions} 
                onView={handleView}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Wallet className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No transactions found</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">We couldn't find any financial records matching your filters. Try a different search term or status.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset Ledger View
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredTransactions.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Ledger contains <span className="text-slate-800">{filteredTransactions.length}</span> verified entries
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-400 cursor-not-allowed transition-all uppercase tracking-widest">Previous</button>
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 uppercase tracking-widest">Next Page</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
