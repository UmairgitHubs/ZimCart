"use client";

import React, { useState, useMemo } from "react";
import { 
  Headset, 
  Download, 
  FileText, 
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TicketList } from "@/components/dashboard/support/TicketList";
import { SupportFilters } from "@/components/dashboard/support/SupportFilters";
import { TicketSlideOut } from "@/components/dashboard/support/TicketSlideOut";
import { NewTicketModal } from "@/components/dashboard/support/NewTicketModal";
import { MOCK_TICKETS } from "@/constants/support";
import { SupportTicket } from "@/types/support";

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const handleCreateTicket = (data: any) => {
    console.log("New ticket created:", data);
  };
  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter((ticket) => {
      const matchesStatus = 
        activeStatus === "All" || 
        ticket.status === activeStatus;
      
      const matchesSearch = 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.orderId && ticket.orderId.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeStatus]);

  const openTicketsCount = MOCK_TICKETS.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const criticalCount = MOCK_TICKETS.filter(t => t.priority === 'Critical').length;
  const resolvedCount = MOCK_TICKETS.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Customer <span className="text-emerald-600">Support</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage support tickets, rider escalations, and customer inquiries.
          </p>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Active Tickets" 
          value={openTicketsCount} 
          icon={Headset} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Critical Priority" 
          value={criticalCount} 
          icon={AlertCircle} 
          color="text-red-500" 
          bgColor="bg-red-50/30" 
        />
        <StatCard 
          label="Avg. Response" 
          value="14m" 
          icon={Clock} 
          color="text-amber-600" 
          bgColor="bg-amber-50/50" 
        />
        <StatCard 
          label="Resolved Today" 
          value={resolvedCount} 
          icon={CheckCircle2} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <SupportFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          onNewTicket={() => setIsNewTicketOpen(true)}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredTickets.length > 0 ? (
              <TicketList 
                tickets={filteredTickets} 
                onView={setSelectedTicket}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <MessageSquare className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Inbox Zero Achieved</h3>
                 <p className="text-slate-400 font-semibold mt-2 max-w-sm mx-auto text-sm">No tickets match your filters. Great job keeping the queue clean!</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset filters
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredTickets.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                   </div>
                   <p className="font-bold text-slate-400 text-[11px] uppercase tracking-widest">
                     Viewing <span className="text-slate-800 underline decoration-emerald-500/20 underline-offset-4">{filteredTickets.length}</span> requests
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-300 cursor-not-allowed transition-all uppercase tracking-widest">Previous</button>
                  <button className="flex-1 sm:flex-none px-8 py-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 uppercase tracking-widest">Next Page</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ticket Reply Slide-Out Component */}
      <TicketSlideOut 
        ticket={selectedTicket}
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
      />

      {/* New Ticket Modal */}
      <NewTicketModal 
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
}
