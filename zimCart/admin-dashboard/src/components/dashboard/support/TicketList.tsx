import React from "react";
import { 
  Eye, 
  MoreHorizontal, 
  ChevronRight, 
  User, 
  Clock, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  Tag,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportTicket } from "@/types/support";

interface TicketListProps {
  tickets: SupportTicket[];
  onView: (ticket: SupportTicket) => void;
}

export function TicketList({ tickets, onView }: TicketListProps) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden xl:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Customer / Ticket</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Assigned</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0 cursor-pointer" onClick={() => onView(ticket)}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-black text-slate-500 uppercase">{ticket.customerName.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold text-slate-800 leading-tight truncate max-w-[150px]">{ticket.customerName}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest leading-none">{ticket.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1.5 min-w-[300px] max-w-[400px]">
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black tracking-widest text-slate-500 uppercase">
                            <Tag className="w-3 h-3" />
                            <span>{ticket.category}</span>
                         </div>
                         {ticket.orderId && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{ticket.orderId}</span>
                         )}
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 truncate">{ticket.subject}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      {ticket.priority === 'Critical' ? <ShieldAlert className="w-4 h-4 text-red-500" /> :
                       ticket.priority === 'High' ? <AlertCircle className="w-4 h-4 text-amber-500" /> :
                       <Clock className="w-4 h-4 text-slate-400" />}
                      <span className={cn(
                         "text-[11px] font-black uppercase tracking-widest",
                         ticket.priority === 'Critical' ? "text-red-600" :
                         ticket.priority === 'High' ? "text-amber-600" :
                         ticket.priority === 'Medium' ? "text-blue-600" :
                         "text-slate-500"
                      )}>{ticket.priority}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                         <User className="w-3.5 h-3.5 text-indigo-500" />
                      </div>
                      <span className="text-[12px] font-black text-slate-600">{ticket.assignedAgent || 'Unassigned'}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={cn(
                     "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5",
                     ticket.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                     ticket.status === 'Open' ? "bg-amber-50 text-amber-600 border-amber-100" :
                     ticket.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" :
                     "bg-slate-50 text-slate-500 border-slate-200"
                   )}>
                     {ticket.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                     {ticket.status}
                   </span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 text-[11px] font-black">
                         <MessageSquare className="w-3.5 h-3.5" />
                         <span>{ticket.messages.length}</span>
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="xl:hidden p-4 space-y-4">
        {tickets.map((ticket) => (
          <div 
            key={ticket.id}
            onClick={() => onView(ticket)}
            className="group bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.99] transition-all relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-black text-slate-500 uppercase">{ticket.customerName.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-slate-800 leading-tight mb-0.5 truncate max-w-[150px]">{ticket.customerName}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ticket.id}</span>
                  </div>
               </div>
               <span className={cn(
                  "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest flex shrink-0 items-center justify-center",
                  ticket.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  ticket.status === 'Open' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  ticket.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-slate-50 text-slate-500 border-slate-200"
               )}>{ticket.status}</span>
            </div>

            <div className="py-3 border-y border-slate-50 mb-3">
               <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black tracking-widest text-slate-500 uppercase">
                     {ticket.category}
                  </span>
                  <div className="flex items-center gap-1">
                     {ticket.priority === 'Critical' ? <ShieldAlert className="w-3 h-3 text-red-500" /> :
                      ticket.priority === 'High' ? <AlertCircle className="w-3 h-3 text-amber-500" /> :
                      <Clock className="w-3 h-3 text-slate-400" />}
                     <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        ticket.priority === 'Critical' ? "text-red-600" :
                        ticket.priority === 'High' ? "text-amber-600" :
                        ticket.priority === 'Medium' ? "text-blue-600" :
                        "text-slate-500"
                     )}>{ticket.priority}</span>
                  </div>
               </div>
               <p className="text-[13px] font-bold text-slate-700 line-clamp-2">{ticket.subject}</p>
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span className="text-[11px] font-black text-slate-600">{ticket.assignedAgent || 'Unassigned'}</span>
               </div>
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-400 text-[10px] font-black">
                  <MessageSquare className="w-3 h-3" />
                  <span>{ticket.messages.length}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
