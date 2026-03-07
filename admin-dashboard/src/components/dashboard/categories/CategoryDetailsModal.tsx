"use client";

import React, { useEffect } from "react";
import { 
  X, Tag, Layers, Hash, Box, 
  Calendar, Globe, Edit3, Trash2, 
  Star, ExternalLink, Image as ImageIcon
} from "lucide-react";
import Image from "next/image";
import { Category } from "@/types/categories";
import { cn } from "@/lib/utils";

interface CategoryDetailsModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (cat: Category) => void;
}

export function CategoryDetailsModal({ category, isOpen, onClose, onEdit }: CategoryDetailsModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Layers className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Category Information</h2>
              <p className="text-[11px] font-medium text-slate-400">Viewing details for {category.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Top Section: Image and Basic Stats */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-48 h-48 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden shrink-0 shadow-inner">
               {category.image ? (
                 <Image src={category.image} alt={category.name} fill className="object-cover" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                   <ImageIcon className="w-10 h-10" />
                 </div>
               )}
            </div>
            
            <div className="flex-1 space-y-4 pt-2">
               <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{category.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      category.status === 'Published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      "bg-amber-50 text-amber-600 border-amber-100"
                    )}>
                      {category.status}
                    </span>
                    {category.isFeatured && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Box className="w-3 h-3" /> Products
                     </p>
                     <p className="text-sm font-bold text-slate-700">{category.productCount} Items</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Hash className="w-3 h-3" /> Display Order
                     </p>
                     <p className="text-sm font-bold text-slate-700">Position #{category.displayOrder}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6 pt-6 border-t border-slate-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Slug</p>
                  <p className="text-sm font-medium text-blue-600 font-mono italic">/{category.slug}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parent Category</p>
                  <p className="text-sm font-bold text-slate-700">{category.parentCategory || "Master Category"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Refreshed At</p>
                  <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    {new Date(category.lastUpdated).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
               
             </div>

             <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic font-medium">
                  "{category.description}"
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-800 rounded-xl transition-colors"
           >
             Close
           </button>
          
        </div>

      </div>
    </div>
  );
}
