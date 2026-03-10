import React, { useEffect, useState } from "react";
import { X, Package, Loader2, CheckCircle2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/validations/product";
import { Product } from "@/types/products";

// Sub-components
import { GeneralInfoFields } from "./add-product/GeneralInfoFields";
import { ImageGalleryFields } from "./add-product/ImageGalleryFields";
import { VariantFields } from "./add-product/VariantFields";
import { PromotionFields } from "./add-product/PromotionFields";
import { OrganizationFields } from "./add-product/OrganizationFields";
import { UnitConfigurationFields } from "./add-product/UnitConfigurationFields";
import { InventorySummaryPanel } from "./add-product/InventorySummaryPanel";
import axios from "axios";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

import { useAddProduct, useUpdateProduct } from "@/hooks/useProducts";

export function AddProductModal({ isOpen, onClose, product }: AddProductModalProps) {
  // TanStack Query Mutations
  const { mutateAsync: addProduct, isPending: isAdding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  
  const isLoading = isAdding || isUpdating;
  const [localSuccess, setLocalSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: 0,
      discountPrice: 0,
      costPrice: 0,
      taxPercentage: 0,
      category: "",
      subCategory: "",
      status: "Draft",
      images: [],
      discountPercentage: 0,
      isDeal: false,
      weight: "",
      baseUnit: "piece",
      sales: 0,
      variants: [
        { 
          name: "Standard", 
          sellingUnit: "piece", 
          baseUnitQuantity: 1, 
          sku: "", 
          costPrice: 0, 
          sellingPrice: 0, 
          stockQuantity: 0, 
          lowStockThreshold: 10,
          isDefault: true,
          isActive: true 
        }
      ]
    }
  });

  const { handleSubmit, reset, setValue, watch, control, setError, getValues } = methods;

  // 1. Modal Housekeeping
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // 2. Barcode Lookup Logic
  const handleBarcodeLookup = async (barcode: string) => {
    try {
      const { data } = await axios.get(`/api/products/barcode-lookup?code=${barcode}`);
      
      // Auto-fill logic (Do not overwrite user-entered values)
      const currentValues = getValues();
      
      if (!currentValues.name) setValue("name", data.name, { shouldValidate: true });
      if (!currentValues.brand) setValue("brand", data.brand, { shouldValidate: true });
      if (!currentValues.description) setValue("description", data.description, { shouldValidate: true });
      
      // Auto-fill Image if gallery is empty
      if ((!currentValues.images || currentValues.images.length === 0) && data.image) {
        setValue("images", [data.image], { shouldValidate: true });
      }
      
      return true;
    } catch (err) {
      console.error("Barcode lookup failed:", err);
      // Optional: Log but don't disrupt user flow
      return false;
    }
  };

  useEffect(() => {
    const onBarcodeEvent = (e: any) => {
       handleBarcodeLookup(e.detail.barcode);
    };
    window.addEventListener('barcode-lookup' as any, onBarcodeEvent);
    return () => window.removeEventListener('barcode-lookup' as any, onBarcodeEvent);
  }, []);

  // 3. Form State Synchronization
  useEffect(() => {
    if (isOpen) {
      setLocalSuccess(false);
      setErrorMessage(null);
      if (product) {
        reset({ 
          ...(product as any), 
          category: typeof product.category === 'object' ? (product.category as any).name : product.category,
          brand: product.brand || "", 
          subCategory: product.subCategory || "", 
          weight: product.weight || "", 
          baseUnit: (product as any).baseUnit || "piece",
          sales: (product as any).sales || 0,
          variants: (product.variants as any)?.length && (product.variants as any)[0].sellingUnit ? (product.variants as any) : [{ 
            name: "Standard", sellingUnit: "piece", baseUnitQuantity: 1, sku: (product as any).sku || "", 
            costPrice: product.costPrice || 0, sellingPrice: product.price || 0, 
            stockQuantity: (product as any).inventory || 0, lowStockThreshold: 10,
            isDefault: true, isActive: true 
          }] 
        });
      }
      else {
        reset({ 
           name: "", brand: "", description: "", price: 0, discountPrice: 0, 
           costPrice: 0, taxPercentage: 0, category: "", subCategory: "", 
           status: "Draft", images: [], discountPercentage: 0, isDeal: false, 
           weight: "", baseUnit: "piece", sales: 0,
           variants: [{ 
             name: "Standard", sellingUnit: "piece", baseUnitQuantity: 1, sku: "", 
             costPrice: 0, sellingPrice: 0, stockQuantity: 0, lowStockThreshold: 10,
             isDefault: true, isActive: true 
           }]
        });
      }
    }
  }, [isOpen, product, reset]);

  if (!isOpen) return null;

  const onSubmitForm = async (data: any) => {
    try {
      setErrorMessage(null);
      
      // Auto-sync top-level pricing and identifiers from Default Variant
      const defaultVariant = data.variants.find((v: any) => v.isDefault) || data.variants[0];
      if (defaultVariant) {
        data.price = defaultVariant.sellingPrice;
        data.costPrice = defaultVariant.costPrice;
        data.discountPrice = defaultVariant.discountPrice || 0;
        data.weight = defaultVariant.weight || "";
        data.sku = defaultVariant.sku;
        data.barcode = defaultVariant.barcode || "";
      }

      // Calculate aggregated inventory
      data.inventory = data.variants.reduce((acc: number, v: any) => acc + (Number(v.stockQuantity) || 0), 0);

      let res;
      if (product) {
        res = await updateProduct({ id: product.id, data });
      } else {
        res = await addProduct(data);
      }

      if (res.success) {
        setLocalSuccess(true);
        setTimeout(() => {
          onClose();
          reset();
        }, 2000);
      }
    } catch (err: any) {
      const responseStatus = err.response?.status;
      const responseData = err.response?.data;

      if (responseStatus === 400 && responseData?.errors) {
        const fieldErrors = responseData.errors;
        Object.keys(fieldErrors).forEach((key) => {
          setError(key as any, { type: "server", message: fieldErrors[key] });
        });
      } else {
        setErrorMessage(responseData?.message || "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[155] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isLoading && !localSuccess && onClose()}
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
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
            disabled={isLoading || localSuccess}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar">
          {localSuccess ? (
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
            <FormProvider {...methods}>
              <form id="add-product-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-10">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-in shake-in duration-300">
                    {errorMessage}
                  </div>
                )}

                {Object.keys(methods.formState.errors).length > 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium space-y-1">
                    <p className="font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Please fix the following issues:
                    </p>
                    <ul className="list-disc list-inside text-[12px] opacity-80">
                      {Object.keys(methods.formState.errors).map((key) => {
                         const error = methods.formState.errors[key as keyof typeof methods.formState.errors];
                         return <li key={key}>{(error as any)?.message || key}</li>;
                      })}
                    </ul>
                  </div>
                )}

                <GeneralInfoFields />
                <ImageGalleryFields />
                
                <UnitConfigurationFields />
                
                <div className="pt-2">
                   <VariantFields />
                </div>

                <InventorySummaryPanel />

                <PromotionFields />
                <OrganizationFields />
              </form>
            </FormProvider>
          )}
        </div>

        {/* Footer */}
        {!localSuccess && (
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
