import React, { useEffect, useState } from "react";
import { X, Package, Loader2, CheckCircle2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/validations/product";
import { Product } from "@/types/products";

// Sub-components
import { GeneralInfoFields } from "./add-product/GeneralInfoFields";
import { ImageGalleryFields } from "./add-product/ImageGalleryFields";
import { PricingIdentifierFields } from "./add-product/PricingIdentifierFields";
import { VariantFields } from "./add-product/VariantFields";
import { PromotionFields } from "./add-product/PromotionFields";
import { OrganizationFields } from "./add-product/OrganizationFields";

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
      variants: []
    }
  });

  const { handleSubmit, reset, setValue, watch, control, setError } = methods;

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

  // 2. Form State Synchronization
  useEffect(() => {
    if (isOpen) {
      setLocalSuccess(false);
      setErrorMessage(null);
      if (product) {
        reset({ 
          ...product, 
          category: typeof product.category === 'object' ? product.category.name : product.category,
          brand: product.brand || "", 
          barcode: product.barcode || "", 
          subCategory: product.subCategory || "", 
          weight: product.weight || "", 
          variants: product.variants || [] 
        });
      }
 else {
        reset({ name: "", brand: "", description: "", price: 0, discountPrice: 0, costPrice: 0, taxPercentage: 0, sku: "", barcode: "", category: "", subCategory: "", inventory: 0, status: "Draft", images: [], discountPercentage: 0, isDeal: false, weight: "", variants: [] });
      }
    }
  }, [isOpen, product, reset]);

  // 3. Automated Logic (SKU Generation)
  const nameWatch = watch("name");
  const brandWatch = watch("brand");

  useEffect(() => {
    if (!product && nameWatch && !watch("sku")) {
      const brandPart = brandWatch ? brandWatch.slice(0, 3).toUpperCase() : "ZIM";
      const namePart = nameWatch.slice(0, 3).toUpperCase();
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      setValue("sku", `${brandPart}-${namePart}-${randomPart}`, { shouldValidate: true });
    }
  }, [nameWatch, brandWatch, setValue, product, watch]);

  if (!isOpen) return null;

  const onSubmitForm = async (data: any) => {
    try {
      setErrorMessage(null);
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
      // Axios puts the response data in err.response.data
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
              <form id="add-product-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium animate-in shake-in duration-300">
                    {errorMessage}
                  </div>
                )}

                <GeneralInfoFields />
                <ImageGalleryFields />
                <PricingIdentifierFields />
                <VariantFields />
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
