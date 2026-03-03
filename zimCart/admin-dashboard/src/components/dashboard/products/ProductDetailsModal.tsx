import React, { useState, useEffect } from "react";
import { 
  X, Package, Tag, DollarSign, Layers, Calendar, 
  TrendingUp, BarChart3, Zap, Box, Info, 
  History, ShieldCheck, ExternalLink, Clock,
  Edit3, Trash2, Search, Barcode, Globe, Truck,
  PieChart, Activity, AlertCircle, Share2, 
  MapPin, User, ChevronRight, CheckCircle2,
  QrCode, FileText, Download, Printer, Save,
  ShoppingCart, ArrowUpRight, Scale, Sparkles
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { Product } from "@/types/products";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { cn } from "@/lib/utils";
import { useProduct } from "@/hooks/useProducts";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: Product) => void;
}

export function ProductDetailsModal({ product, isOpen, onClose, onEdit }: ProductDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch full product details including history
  const { data: productResponse, isLoading } = useProduct(product?.id || "");
  const fullProduct = productResponse?.data || product;

  // Reset state when product changes or modal opens
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const images = fullProduct.images.length > 0 ? fullProduct.images : ["/placeholder-product.png"];


  return (
    <div className="fixed inset-0 z-[155] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-400 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 md:py-6 border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
               <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ProductStatusBadge status={fullProduct.status} />
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{fullProduct.id}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none">{fullProduct.name}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-slate-100 transition-all  active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Top Section: Gallery & Quick Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Product Gallery */}
               <div className="lg:col-span-5 space-y-4">
                  <div className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 group shadow-inner">
                    <Image 
                      src={images[activeImageIndex]} 
                      alt={fullProduct.name} 
                      fill 
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                    />
                    {fullProduct.isDeal && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                        <Zap className="w-3 h-3 fill-current" />
                        Hot Deal
                      </div>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                      {images.map((url: string, idx: number) => (
                        <button 
                          key={idx} 
                          onClick={() => setActiveImageIndex(idx)}
                          className={cn(
                            "relative w-16 h-16 rounded-xl border-2 transition-all shrink-0 overflow-hidden bg-slate-50 shadow-sm",
                            activeImageIndex === idx ? "border-emerald-500 ring-4 ring-emerald-50" : "border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <Image src={url} alt="" fill className="object-cover p-1" />
                        </button>
                      ))}
                    </div>
                  )}
               </div>

               {/* Quick Strategic Data */}
               <div className="lg:col-span-7 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                           <DollarSign className="w-3 h-3" /> Price Point
                        </p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-bold text-slate-900">${fullProduct.price.toFixed(2)}</span>
                           {fullProduct.compareAtPrice && (
                             <span className="text-[13px] font-medium text-slate-400 line-through">${fullProduct.compareAtPrice.toFixed(2)}</span>
                           )}
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                           <Layers className="w-3 h-3" /> Availability
                        </p>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "text-2xl font-bold",
                             fullProduct.inventory < 10 ? "text-amber-500" : "text-emerald-600"
                           )}>{fullProduct.inventory}</span>
                           <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Units In Site</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-5 border border-slate-100 rounded-2xl space-y-4">
                     <div className="grid grid-cols-2 gap-y-4">
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Category</p>
                           <p className="text-[13px] font-semibold text-slate-700">
                              {typeof fullProduct.category === 'object' ? fullProduct.category.name : (fullProduct.category || "General")}
                           </p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sub-Category</p>
                           <p className="text-[13px] font-semibold text-slate-700">{fullProduct.subCategory || "General"}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">SKU identifier</p>
                           <p className="text-[13px] font-bold text-slate-800 font-mono tracking-tight">{fullProduct.sku}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Barcode Asset</p>
                           <p className="text-[13px] font-semibold text-slate-700">{fullProduct.barcode || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weight / Scale</p>
                           <p className="text-[13px] font-semibold text-slate-700">{fullProduct.weight || "0.50 KG"}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-5 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                           <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Market Performance</h4>
                     </div>
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-[20px] font-bold text-emerald-700">{fullProduct.sales}</p>
                           <p className="text-[9px] font-semibold text-emerald-600/70 uppercase">Total Redemptions</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[20px] font-bold text-emerald-700">${(fullProduct.price * fullProduct.sales).toLocaleString()}</p>
                           <p className="text-[9px] font-semibold text-emerald-600/70 uppercase">Estimated Revenue</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Description & Attributes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
               <div className="lg:col-span-8 space-y-6">
                  <div>
                     <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5" /> Strategic description
                     </h4>
                     <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[24px]">
                        <p className="text-[14px] font-medium text-slate-600 leading-relaxed italic">
                           {fullProduct.description || "No strategic overview established for this product protocol."}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-6">
                  <div>
                     <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Integrity Check
                     </h4>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-[12px] font-semibold text-slate-600">Active Listing</span>
                           </div>
                           <ArrowUpRight className="w-3 h-3 text-slate-300" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-[12px] font-semibold text-slate-600">SEO Optimized</span>
                           </div>
                           <Sparkles className="w-3 h-3 text-amber-400" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-[12px] font-semibold text-slate-600">Global Fleet</span>
                           </div>
                           <Globe className="w-3 h-3 text-blue-400 shadow-xl" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Timeline / Stock Logs */}
            <div className="pt-4">
               <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Lifecycle Protocol
               </h4>
               <div className="relative space-y-6 pl-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[7px] top-2 bottom-6 w-[2px] bg-slate-100" />
                  
                  {fullProduct.history && fullProduct.history.length > 0 ? (
                    fullProduct.history.map((log: any, i: number) => (
                      <div key={log.id || i} className="relative">
                         <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                         <div className="flex items-center justify-between mb-1">
                            <h5 className="text-[13px] font-bold text-slate-800">{log.event}</h5>
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                               {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </span>
                         </div>
                         <p className="text-[12px] font-medium text-slate-500">{log.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="relative">
                       <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
                       <div className="flex items-center justify-between mb-1">
                          <h5 className="text-[13px] font-bold text-slate-400 italic">No history recorded yet</h5>
                       </div>
                       <p className="text-[12px] font-medium text-slate-300">Detailed lifecycle logs will appear as the product is modified.</p>
                    </div>
                  )}
               </div>
            </div>

            {/* QR Section */}
            <div className="pt-8 border-t border-slate-50 flex flex-col items-center justify-center space-y-4">
               <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[32px] group hover:bg-white transition-all shadow-sm">
                  <QRCodeSVG 
                    value={fullProduct.sku} 
                    size={120} 
                    level="H"
                    includeMargin={false}
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                  />
               </div>
               <div className="text-center">
                  <p className="text-[12px] font-bold text-slate-800 uppercase tracking-[0.4em]">{fullProduct.sku}</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase mt-1">Product Digital Signature</p>
               </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 md:px-8 md:py-6 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-end gap-3 mt-auto">
           <button 
             onClick={onClose}
             className="w-full sm:w-auto px-6 py-3 bg-emerald-600 border border-slate-200 rounded-2xl text-[11px] font-bold text-white hover:bg-emerald-800 transition-all active:scale-95 shadow-sm uppercase tracking-widest"
           >
             Close 
           </button>
        </div>

      </div>
    </div>
  );
}
