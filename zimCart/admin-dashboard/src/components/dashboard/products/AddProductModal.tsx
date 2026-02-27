import React, { useEffect } from "react";
import { X, Plus, Trash2, Package, Tag, DollarSign, Loader2, CheckCircle2, Layout, Layers, Info, List, Upload, ImagePlus, ImageIcon, Percent, Zap, Sparkles } from "lucide-react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { productSchema, ProductFormData } from "@/lib/validations/product";
import { addProduct, updateProduct, resetSubmitSuccess } from "@/lib/features/products/productsSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { PRODUCT_CATEGORIES } from "@/constants/products";
import { Product } from "@/types/products"; // Added import

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null; // Added for editing support
}

export function AddProductModal({ isOpen, onClose, product }: AddProductModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, submitSuccess, error } = useSelector((state: RootState) => state.products);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      compareAtPrice: 0,
      costPrice: 0,
      sku: "",
      barcode: "",
      category: "",
      subCategory: "",
      inventory: 0,
      status: "Draft",
      images: [],
      discountPercentage: 0,
      isDeal: false,
      weight: "",
    }
  });

  // Effect to load product data into form when editing
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        costPrice: product.costPrice || 0,
        sku: product.sku,
        barcode: product.barcode || "",
        category: product.category,
        subCategory: product.subCategory || "",
        inventory: product.inventory,
        status: product.status,
        images: product.images,
        discountPercentage: product.discountPercentage || 0,
        isDeal: product.isDeal || false,
        weight: product.weight || "",
      });
    } else if (!isOpen) {
      // Small delay to prevent layout flicker during close animation
      const timer = setTimeout(() => reset({
        name: "",
        description: "",
        price: 0,
        compareAtPrice: 0,
        costPrice: 0,
        sku: "",
        barcode: "",
        category: "",
        subCategory: "",
        inventory: 0,
        status: "Draft",
        images: [],
        discountPercentage: 0,
        isDeal: false,
        weight: "",
      }), 300);
      return () => clearTimeout(timer);
    }
  }, [product, isOpen, reset]);

  const statusWatch = useWatch({ control, name: "status" });
  const imagesWatch = watch("images");

  // Close & Reset Effects
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetSubmitSuccess());
        reset();
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, dispatch, reset, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmitForm = (data: ProductFormData) => {
    if (product) {
       dispatch(updateProduct({ id: product.id, data }));
    } else {
       dispatch(addProduct({
         ...data,
         slug: data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
       }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setValue("images", [...imagesWatch, ...newImages], { shouldValidate: true });
    }
  };

  const removeImage = (index: number) => {
    const newImages = imagesWatch.filter((_, i) => i !== index);
    setValue("images", newImages, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isLoading && !submitSuccess && onClose()}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
               <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {product ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {product ? "Update your product details and catalog settings." : "Configure your product details and catalog settings."}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading || submitSuccess}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">{product ? "Product Updated!" : "Product Added!"}</h3>
               <p className="text-slate-500 font-medium mt-2 max-w-sm">
                  {product ? "The product details have been successfully synchronized with the catalog fleet." : "The product has been successfully added to your catalog and is currently in Draft status."}
               </p>
            </div>
          ) : (
            <form id="add-product-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
              
              {/* Error Alert */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* General Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">General Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Product Name *</label>
                    <input 
                      {...register("name")}
                      placeholder="E.g. Wireless Noise Canceling Headphones" 
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Description *</label>
                    <textarea 
                      {...register("description")}
                      placeholder="Give a detailed description of the product..." 
                      rows={4}
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all resize-none`}
                    />
                    {errors.description && <p className="text-[11px] text-red-500 mt-1">{errors.description.message}</p>}
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Product Gallery</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {imagesWatch.map((url, idx) => (
                    <div key={idx} className="group relative aspect-square rounded-2xl border-2 border-slate-100 overflow-hidden bg-slate-50">
                      <Image src={url} alt={`Product ${idx}`} width={150} height={150} className="object-cover w-full h-full" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
                          Main
                        </div>
                      )}
                    </div>
                  ))}

                  {imagesWatch.length < 4 && (
                    <label className="cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <ImagePlus className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-widest">Add Image</span>
                    </label>
                  )}
                </div>
                {errors.images && <p className="text-[11px] text-red-500 mt-1 font-bold animate-in shake-in duration-300">{errors.images.message}</p>}
                <p className="text-[10px] font-medium text-slate-400">Upload up to 4 high-quality product images. (Max 2MB each)</p>
              </div>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Pricing</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Price *</label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          step="0.01"
                          {...register("price", { valueAsNumber: true })}
                          placeholder="0.00" 
                          className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                        />
                      </div>
                      {errors.price && <p className="text-[11px] text-red-500 mt-1">{errors.price.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Compare Price</label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          step="0.01"
                          {...register("compareAtPrice", { valueAsNumber: true })}
                          placeholder="0.00" 
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Cost Price</label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="number"
                          step="0.01"
                          {...register("costPrice", { valueAsNumber: true })}
                          placeholder="0.00" 
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Inventory</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">SKU *</label>
                      <input 
                        {...register("sku")}
                        placeholder="E.g. WH-1000" 
                        className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.sku ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                      />
                      {errors.sku && <p className="text-[11px] text-red-500 mt-1">{errors.sku.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Stock Qty *</label>
                      <input 
                        type="number"
                        {...register("inventory", { valueAsNumber: true })}
                        placeholder="0" 
                        className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.inventory ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                      />
                      {errors.inventory && <p className="text-[11px] text-red-500 mt-1">{errors.inventory.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Barcode</label>
                      <input 
                        {...register("barcode")}
                        placeholder="E.g. 123456789" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Weight (KG)</label>
                      <input 
                        {...register("weight")}
                        placeholder="E.g. 0.5" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Discounts & Deals */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Promotions & Deals</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flash Deal</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register("isDeal")} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-[24px] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[13px] font-bold text-slate-700">Display Discount Badge</p>
                      <p className="text-[11px] font-medium text-slate-500">Shows a percentage off badge on the product image.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
                       <Percent className="w-4 h-4 text-emerald-500" />
                       <input 
                         type="number" 
                         {...register("discountPercentage", { valueAsNumber: true })}
                         className="w-12 text-center text-sm font-black text-slate-800 outline-none"
                         placeholder="0"
                       />
                       <span className="text-xs font-bold text-slate-400">OFF</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl">
                    <Zap className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <p className="text-[11px] font-bold text-emerald-700">
                      Pro Tip: Products with a 20%+ discount see 3x higher conversion rates in flash deals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Organization */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <List className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Organization</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Category *</label>
                    <select 
                      {...register("category")}
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.category ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white transition-all cursor-pointer appearance-none`}
                    >
                      <option value="">Select Category</option>
                      {PRODUCT_CATEGORIES.filter(c => c !== "All Categories").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Sub-Category</label>
                    <input 
                      {...register("subCategory")}
                      placeholder="E.g. Wireless" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Initial Status</label>
                    <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl h-[42px]">
                       {['Draft', 'In Stock'].map((s) => (
                         <label 
                            key={s}
                            className={`flex-1 flex items-center justify-center h-full rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${
                              statusWatch === s ? "bg-white text-slate-800 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-500"
                            }`}
                         >
                            <input type="radio" className="hidden" value={s} {...register("status")} />
                            {s}
                         </label>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!submitSuccess && (
          <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3 sticky bottom-0 z-10">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="add-product-form"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white text-[13px] font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-emerald-500/20"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {product ? "Updating..." : "Adding..."}</>
              ) : (
                <>{product ? "Update Product" : "Add Product"}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
