import React, { useState } from "react";
import { X, User, Tag, AlertCircle, FileText, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketCategory, TicketPriority } from "@/types/support";

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CATEGORIES: TicketCategory[] = ['Order Issue', 'Payment', 'Delivery', 'Account', 'Technical'];
const PRIORITIES: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export function NewTicketModal({ isOpen, onClose, onSubmit }: NewTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    subject: "",
    category: "Order Issue" as TicketCategory,
    priority: "Medium" as TicketPriority,
    message: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-50 relative bg-slate-50/50">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
               Open New Ticket
            </h2>
            <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">Create a manual support request</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-100 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <form id="new-ticket-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Customer Identity
               </label>
               <input
                 type="text"
                 required
                 placeholder="Enter Customer ID, Email, or Phone Number"
                 value={formData.customerId}
                 onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                 className="w-full bg-slate-50/50 border-2 border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/40 transition-all"
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Ticket Subject
               </label>
               <input
                 type="text"
                 required
                 placeholder="Brief summary of the issue..."
                 value={formData.subject}
                 onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                 className="w-full bg-slate-50/50 border-2 border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/40 transition-all"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                     <Tag className="w-3.5 h-3.5" /> Category
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                      className="w-full bg-slate-50/50 border-2 border-slate-200/60 rounded-2xl px-5 py-3.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/40 transition-all appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                     <AlertCircle className="w-3.5 h-3.5" /> Priority
                  </label>
                  <div className="relative">
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                      className={cn(
                        "w-full bg-slate-50/50 border-2 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-8 transition-all appearance-none cursor-pointer",
                        formData.priority === 'Critical' ? "border-red-200/60 text-red-700 bg-red-50/50 focus:ring-red-500/5 focus:border-red-500/40 focus:bg-white" :
                        formData.priority === 'High' ? "border-amber-200/60 text-amber-700 bg-amber-50/50 focus:ring-amber-500/5 focus:border-amber-500/40 focus:bg-white" :
                        formData.priority === 'Medium' ? "border-blue-200/60 text-blue-700 bg-blue-50/50 focus:ring-blue-500/5 focus:border-blue-500/40 focus:bg-white" :
                        "border-slate-200/60 text-slate-700 focus:ring-emerald-500/5 focus:border-emerald-500/40 focus:bg-white"
                      )}
                    >
                      {PRIORITIES.map(pri => <option key={pri} value={pri}>{pri}</option>)}
                    </select>
                    <ChevronDown className={cn(
                      "absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
                      formData.priority === 'Critical' ? "text-red-400" :
                      formData.priority === 'High' ? "text-amber-400" :
                      formData.priority === 'Medium' ? "text-blue-400" : "text-slate-400"
                    )} />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  Initial Message
               </label>
               <textarea
                 required
                 placeholder="Provide detailed context for the assigned agent..."
                 value={formData.message}
                 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                 className="w-full bg-slate-50/50 border-2 border-slate-200/60 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/40 transition-all resize-none min-h-[120px]"
               />
            </div>
            
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-end gap-3 mt-auto">
           <button 
             type="button"
             onClick={onClose}
             className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm uppercase tracking-widest"
           >
             Cancel
           </button>
           <button 
             type="submit"
             form="new-ticket-form"
             disabled={isSubmitting}
             className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20 uppercase tracking-widest disabled:opacity-70 disabled:pointer-events-none"
           >
             {isSubmitting ? (
               <Loader2 className="w-4 h-4 animate-spin" />
             ) : (
               <>
                 <Send className="w-4 h-4" />
                 <span>Create Ticket</span>
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}

// Chevron component helper since it was inside the other file
const ChevronDown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
