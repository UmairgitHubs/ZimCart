import React from "react";
import { 
  X, 
  Send, 
  Paperclip, 
  User, 
  ShieldAlert, 
  AlertCircle, 
  Clock, 
  Tag,
  CheckCircle2,
  Phone,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportTicket } from "@/types/support";

interface TicketSlideOutProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketSlideOut({ ticket, isOpen, onClose }: TicketSlideOutProps) {
  if (!isOpen || !ticket) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-2 right-2 w-full max-w-[600px] bg-white rounded-[40px] shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-50 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest flex items-center gap-1.5",
                ticket.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                ticket.status === 'Open' ? "bg-amber-50 text-amber-600 border-amber-100" :
                ticket.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" :
                "bg-slate-50 text-slate-500 border-slate-200"
              )}>
                {ticket.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                {ticket.status}
              </span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{ticket.id}</span>
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight max-w-[80%]">{ticket.subject}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-100 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Ticket Meta Data */}
        <div className="p-6 md:p-8 border-b border-slate-50 grid grid-cols-2 gap-6 bg-white">
          <div className="col-span-2 xl:col-span-1 border border-slate-100 rounded-[24px] p-5 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <User className="w-3.5 h-3.5" /> Customer Info
            </h4>
            <div className="space-y-3">
              <p className="text-[14px] font-black text-slate-800">{ticket.customerName}</p>
              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                 <Mail className="w-3.5 h-3.5 text-slate-400" />
                 <span className="truncate">{ticket.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                 <Phone className="w-3.5 h-3.5 text-slate-400" />
                 <span>+263 77 000 0000</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 xl:col-span-1 border border-slate-100 rounded-[24px] p-5 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
               <Tag className="w-3.5 h-3.5" /> Ticket Details
            </h4>
            <div className="space-y-4">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                  <div className="flex items-center gap-1.5">
                     {ticket.priority === 'Critical' ? <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> :
                      ticket.priority === 'High' ? <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> :
                      <Clock className="w-3.5 h-3.5 text-slate-400" />}
                     <span className={cn(
                        "text-[12px] font-black uppercase tracking-widest",
                        ticket.priority === 'Critical' ? "text-red-600" :
                        ticket.priority === 'High' ? "text-amber-600" :
                        ticket.priority === 'Medium' ? "text-blue-600" :
                        "text-slate-500"
                     )}>{ticket.priority}</span>
                  </div>
               </div>
               
               {ticket.orderId && (
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Related Order</p>
                    <span className="text-[13px] font-extrabold text-blue-600 underline decoration-blue-200 underline-offset-4 cursor-pointer hover:text-blue-700 transition-colors">{ticket.orderId}</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/30">
          {ticket.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.sender === 'Customer' ? "items-start self-start" : 
                msg.isInternal ? "items-center mx-auto max-w-full" :
                "items-end self-end ml-auto"
              )}
            >
              {msg.isInternal ? (
                 <div className="flex items-center justify-center gap-2 my-4">
                    <div className="w-8 h-[1px] bg-slate-200"></div>
                    <div className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 tracking-widest uppercase flex items-center gap-2">
                       <AlertCircle className="w-3 h-3 text-emerald-500" />
                       {msg.content}
                    </div>
                    <div className="w-8 h-[1px] bg-slate-200"></div>
                 </div>
              ) : (
                <>
                  <div className={cn(
                    "flex items-end gap-2 mb-1",
                    msg.sender === 'Agent' ? "flex-row-reverse" : ""
                  )}>
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                      {msg.sender === 'Agent' ? <User className="w-4 h-4 text-slate-500" /> : <span className="text-[11px] font-black text-slate-500">{msg.senderName.charAt(0)}</span>}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{msg.senderName}</span>
                  </div>
                  <div className={cn(
                    "p-4 rounded-[24px] shadow-sm relative",
                    msg.sender === 'Agent' 
                      ? "bg-emerald-600 text-white rounded-tr-sm" 
                      : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                  )}>
                    <p className="text-[13px] font-medium leading-relaxed">{msg.content}</p>
                  </div>
                  <span className={cn(
                    "text-[9px] font-black text-slate-400 tracking-widest mt-1.5 uppercase",
                    msg.sender === 'Agent' ? "mr-12" : "ml-12"
                  )}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Reply Editor */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100">
          <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[28px] p-2 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/30 transition-all">
             <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shrink-0">
                <Paperclip className="w-4 h-4" />
             </button>
             <textarea 
               placeholder="Write your reply..."
               className="w-full bg-transparent border-none outline-none resize-none max-h-[120px] min-h-[40px] text-[13px] font-medium text-slate-700 py-3 placeholder:text-slate-400 placeholder:font-bold"
               rows={1}
             />
             <button className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0">
                <Send className="w-5 h-5 ml-1" />
             </button>
          </div>
          <div className="flex items-center justify-between mt-4 px-4">
             <div className="flex items-center gap-3">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Use Template</button>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">Add Internal Note</button>
             </div>
             <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Press Cmd+Enter to send</p>
          </div>
        </div>
      </div>
    </>
  );
}
