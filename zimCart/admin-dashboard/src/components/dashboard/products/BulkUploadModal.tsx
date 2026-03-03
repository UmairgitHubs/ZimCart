"use client";

import React from "react";
import { X, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { useBulkUpload } from "./bulk/useBulkUpload";
import { StepSelect } from "./bulk/StepSelect";
import { StepPreview } from "./bulk/StepPreview";
import { StepProcess } from "./bulk/StepProcess";
import { StepSuccess } from "./bulk/StepSuccess";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const {
    file,
    data,
    isProcessing,
    uploadProgress,
    successCount,
    errorCount,
    isFinished,
    fileInputRef,
    handleFileChange,
    handleUpload,
    downloadTemplate,
    resetModal,
    setFile,
    setData
  } = useBulkUpload(onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isProcessing && onClose()}
      />
      
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[400px] animate-in zoom-in-95 duration-300">
        
        {/* Modal Header - UI/Static focus */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Bulk Sync</h2>
               <div className="flex items-center gap-2 mt-2">
                 <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md">Protocol Beta</div>
               </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Dynamic Routing by Step */}
        <div className="flex-1 p-8">
          {isFinished ? (
            <StepSuccess 
              successCount={successCount} 
              errorCount={errorCount} 
              onFinish={() => { resetModal(); onClose(); }} 
            />
          ) : isProcessing ? (
            <StepProcess progress={uploadProgress} successCount={successCount} />
          ) : !file ? (
            <StepSelect 
              onFileSelect={handleFileChange} 
              onDownloadTemplate={downloadTemplate} 
              fileInputRef={fileInputRef} 
            />
          ) : (
            <StepPreview 
              file={file} 
              data={data} 
              onRemove={() => { setFile(null); setData([]); }} 
            />
          )}
        </div>

        {/* Modal Footer - Footer Logic Action Button */}
        {!isFinished && (
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
             <button 
               onClick={onClose}
               disabled={isProcessing}
               className="px-8 py-3 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
             >
               Cancel
             </button>
             <button 
               disabled={!file || isProcessing || data.length === 0}
               onClick={handleUpload}
               className="flex items-center gap-3 px-8 py-3 bg-emerald-600 text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-emerald-500/20"
             >
                {isProcessing ? (
                   <>
                      <Loader2 className="w-4 h-4 animate-spin text-white/80" />
                      <span>Syncing...</span>
                   </>
                ) : (
                   <>
                      <Upload className="w-4 h-4" />
                      <span>Validate & Commit</span>
                   </>
                )}
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
