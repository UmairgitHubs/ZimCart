"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bike,
  MapPin,
  Map,
  CreditCard,
  Download,
  FileText,
  UserPlus,
  Database,
  AlertTriangle,
  Clock,
  Loader2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";
import { RiderList } from "@/components/dashboard/riders/RiderList";
import { RiderFilters } from "@/components/dashboard/riders/RiderFilters";
import { RiderDetailsModal } from "@/components/dashboard/riders/RiderDetailsModal";
import { EditRiderModal } from "@/components/dashboard/riders/EditRiderModal";
import { DeleteRiderModal } from "@/components/dashboard/riders/DeleteRiderModal";
import { AddRiderModal } from "@/components/dashboard/riders/AddRiderModal";
import type { NewRiderPayload } from "@/components/dashboard/riders/AddRiderModal";
import { Rider } from "@/types/riders";
import { RootState } from "@/lib/store";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useRiders, useUpdateRider, useDeleteRider } from "@/hooks/useRiders";
import { riderAdminApi } from "@/services/riderAdmin.service";

export default function RidersPage() {
  const queryClient = useQueryClient();
  const user = useSelector((s: RootState) => s.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data, isLoading, error, refetch, isFetching } = useRiders({
    page: 1,
    limit: 100,
    search: debouncedSearch.trim() || undefined,
    status: activeStatus,
  });

  const updateRider = useUpdateRider();
  const deleteRider = useDeleteRider();

  const riders = data?.riders ?? [];
  const stats = data?.stats;

  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [csvSuccess, setCsvSuccess] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExportCSV = () => {
    setIsExportingCSV(true);
    const rows = [
      ["id", "name", "email", "phone", "status", "vehicle", "plate", "hub", "deliveries", "rating", "lastActive"],
      ...riders.map((r) => [
        r.id,
        r.name,
        r.email,
        r.phone,
        r.status,
        r.vehicleType,
        r.licensePlate,
        r.assignedHub,
        String(r.totalDeliveries),
        String(r.rating),
        r.lastActive,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExportingCSV(false);
    setCsvSuccess(true);
    window.setTimeout(() => setCsvSuccess(false), 2000);
  };

  const handleExportPDF = () => {
    setIsExportingPDF(true);
    window.setTimeout(() => {
      setIsExportingPDF(false);
      setPdfSuccess(true);
      window.setTimeout(() => setPdfSuccess(false), 2000);
    }, 800);
  };

  const handleView = (rider: Rider) => {
    setSelectedRider(rider);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (rider: Rider) => {
    setSelectedRider(rider);
    setIsEditModalOpen(true);
  };

  const handleDelete = (rider: Rider) => {
    setSelectedRider(rider);
    setIsDeleteModalOpen(true);
  };

  const onAddRider = async (payload: NewRiderPayload) => {
    await riderAdminApi.create(payload);
    await queryClient.invalidateQueries({ queryKey: ["riders"] });
  };

  const onUpdateRider = async (updated: Rider) => {
    await updateRider.mutateAsync({
      id: updated.id,
      payload: {
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        idNumber: updated.idNumber,
        vehicleType: updated.vehicleType,
        licensePlate: updated.licensePlate,
        assignedHub: updated.assignedHub,
        status: updated.status,
        totalDeliveries: updated.totalDeliveries,
        rating: updated.rating,
      },
    });
  };

  const onDeleteRider = async (rider: Rider) => {
    await deleteRider.mutateAsync(rider.id);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Fleet <span className="text-emerald-600">Logistics</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Rider accounts are <code className="text-xs bg-slate-100 px-1 rounded">User.role = RIDER</code> with a linked{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">RiderProfile</code>. List &amp; stats from{" "}
            <code className="text-xs bg-slate-100 px-1 rounded">GET /riders</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Link
            href="/dashboard/riders/fleet-map"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold hover:border-cyan-300 hover:text-cyan-700 transition-all"
          >
            <Map className="w-4 h-4" />
            Live map
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard/riders/payouts"
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold hover:border-emerald-300 hover:text-emerald-700 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Payouts
            </Link>
          )}
          <div className="relative group/export hidden sm:block">
            <button
              type="button"
              onClick={() => setShowExportOptions(!showExportOptions)}
              className={cn(
                "flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/30 whitespace-nowrap",
                showExportOptions && "border-emerald-200 bg-emerald-50/30 ring-4 ring-emerald-500/5 text-emerald-700"
              )}
            >
              <Download className={cn("w-4 h-4 text-emerald-600 transition-transform", showExportOptions && "scale-110")} />
              <span>Export Report</span>
              <ChevronDown
                className={cn("w-3.5 h-3.5 ml-0.5 text-slate-400 transition-transform duration-300", showExportOptions && "rotate-180 text-emerald-500")}
              />
            </button>

            {showExportOptions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportOptions(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-50 py-1 px-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        handleExportCSV();
                        setShowExportOptions(false);
                      }}
                      disabled={isExportingCSV || csvSuccess || riders.length === 0}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[12px] font-bold transition-all group/item",
                        csvSuccess ? "bg-emerald-50 text-emerald-700" : isExportingCSV ? "text-slate-400 cursor-not-allowed bg-slate-50" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700 active:scale-95"
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                        {isExportingCSV ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        ) : csvSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Download className="w-4 h-4 text-emerald-600 group-hover/item:scale-110 transition-transform" />
                        )}
                      </div>
                      <span className="tracking-tight uppercase">CSV Report</span>
                    </button>

                    <div className="h-[1px] w-full bg-slate-50 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        handleExportPDF();
                        setShowExportOptions(false);
                      }}
                      disabled={isExportingPDF || pdfSuccess}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-[12px] font-bold transition-all group/item",
                        pdfSuccess ? "bg-emerald-50 text-emerald-700" : isExportingPDF ? "text-slate-400 cursor-not-allowed bg-slate-50" : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700 active:scale-95"
                      )}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                        {isExportingPDF ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        ) : pdfSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-emerald-600 group-hover/item:scale-110 transition-transform" />
                        )}
                      </div>
                      <span className="tracking-tight uppercase">PDF Report</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
            >
              <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Onboard Rider</span>
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Total Fleet"
          value={stats ? String(stats.totalFleet) : isLoading ? "—" : String(riders.length)}
          icon={Bike}
          color="text-emerald-600"
          bgColor="bg-emerald-50/50"
        />
        <StatCard
          label="Available Now"
          value={stats ? String(stats.availableNow) : "—"}
          icon={Clock}
          color="text-emerald-500"
          bgColor="bg-emerald-50/30"
        />
        <StatCard
          label="On Delivery"
          value={stats ? String(stats.onDelivery) : "—"}
          icon={MapPin}
          color="text-blue-600"
          bgColor="bg-blue-50/50"
        />
        <StatCard
          label="Action Needed"
          value={stats ? String(stats.banned) : "—"}
          icon={AlertTriangle}
          color="text-red-500"
          bgColor="bg-red-50/50"
        />
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{(error as Error).message}</span>
        </div>
      )}

      <section>
        <RiderFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full" />

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {isLoading && !data ? (
              <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="text-sm font-semibold">Loading riders…</span>
              </div>
            ) : riders.length > 0 ? (
              <RiderList
                riders={riders}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canMutate={isAdmin}
              />
            ) : (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                  <Database className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No riders found</h3>
                <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">
                  {isAdmin ? "Onboard a rider or adjust filters." : "No riders match these filters."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveStatus("All");
                    void refetch();
                  }}
                  className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Reset filters
                </button>
              </div>
            )}

            {riders.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <p className="text-xs font-black text-slate-400">
                  Showing <span className="text-slate-800">{riders.length}</span> rider{riders.length === 1 ? "" : "s"}
                  {isFetching ? " · refreshing…" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <RiderDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} rider={selectedRider} />

      <EditRiderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rider={selectedRider}
        onConfirm={onUpdateRider}
      />

      <DeleteRiderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        rider={selectedRider}
        onConfirm={onDeleteRider}
      />

      {isAdmin && (
        <AddRiderModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={onAddRider}
        />
      )}
    </div>
  );
}
