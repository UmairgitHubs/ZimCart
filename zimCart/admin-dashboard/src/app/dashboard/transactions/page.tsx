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
// Import Components
import { TransactionList } from "@/components/dashboard/transactions/TransactionList";
import { TransactionFilters } from "@/components/dashboard/transactions/TransactionFilters";
// Import Models
import { TransactionDetailsModal } from "@/components/dashboard/transactions/TransactionDetailsModal";
import { ReconcileModal } from "@/components/dashboard/transactions/ReconcileModal";
import { EditTransactionModal } from "@/components/dashboard/transactions/EditTransactionModal";
import { DeleteTransactionModal } from "@/components/dashboard/transactions/DeleteTransactionModal";
// Data & Types
import { MOCK_TRANSACTIONS } from "@/constants/transactions";
import { Transaction } from "@/types/transactions";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  // Modal States
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleView = (trx: Transaction) => {
    setSelectedTransaction(trx);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (trx: Transaction) => {
    setSelectedTransaction(trx);
    setIsEditModalOpen(true);
  };

  const handleDelete = (trx: Transaction) => {
    setSelectedTransaction(trx);
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = (updatedTrx: Transaction) => {
    console.log("Transaction Updated:", updatedTrx);
    // Refresh logic here
  };

  const handleDeleteConfirm = (trx: Transaction) => {
    console.log("Transaction Deleted:", trx.id);
    // Refresh logic here
  };

  const handleReconcileConfirm = () => {
    console.log("Ledger Reconciled Successfully");
    // In a real app, refetch data here
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0 text-left">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Financial <span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-8 decoration-4">Ledger</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-4 flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
            <span className="truncate italic">Monitoring real-time liquidity and payment reconciliations.</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white border border-slate-100 rounded-2xl p-1 gap-1 shadow-sm">
            <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-[11px] font-black text-slate-600 transition-all active:scale-95 uppercase tracking-widest">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>CSV Archive</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-100"></div>
            <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-[11px] font-black text-slate-600 transition-all active:scale-95 uppercase tracking-widest">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Full Audit Report</span>
            </button>
          </div>

          <button 
            onClick={() => setIsReconcileModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl text-[11px] font-black transition-all active:scale-95 shadow-xl shadow-slate-200 group uppercase tracking-widest leading-none"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180" />
            <span>Reconcile Ledger</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Settled Portfolio" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Verification Queue" 
          value={`$${pendingAmount.toLocaleString()}`} 
          icon={Clock} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Authorization Rate" 
          value="94.2%" 
          icon={CheckCircle2} 
          color="text-emerald-500" 
          bgColor="bg-emerald-50/30" 
        />
        <StatCard 
          label="Revoked / Refunded" 
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

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px] shadow-sm">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredTransactions.length > 0 ? (
              <TransactionList 
                transactions={filteredTransactions} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Wallet className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Journal Empty</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">Verified financial logs matching your criteria could not be located in the master registry.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-8 px-10 py-4 bg-slate-800 text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all active:scale-95 shadow-2xl shadow-slate-200"
                 >
                   Reset Ledger View
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredTransactions.length > 0 && (
              <div className="px-8 py-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-amber-600" />
                      </div>
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                     Journal contains <span className="text-slate-800 underline decoration-emerald-500/20 underline-offset-4">{filteredTransactions.length}</span> verified entries
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-300 cursor-not-allowed transition-all uppercase tracking-widest">Previous Page</button>
                  <button className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 uppercase tracking-widest">Next Evolution</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <TransactionDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        transaction={selectedTransaction}
      />

      <ReconcileModal 
        isOpen={isReconcileModalOpen}
        onClose={() => setIsReconcileModalOpen(false)}
        onConfirm={handleReconcileConfirm}
      />

      <EditTransactionModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        transaction={selectedTransaction}
      />

      <DeleteTransactionModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        transaction={selectedTransaction}
      />
    </div>
  );
}
