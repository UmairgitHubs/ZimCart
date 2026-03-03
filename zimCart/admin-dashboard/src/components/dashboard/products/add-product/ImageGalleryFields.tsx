import React, { useState } from "react";
import { ImageIcon, Trash2, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import apiClient from "@/lib/api-client";

export function ImageGalleryFields() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const imagesWatch = watch("images") || [];
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await apiClient.post("/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const uploadedUrls = response.data.data.urls;
        setValue("images", [...imagesWatch, ...uploadedUrls], { shouldValidate: true });
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = imagesWatch.filter((_: any, i: number) => i !== index);
    setValue("images", newImages, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <ImageIcon className="w-4 h-4 text-emerald-600" />
        <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Product Gallery</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {imagesWatch.map((url: string, idx: number) => (
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
          <label className="cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group relative">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <ImagePlus className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-widest">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>
      {errors.images && <p className="text-[11px] text-red-500 mt-1 font-bold animate-in shake-in duration-300">{(errors.images as any).message}</p>}
      <p className="text-[10px] font-medium text-slate-400">Upload up to 4 high-quality product images. (Max 5MB each)</p>
    </div>
  );
}
