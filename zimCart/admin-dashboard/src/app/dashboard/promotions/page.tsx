"use client";

import React, { useState, useMemo } from "react";
import { 
  Ticket, 
  Plus, 
  Download, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Database,
  TrendingUp,
  Percent
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PromotionList } from "@/components/dashboard/promotions/PromotionList";
import { PromotionFilters } from "@/components/dashboard/promotions/PromotionFilters";
import { MOCK_PROMOTIONS } from "@/constants/promotions";
import { Promotion } from "@/types/promotions";

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filteredPromotions = useMemo(() => {
    return MOCK_PROMOTIONS.filter((promo) => {
      const matchesStatus = 
        activeStatus === "All" || 
        promo.status === activeStatus;
      
      const matchesSearch = 
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeStatus]);

  const activePromoCount = MOCK_PROMOTIONS.filter(p => p.status === 'Active').length;
  const expiredPromoCount = MOCK_PROMOTIONS.filter(p => p.status === 'Expired').length;
  const totalRedemptions = MOCK_PROMOTIONS.reduce((acc, curr) => acc + curr.usageCount, 0);

  const handleView = (promo: Promotion) => console.log("Viewing:", promo.id);
  const handleEdit = (promo: Promotion) => console.log("Editing:", promo.id);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            Campaign <span className="text-emerald-600">Management</span>
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage discount codes, flash sales and seasonal marketing campaigns.
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

          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create Promo</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Live Offers" 
          value={activePromoCount} 
          icon={Zap} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Redemptions" 
          value={totalRedemptions} 
          icon={TrendingUp} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Upcoming" 
          value={MOCK_PROMOTIONS.filter(p => p.status === 'Scheduled').length} 
          icon={Clock} 
          color="text-amber-600" 
          bgColor="bg-amber-50/50" 
        />
        <StatCard 
          label="Expired" 
          value={expiredPromoCount} 
          icon={Ticket} 
          color="text-slate-400" 
          bgColor="bg-slate-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <PromotionFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredPromotions.length > 0 ? (
              <PromotionList 
                promotions={filteredPromotions} 
                onView={handleView}
                onEdit={handleEdit}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Ticket className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No promotions found</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">Try clear your search or status filters to see more results.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset Search View
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredPromotions.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Active Campaign Manager • <span className="text-slate-800">{filteredPromotions.length}</span> results
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
