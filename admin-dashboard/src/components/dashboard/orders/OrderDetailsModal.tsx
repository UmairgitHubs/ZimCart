import React, { useEffect, useState } from "react";
import { 
  X, Calendar, MapPin, User, Package, CreditCard, Printer, 
  Download, Phone, Mail, CheckCircle2, Clock, Truck, 
  AlertCircle, FileText, Check, Copy, ExternalLink, MoreHorizontal,
  MailWarning, Map, Flag, Loader2
} from "lucide-react";
import { Order } from "@/types/orders";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { InvoiceService } from "@/lib/invoice";
import { OrderStatus } from "@/types/orders";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus?: (id: string, status: string) => Promise<void>;
  isUpdating?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Out for Delivery': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'Shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Processing': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Confirmed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    case 'Refunded': return 'bg-slate-100 text-slate-800 border-slate-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'text-emerald-700 bg-emerald-50';
    case 'Pending': return 'text-amber-700 bg-amber-50';
    case 'Unpaid': return 'text-red-700 bg-red-50';
    default: return 'text-slate-700 bg-slate-50';
  }
};

export function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus, isUpdating }: OrderDetailsModalProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) setShowActions(false);
    };
    if (showActions) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const timelineSteps = [
    { label: "Order Placed", icon: FileText },
    { label: "Confirmed", icon: CheckCircle2 },
    { label: "Processing", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Out for Delivery", icon: Map },
    { label: "Delivered", icon: MapPin },
  ];

  const getTimelineIndex = () => {
    const statusMap: Record<string, number> = {
      'Pending': 0,
      'Confirmed': 1,
      'Processing': 2,
      'Shipped': 3,
      'Out for Delivery': 4,
      'Delivered': 5,
    };
    return statusMap[order.status] ?? -1;
  };

  const handlePrint = () => {
    InvoiceService.print();
  };

  const handleDownloadInvoice = () => {
    InvoiceService.generatePDF(order);
  };
  
  const renderAddress = () => {
    try {
      const parsed = JSON.parse(order.shippingAddress);
      if (parsed.address) {
        return (
          <div className="space-y-2">
             <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{parsed.address}</p>
             {parsed.detail && (
                <p className="text-xs text-slate-500"><span className="font-bold text-slate-700">Unit/Detail:</span> {parsed.detail}</p>
             )}
             {parsed.instructions && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl font-medium border border-amber-200/50 flex gap-2 items-start shadow-sm mt-3">
                   <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                   <p className="leading-relaxed">{parsed.instructions}</p>
                </div>
             )}
          </div>
        );
      }
    } catch {
       // Not JSON, fallback to plain text
    }
    return (
      <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap" title={order.shippingAddress}>
        {order.shippingAddress}
      </p>
    );
  };

  const resolveAddressText = () => {
    try {
      const parsed = JSON.parse(order.shippingAddress);
      if (parsed && typeof parsed === "object" && "address" in parsed && parsed.address) {
        return String(parsed.address);
      }
    } catch {
      // plain string fallback
    }
    return order.shippingAddress;
  };

  const openAddressOnMap = () => {
    const address = resolveAddressText().trim();
    if (!address) return;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const currentIndex = getTimelineIndex();
  const isCancelledOrRefunded = ['Cancelled', 'Refunded'].includes(order.status);

  const NEXT_STATUS_MAP: Partial<Record<OrderStatus, OrderStatus>> = {
    Pending: "Confirmed",
    Confirmed: "Processing",
    Processing: "Shipped",
    Shipped: "Out for Delivery",
    "Out for Delivery": "Delivered",
  };
  const nextStatus = NEXT_STATUS_MAP[order.status as OrderStatus];
  
  // Financial Calculation Protocol
  const finalTotal = order.totalAmount;
  const subtotal = order.subtotal || 0;
  const shippingFlow = order.deliveryFee || 0;
  const taxFlow = order.tax || 0;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 bg-white sticky top-0 z-10 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Order Details
            </h2>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-lg text-sm border border-slate-200 flex items-center gap-2">
                #{order.id}
                <button onClick={handleCopyId} className="text-slate-400 hover:text-emerald-600 transition-colors" title="Copy Order ID">
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>
              <div className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider border w-fit transition-colors duration-500 ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 print:hidden">
            <button 
              onClick={handleDownloadInvoice}
              className="hidden sm:flex items-center gap-2 p-2 px-4 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-sm font-bold group/btn"
            >
              <Download className="w-4 h-4 text-emerald-600 group-hover/btn:scale-110 transition-transform" /> Invoice
            </button>
            <button 
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 p-2 px-4 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-sm font-bold group/btn"
            >
              <Printer className="w-4 h-4 text-blue-600 group-hover/btn:scale-110 transition-transform" /> Print
            </button>
            
            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div id="print-area" className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 bg-slate-50">
          
          {/* Print-only Header */}
          <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-slate-900">ZimCart</h1>
                <p className="text-sm text-slate-500 mt-1">Order Fulfillment Manifest</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">INVOICE #{order.id.substring(0, 8).toUpperCase()}</p>
                <p className="text-sm text-slate-500">Date: {formatDate(new Date().toISOString())}</p>
              </div>
            </div>
          </div>
          
          {isCancelledOrRefunded && (
            <div className="mb-6 p-4 rounded-2xl flex items-start gap-4 border border-red-200 bg-red-50 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 aspect-square rounded-full blur-3xl -mr-10 -mt-10"></div>
               <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 z-10" />
               <div className="z-10">
                 <h4 className="text-sm font-bold text-red-800">Order has been {order.status}</h4>
                 <p className="text-[13px] text-red-600 mt-1 max-w-2xl">This order is no longer active. The customer has been notified via email and any necessary refunds have been processed according to their original payment method.</p>
               </div>
            </div>
          )}

          {/* Horizontal Order Status Timeline */}
          {!isCancelledOrRefunded && (
            <div className="mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> 
                Order Journey
              </h3>
              
              <div className="relative">
                {/* Horizontal Line Background */}
                <div className="absolute top-[24px] left-[40px] right-[40px] h-0.5 bg-slate-100 z-0 rounded-full hidden md:block"></div>
                
                {/* Progress Line */}
                {currentIndex > 0 && (
                  <div 
                    className="absolute top-[24px] left-[40px] h-0.5 bg-emerald-500 z-0 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] hidden md:block"
                    style={{ width: `calc(${(currentIndex / (timelineSteps.length - 1)) * 100}% - 40px)` }}
                  ></div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative z-10 px-0 md:px-2">
                  {timelineSteps.map((step, idx) => {
                    const isCompleted = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 text-center group">
                        {/* Icon Wrapper */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 border-4 border-white shadow-sm ${
                          isCurrent ? 'ring-8 ring-emerald-50 bg-emerald-500 text-white scale-110' : 
                          isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-50 border-2 border-slate-200/60 text-slate-300'
                        }`}>
                           <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} strokeWidth={2.5} />
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-left md:text-center pt-1 md:pt-0">
                          <p className={`text-[13px] font-black uppercase tracking-tight transition-colors duration-500 ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                            {step.label}
                          </p>
                          <p className={`text-[11px] font-bold mt-0.5 tracking-tight ${isCompleted ? 'text-emerald-600' : 'text-slate-300'}`}>
                            {idx === 0 ? formatDate(order.createdAt) : 
                             (isCompleted && idx === currentIndex && order.updatedAt !== order.createdAt) ? 
                              formatDate(order.updatedAt) : 
                              (isCompleted ? "Updated" : "Scheduled")}
                          </p>
                          
                          {isCurrent && (
                            <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 inline-block md:mx-auto animate-in fade-in zoom-in-95 duration-500">
                               Current Status
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Action Bubble (Shows for Current Status) */}
              <div key={`bubble-${currentIndex}`} className="mt-8 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                 <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-emerald-900">
                      {currentIndex === 0 && "Great! We've received the order. Our team is now reviewing the details to confirm availability."}
                      {currentIndex === 1 && "Payment confirmed. Order is now authorized and ready for processing."}
                      {currentIndex === 2 && "Items are being picked and packed with care in our warehouse."}
                      {currentIndex === 3 && "Order has been picked up by our logistics partner and is on its way."}
                      {currentIndex === 4 && "Rider is out for delivery and approaching the customer location."}
                      {currentIndex === 5 && "Success! The package was delivered and signed for. Thank you for shopping with us!"}
                    </p>
                    <p className="text-[12px] text-emerald-600/80 font-medium mt-1 uppercase tracking-wider">
                      Internal Update: {formatDate(order.updatedAt)}
                    </p>
                 </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Info Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 aspect-square rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-100"></div>
                  <div className="flex items-start gap-4 z-10 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 uppercase font-black text-emerald-700 text-lg relative overflow-hidden">
                      {order.customer.avatar ? (
                        <Image src={order.customer.avatar} alt={order.customer.name} fill className="rounded-full object-cover" />
                      ) : (
                        order.customer.name.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Customer</p>
                      <h4 className="text-base font-bold text-slate-800 truncate leading-tight">{order.customer.name}</h4>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-2.5 z-10 pt-4 border-t border-slate-50">
                    <a href={`mailto:${order.customer.email}`} className="flex items-center gap-3 text-[13px] text-slate-600 hover:text-emerald-600 transition-colors">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{order.customer.email || "No email provided"}</span>
                    </a>
                    <a href={`tel:${order.customer.phone}`} className="flex items-center gap-3 text-[13px] text-slate-600 hover:text-emerald-600 transition-colors">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{order.customer.phone || "No phone provided"}</span>
                    </a>
                  </div>
                </div>

                {/* Delivery Info Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 aspect-square rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-100"></div>
                  <div className="flex items-start gap-4 z-10 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Shipping Address</p>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                        Home Delivery
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto z-10 pt-4 border-t border-slate-50">
                    {renderAddress()}
                    <button
                      type="button"
                      onClick={openAddressOnMap}
                      className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    >
                       <ExternalLink className="w-3.5 h-3.5" /> View on Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-white/50">
                  <div className="flex items-center gap-2.5">
                    <Package className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Order Items</h3>
                  </div>
                  <span className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Items
                  </span>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:bg-slate-50/50 transition-colors">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden relative">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col mb-1 sm:mb-2">
                           <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">SKU: {item.id.substring(0,8).toUpperCase()}</span>
                           <h4 className="text-base font-bold text-slate-800 leading-tight">{item.name}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5 text-sm">
                             <span className="font-semibold text-emerald-600">Rs {item.price.toLocaleString()}</span>
                             <span className="text-slate-400 text-xs font-medium">each</span>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 hidden sm:block"></div>
                          <div className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:hidden">Total</p>
                        <p className="text-lg font-black text-slate-800">
                          Rs {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              
              {/* Payment Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden sticky top-20">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> 
                  Payment Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Payment Method</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-5 border-t border-slate-100 border-dashed">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Subtotal ({order.items.length} items)</span>
                    <span className="font-bold text-slate-700">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Shipping Estimate</span>
                    <span className="font-bold text-slate-700">{shippingFlow === 0 ? 'Free' : `Rs ${shippingFlow.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-500">Tax (5%)</span>
                    <span className="font-bold text-slate-700">Rs {taxFlow.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 mt-2 flex justify-between items-end border-t border-slate-100">
                    <div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
                      <span className="text-2xl font-black text-emerald-600">Rs {finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {!isCancelledOrRefunded && nextStatus && (
                    <button 
                      onClick={async () => {
                         if (onUpdateStatus && nextStatus) {
                            await onUpdateStatus(order.id, nextStatus);
                         }
                      }}
                       disabled={isUpdating}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center"
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : `Mark as ${nextStatus}`}
                    </button>
                  )}
                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <button 
                      onClick={async () => {
                        if (onUpdateStatus) {
                           await onUpdateStatus(order.id, "Cancelled");
                        }
                      }}
                      disabled={isUpdating}
                      className="w-full py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all flex items-center justify-center"
                    >
                      {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Global Print Optimized Styling */}
        <style jsx global>{`
          @media print {
            @page {
              margin: 20mm;
              size: auto;
            }
            body {
              background: white !important;
              color: black !important;
            }
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: fixed;
              left: 40px;
              right: 40px;
              top: 0;
              width: calc(100% - 80px);
              padding: 0;
              margin: 0;
              background: white !important;
              border: none !important;
              box-shadow: none !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .custom-scrollbar {
              overflow: visible !important;
              max-height: none !important;
            }
            .divide-y > * + * {
               border-top-width: 1px !important;
               border-color: #e2e8f0 !important;
            }
            /* Reset colors for black & white printing if preferred, 
               but keep modern slate/emerald accents for color printers */
            h1, h2, h3, h4, h5, h6 {
              color: #0f172a !important;
            }
            .text-emerald-600 {
              color: #059669 !important;
            }
            .bg-slate-50 {
              background-color: transparent !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
