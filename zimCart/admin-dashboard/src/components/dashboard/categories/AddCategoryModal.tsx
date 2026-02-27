"use client";

import React, { useEffect, useState } from "react";
import { 
  X, Tag, Plus, Trash2, Layout, List, 
  Info, ImagePlus, ImageIcon, Settings, 
  Sparkles, CheckCircle2, Loader2, Link,
  Eye, Archive, Star, Hash
} from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormData } from "@/lib/validations/category";
import { Category } from "@/types/categories";
import { MOCK_CATEGORIES } from "@/constants/categories";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function AddCategoryModal({ isOpen, onClose, category }: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: "Draft",
      displayOrder: 0,
      isFeatured: false,
      parentCategoryId: "",
      image: "",
    }
  });

  const imageWatch = watch("image");
  const isFeaturedWatch = watch("isFeatured");
  const nameWatch = watch("name");

  // Load category data when editing
  useEffect(() => {
    if (category && isOpen) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        status: category.status,
        parentCategoryId: category.parentCategoryId || "",
        displayOrder: category.displayOrder,
        isFeatured: category.isFeatured,
      });
    } else if (!isOpen) {
      const timer = setTimeout(() => {
        reset({
          name: "",
          slug: "",
          description: "",
          status: "Draft",
          displayOrder: 0,
          isFeatured: false,
        });
        setIsSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [category, isOpen, reset]);

  // Auto-generate slug from name
  useEffect(() => {
    if (nameWatch && !category) {
      const generatedSlug = nameWatch
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameWatch, setValue, category]);

  const onSubmitForm = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    console.log("Submitting category:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue("image", url, { shouldValidate: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isSubmitting && !isSuccess && onClose()}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
               <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {category ? "Edit Category" : "Create Category"}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {category ? "Update your taxonomy and navigation flow." : "Establish new product group or classification."}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isSuccess}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar bg-[#fcfdfe]">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Success!</h3>
               <p className="text-slate-500 font-medium mt-2 max-w-sm">
                 The category has been {category ? "updated" : "created"} successfully and synced with your storefront.
               </p>
            </div>
          ) : (
            <form id="category-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-8 pb-4">
              
              {/* Identity & Slug */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Identity Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Category Name *</label>
                    <input 
                      {...register("name")}
                      placeholder="e.g. Smart Electronics" 
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.name ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1 font-bold">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Public Slug *</label>
                    <div className="relative">
                      <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        {...register("slug")}
                        placeholder="smart-electronics" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${errors.slug ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all`}
                      />
                    </div>
                    {errors.slug && <p className="text-[11px] text-red-500 mt-1 font-bold">{errors.slug.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Description *</label>
                  <textarea 
                    {...register("description")}
                    placeholder="Briefly describe what this category contains..." 
                    rows={3}
                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.description ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none`}
                  />
                  {errors.description && <p className="text-[11px] text-red-500 mt-1 font-bold">{errors.description.message}</p>}
                </div>
              </div>

              {/* Taxonomy & Hierarchy */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Layout className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Hierarchy & Organization</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Parent Category</label>
                    <select 
                      {...register("parentCategoryId")}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white transition-all cursor-pointer appearance-none"
                    >
                      <option value="">None (Top Level)</option>
                      {MOCK_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Display Order</label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="number"
                        {...register("displayOrder", { valueAsNumber: true })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image & Visuals */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Visual Assets</h3>
                </div>

                <div className="flex items-start gap-6">
                  <div className="relative w-32 h-32 rounded-[24px] border-2 border-slate-100 bg-slate-50 overflow-hidden group shrink-0 shadow-sm">
                    {imageWatch ? (
                      <>
                        <Image src={imageWatch} alt="Preview" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => setValue("image", "")}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-6 h-6 text-white" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <label className="inline-block px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 cursor-pointer hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 shadow-sm">
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      <div className="flex items-center gap-2">
                        <ImagePlus className="w-3.5 h-3.5" />
                        Upload Thumbnail
                      </div>
                    </label>
                    <p className="text-[10px] font-medium text-slate-400">
                      Recommendation: 512x512px SVG or Transparent PNG. Max 1MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visibility & Logic */}
              <div className="p-6 bg-emerald-50/30 rounded-[28px] border border-emerald-100/50 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isFeaturedWatch ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-400 border border-slate-200'}`}>
                      <Star className={`w-5 h-5 ${isFeaturedWatch ? 'fill-current' : ''}`} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">Featured Category</p>
                      <p className="text-[11px] font-medium text-slate-500">Promote this category on the homepage.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register("isFeatured")} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-sm"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Visibility Status</label>
                  <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-2xl h-[48px] shadow-sm">
                    {['Draft', 'Published', 'Hidden'].map((s) => (
                      <label 
                        key={s}
                        className={`flex-1 flex items-center justify-center h-full rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                          watch("status") === s 
                          ? s === 'Published' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-slate-800 text-white shadow-lg shadow-slate-200"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <input type="radio" value={s} {...register("status")} className="hidden" />
                        {s === 'Published' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                        {s === 'Draft' && <Archive className="w-3 h-3 mr-1.5" />}
                        {s === 'Hidden' && <Eye className="w-3 h-3 mr-1.5" />}
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="p-4 md:p-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-end gap-3 sticky bottom-0 z-10">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-500 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Discard Changes
            </button>
            <button 
              type="submit"
              form="category-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-emerald-600 text-white text-[13px] font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <>{category ? "Update Category" : "Establish Category"}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
