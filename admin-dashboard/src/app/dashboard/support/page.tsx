"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Headset, MessageSquare, AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TicketList } from "@/components/dashboard/support/TicketList";
import { SupportFilters } from "@/components/dashboard/support/SupportFilters";
import { TicketSlideOut } from "@/components/dashboard/support/TicketSlideOut";
import { NewTicketModal } from "@/components/dashboard/support/NewTicketModal";
import { SupportTicket } from "@/types/support";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { useDebounce } from "@/hooks/useDebounce";
import { supportTicketDtoToView, uiStatusToApi } from "@/lib/support-ticket-mapper";
import type { TicketStatus } from "@/types/support";

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [activeStatus, setActiveStatus] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const apiStatus =
    activeStatus === "All"
      ? undefined
      : uiStatusToApi(activeStatus as TicketStatus);

  const {
    tickets: dtoList,
    isLoading,
    error,
    updateTicket,
    createTicketForCustomer,
    isUpdating,
  } = useSupportTickets({
      search: debouncedSearch.trim() || undefined,
      status: apiStatus,
    });

  const tickets = useMemo(() => dtoList.map(supportTicketDtoToView), [dtoList]);

  useEffect(() => {
    if (!selectedTicket) return;
    const fresh = tickets.find((t) => t.id === selectedTicket.id);
    if (fresh && fresh.updatedAt !== selectedTicket.updatedAt) {
      setSelectedTicket(fresh);
    }
  }, [tickets, selectedTicket]);

  const todayIso = startOfTodayIso();
  const openTicketsCount = tickets.filter(
    (t) => t.status === "Open" || t.status === "In Progress"
  ).length;
  const criticalCount = tickets.filter((t) => t.priority === "Critical").length;
  const closedTodayCount = tickets.filter(
    (t) => t.status === "Closed" && t.updatedAt >= todayIso
  ).length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Customer <span className="text-emerald-600">Support</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Inbox backed by <code className="text-xs bg-slate-100 px-1 rounded">GET /help/tickets/admin</code> — reply
            and status updates sync to the database.
          </p>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50/90 px-5 py-4 text-sm text-red-800 font-semibold">
          {(error as Error).message}
        </div>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Active tickets"
          value={openTicketsCount}
          icon={Headset}
          color="text-blue-600"
          bgColor="bg-blue-50/50"
        />
        <StatCard
          label="Critical priority"
          value={criticalCount}
          icon={AlertCircle}
          color="text-red-500"
          bgColor="bg-red-50/30"
        />
        <StatCard
          label="Total in view"
          value={tickets.length}
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-amber-50/50"
        />
        <StatCard
          label="Closed today"
          value={closedTodayCount}
          icon={CheckCircle2}
          color="text-emerald-600"
          bgColor="bg-emerald-50/50"
        />
      </section>

      <section>
        <SupportFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          onNewTicket={() => setIsNewTicketOpen(true)}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/10 blur-[120px] -z-10 rounded-full" />

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading inbox</p>
              </div>
            ) : tickets.length > 0 ? (
              <TicketList tickets={tickets} onView={setSelectedTicket} />
            ) : (
              <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                  <MessageSquare className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Inbox zero</h3>
                <p className="text-slate-400 font-semibold mt-2 max-w-sm mx-auto text-sm">
                  No tickets match your filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveStatus("All");
                  }}
                  className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all"
                >
                  Reset filters
                </button>
              </div>
            )}

            {!isLoading && tickets.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <p className="font-bold text-slate-400 text-[11px] uppercase tracking-widest">
                  Showing <span className="text-slate-800">{tickets.length}</span> tickets
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <TicketSlideOut
        ticket={selectedTicket}
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
        isSubmitting={isUpdating}
        onReply={async (id, text) => {
          await updateTicket({ id, body: { staffReply: text } });
        }}
        onStatusChange={async (id, status) => {
          await updateTicket({ id, body: { status } });
        }}
      />

      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={async (payload) => {
          await createTicketForCustomer(payload);
        }}
      />
    </div>
  );
}
