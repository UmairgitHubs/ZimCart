"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Send,
  User,
  AlertCircle,
  Clock,
  Tag,
  CheckCircle2,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SupportTicket, type TicketStatus } from "@/types/support";
import { uiStatusToApi } from "@/lib/support-ticket-mapper";
import type { ApiTicketStatus } from "@/lib/support-thread";

interface TicketSlideOutProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (ticketId: string, reply: string) => Promise<void>;
  onStatusChange: (ticketId: string, status: ApiTicketStatus) => Promise<void>;
  isSubmitting?: boolean;
}

export function TicketSlideOut({
  ticket,
  isOpen,
  onClose,
  onReply,
  onStatusChange,
  isSubmitting = false,
}: TicketSlideOutProps) {
  const [replyText, setReplyText] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setReplyText("");
    setLocalError(null);
  }, [ticket?.id]);

  if (!isOpen || !ticket) return null;

  const busy = pending || isSubmitting;

  const handleSend = async () => {
    const text = replyText.trim();
    if (!text) return;
    setLocalError(null);
    setPending(true);
    try {
      await onReply(ticket.id, text);
      setReplyText("");
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to send reply");
    } finally {
      setPending(false);
    }
  };

  const handleStatus = async (next: TicketStatus) => {
    setLocalError(null);
    setPending(true);
    try {
      await onStatusChange(ticket.id, uiStatusToApi(next));
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={busy ? undefined : onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-400 border border-slate-100 max-h-[90vh]">
        <div className="flex items-center justify-between p-6 md:px-8 md:py-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-wider flex items-center gap-1.5",
                  ticket.status === "Closed"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : ticket.status === "Open"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : ticket.status === "In Progress"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                )}
              >
                {ticket.status === "Closed" && <CheckCircle2 className="w-3 h-3" />}
                {ticket.status}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{ticket.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-snug truncate pr-4">
              {ticket.subject}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Set status</span>
              <select
                disabled={busy}
                value={ticket.status}
                onChange={(e) => handleStatus(e.target.value as TicketStatus)}
                className="text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-slate-100 transition-all shadow-sm active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:px-8 md:py-6 border-b border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
          <div className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-slate-50/30">
            <h4 className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <User className="w-3 h-3" /> Customer
            </h4>
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-slate-800">{ticket.customerName}</p>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{ticket.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{ticket.customerPhone || "—"}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-100 rounded-2xl p-4 shadow-sm bg-slate-50/30">
            <h4 className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <Tag className="w-3 h-3" /> Ticket
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Priority</p>
                <div className="flex items-center gap-1.5">
                  {ticket.priority === "Critical" ? (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  ) : ticket.priority === "High" ? (
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-400" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      ticket.priority === "Critical"
                        ? "text-red-600"
                        : ticket.priority === "High"
                          ? "text-amber-600"
                          : ticket.priority === "Medium"
                            ? "text-blue-600"
                            : "text-slate-500"
                    )}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                <span className="text-[11px] font-bold text-slate-700">{ticket.category}</span>
              </div>
            </div>
          </div>
        </div>

        {localError && (
          <div className="mx-6 md:mx-8 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-700">
            {localError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/30">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.sender === "Customer" ? "items-start self-start" : "items-end self-end ml-auto"
              )}
            >
              <div className={cn("flex items-end gap-2 mb-1", msg.sender === "Agent" ? "flex-row-reverse" : "")}>
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
                  {msg.sender === "Agent" ? (
                    <User className="w-4 h-4 text-slate-500" />
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500">{msg.senderName.charAt(0)}</span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{msg.senderName}</span>
              </div>
              <div
                className={cn(
                  "p-4 rounded-[24px] shadow-sm relative",
                  msg.sender === "Agent"
                    ? "bg-emerald-600 text-white rounded-tr-sm"
                    : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"
                )}
              >
                <p className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span
                className={cn(
                  "text-[9px] font-bold text-slate-400 tracking-wider mt-1.5 uppercase",
                  msg.sender === "Agent" ? "mr-12" : "ml-12"
                )}
              >
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 md:p-6 bg-white border-t border-slate-100">
          <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[28px] p-2 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/30 transition-all">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={busy}
              placeholder="Write a staff reply…"
              className="w-full bg-transparent border-none outline-none resize-none max-h-[120px] min-h-[40px] text-[13px] font-medium text-slate-700 py-3 placeholder:text-slate-400"
              rows={2}
            />
            <button
              type="button"
              disabled={busy || !replyText.trim()}
              onClick={handleSend}
              className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0 disabled:opacity-50"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-3 px-2 uppercase tracking-widest">
            Replies are appended to the ticket for the customer to see in the app.
          </p>
        </div>
      </div>
    </div>
  );
}
