"use client";

import React, { useState, useMemo } from "react";
import { 
  Ticket, 
  Plus, 
  Download, 
  FileText, 
  Zap, 
  Clock, 
  TrendingUp
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PromotionList } from "@/components/dashboard/promotions/PromotionList";
import { PromotionFilters } from "@/components/dashboard/promotions/PromotionFilters";
import { MOCK_PROMOTIONS } from "@/constants/promotions";
import { Promotion } from "@/types/promotions";

// Import Modals
import { PromotionDetailsModal } from "@/components/dashboard/promotions/PromotionDetailsModal";
import { AddPromotionModal } from "@/components/dashboard/promotions/AddPromotionModal";
import { EditPromotionModal } from "@/components/dashboard/promotions/EditPromotionModal";
import { DeletePromotionModal } from "@/components/dashboard/promotions/DeletePromotionModal";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  // Modal States
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const matchesStatus = 
        activeStatus === "All" || 
        promo.status === activeStatus;
      
      const matchesSearch = 
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [promotions, searchTerm, activeStatus]);

  const activePromoCount = promotions.filter(p => p.status === 'Active').length;
  const expiredPromoCount = promotions.filter(p => p.status === 'Expired').length;
  const totalRedemptions = promotions.reduce((acc, curr) => acc + curr.usageCount, 0);

  // Handlers
  const handleView = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setIsEditModalOpen(true);
  };

  const handleDelete = (promo: Promotion) => {
    setSelectedPromotion(promo);
    setIsDeleteModalOpen(true);
  };

  const handleAddConfirm = (newPromo: Promotion) => {
    setPromotions([newPromo, ...promotions]);
  };

  const handleEditConfirm = (updatedPromo: Promotion) => {
    setPromotions(promotions.map(p => p.id === updatedPromo.id ? updatedPromo : p));
  };

  const handleDeleteConfirm = (promoId: string) => {
    setPromotions(promotions.filter(p => p.id !== promoId));
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight underline decoration-emerald-500/30 underline-offset-8">
            Campaign <span className="text-emerald-600">Management</span>
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-3">
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

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[12px] font-black transition-all active:scale-95 shadow-xl shadow-emerald-500/20 group uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create Campaign</span>
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
          value={promotions.filter(p => p.status === 'Scheduled').length} 
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

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px] shadow-sm">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredPromotions.length > 0 ? (
              <PromotionList 
                promotions={filteredPromotions} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500 shadow-inner">
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
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white shadow-sm"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white shadow-sm"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white shadow-sm"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400 uppercase tracking-[1px]">
                     Campaign Manager • <span className="text-slate-800">{filteredPromotions.length}</span> results
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

      {/* Modals */}
      <PromotionDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        promotion={selectedPromotion}
      />

      <AddPromotionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddConfirm}
      />

      <EditPromotionModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleEditConfirm}
        promotion={selectedPromotion}
      />

      <DeletePromotionModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        promotion={selectedPromotion}
      />
    </div>
  );
}
