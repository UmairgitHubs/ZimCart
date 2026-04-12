"use client";

import React, { useMemo, useState } from "react";
import {
  Ticket,
  Plus,
  Zap,
  Clock,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PromotionList } from "@/components/dashboard/promotions/PromotionList";
import { PromotionFilters } from "@/components/dashboard/promotions/PromotionFilters";
import { PromotionDetailsModal } from "@/components/dashboard/promotions/PromotionDetailsModal";
import { AddPromotionModal } from "@/components/dashboard/promotions/AddPromotionModal";
import { EditPromotionModal } from "@/components/dashboard/promotions/EditPromotionModal";
import { DeletePromotionModal } from "@/components/dashboard/promotions/DeletePromotionModal";
import { Promotion } from "@/types/promotions";
import { useVouchers } from "@/hooks/useVouchers";
import { useDebounce } from "@/hooks/useDebounce";
import { voucherDtoToPromotion } from "@/lib/promotion-mapper";
import type { CreateVoucherPayload, UpdateVoucherPayload } from "@/types/vouchers";

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [activeStatus, setActiveStatus] = useState("All");

  const { vouchers, isLoading, error, createVoucher, updateVoucher, deleteVoucher } =
    useVouchers(debouncedSearch.trim() || undefined);

  const promotions = useMemo(
    () => vouchers.map(voucherDtoToPromotion),
    [vouchers]
  );

  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const matchesStatus =
        activeStatus === "All" || promo.status === activeStatus;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        promo.name.toLowerCase().includes(q) ||
        promo.code.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [promotions, searchTerm, activeStatus]);

  const activePromoCount = promotions.filter((p) => p.status === "Active").length;
  const expiredPromoCount = promotions.filter((p) => p.status === "Expired").length;
  const totalRedemptions = promotions.reduce((acc, curr) => acc + curr.usageCount, 0);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight underline decoration-emerald-500/30 underline-offset-8">
            Campaign <span className="text-emerald-600">Management</span>
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-3">
            Discount vouchers from the API — percentage or fixed amount, scoped by store for
            managers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[12px] font-black transition-all active:scale-95 shadow-sm shadow-emerald-500/20 group uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Create Campaign</span>
          </button>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Could not load vouchers</p>
            <p className="text-red-700/90 mt-1">{(error as Error).message}</p>
          </div>
        </div>
      )}

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
          label="Inactive (scheduled)"
          value={promotions.filter((p) => p.status === "Scheduled").length}
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

      <section>
        <PromotionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px] shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full" />

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading vouchers</p>
              </div>
            ) : filteredPromotions.length > 0 ? (
              <PromotionList
                promotions={filteredPromotions}
                onView={(promo) => {
                  setSelectedPromotion(promo);
                  setIsDetailsModalOpen(true);
                }}
                onEdit={(promo) => {
                  setSelectedPromotion(promo);
                  setIsEditModalOpen(true);
                }}
                onDelete={(promo) => {
                  setSelectedPromotion(promo);
                  setIsDeleteModalOpen(true);
                }}
              />
            ) : (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Ticket className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                  No promotions found
                </h3>
                <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">
                  Try clearing filters or create a new voucher campaign.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveStatus("All");
                  }}
                  className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Reset filters
                </button>
              </div>
            )}

            {!isLoading && filteredPromotions.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[1px]">
                  <span className="text-slate-800">{filteredPromotions.length}</span> campaigns
                  {debouncedSearch.trim() ? " (server search)" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <PromotionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        promotion={selectedPromotion}
      />

      <AddPromotionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (payload: CreateVoucherPayload) => {
          await createVoucher(payload);
        }}
      />

      <EditPromotionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        promotion={selectedPromotion}
        onSubmit={async (id: string, payload: UpdateVoucherPayload) => {
          await updateVoucher({ id, data: payload });
        }}
      />

      <DeletePromotionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        promotion={selectedPromotion}
        onConfirm={async () => {
          if (!selectedPromotion) return;
          await deleteVoucher(selectedPromotion.id);
        }}
      />
    </div>
  );
}
