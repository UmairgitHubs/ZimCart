"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import { riderAdminApi, type RiderPayoutAdmin } from "@/services/riderAdmin.service";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["All", "PENDING", "APPROVED", "PAID", "REJECTED"] as const;

function statusBadge(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-blue-100 text-blue-800",
    PAID: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-slate-100 text-slate-700";
}

export default function RiderPayoutsPage() {
  const [status, setStatus] = useState<string>("PENDING");
  const queryClient = useQueryClient();

  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ["riders", "payouts", status],
    queryFn: () => riderAdminApi.listPayouts(status),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status: next, adminNotes }: { id: string; status: string; adminNotes?: string }) =>
      riderAdminApi.updatePayout(id, { status: next, adminNotes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["riders", "payouts"] }),
  });

  const handleAction = (p: RiderPayoutAdmin, next: string) => {
    const note =
      next === "REJECTED"
        ? window.prompt("Rejection reason (optional):") ?? undefined
        : undefined;
    updateMutation.mutate({ id: p.id, status: next, adminNotes: note });
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/riders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600 mb-3"
        >
          <ArrowLeft className="w-4 h-4" /> Back to riders
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-emerald-600" />
          Rider payouts
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Approve and mark EcoCash / OneMoney / bank transfers as paid.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors",
              status === s
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        </div>
      ) : payouts.length === 0 ? (
        <p className="text-slate-500 text-center py-16 bg-white rounded-2xl border border-slate-100">
          No payout requests in this filter.
        </p>
      ) : (
        <div className="space-y-3">
          {payouts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-slate-900">Rs {p.amount.toLocaleString()}</span>
                  <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-md", statusBadge(p.status))}>
                    {p.status}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{p.method}</span>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-1">{p.rider.name}</p>
                <p className="text-xs text-slate-500">{p.accountRef}{p.accountName ? ` · ${p.accountName}` : ""}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Requested {new Date(p.requestedAt).toLocaleString()}
                </p>
                {p.notes && <p className="text-xs text-slate-600 mt-2">Rider note: {p.notes}</p>}
              </div>
              {p.status === "PENDING" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => handleAction(p, "APPROVED")}
                    className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => handleAction(p, "PAID")}
                    className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Mark paid
                  </button>
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => handleAction(p, "REJECTED")}
                    className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
              {p.status === "APPROVED" && (
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() => handleAction(p, "PAID")}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  Mark paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
