"use client";

import React from "react";
import { Trash2, AlertCircle, FileSpreadsheet } from "lucide-react";

interface StepPreviewProps {
  file: File;
  data: any[];
  onRemove: () => void;
}

export function StepPreview({ file, data, onRemove }: StepPreviewProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="p-6 bg-slate-50 border border-slate-200 rounded-[32px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
             </div>
             <div>
                <p className="text-[13px] font-bold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
                   Ready for {data.length} Ingestions
                </p>
             </div>
          </div>
          <button 
            onClick={onRemove}
            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 outline-none"
            title="Remove and select another file"
          >
            <Trash2 className="w-5 h-5" />
          </button>
       </div>

       {/* Preview Section */}
       <div className="space-y-4">
          <div className="flex items-center gap-2">
             <AlertCircle className="w-4 h-4 text-emerald-600" />
             <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest">Metadata Validation</h3>
          </div>
          <div className="max-h-[180px] overflow-y-auto rounded-3xl border border-slate-100 bg-white shadow-inner custom-scrollbar">
             <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                   <tr>
                      <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">SKU</th>
                      <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Name</th>
                      <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Category</th>
                      <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {data.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-5 py-3 text-[11px] font-bold text-slate-400 font-mono">{row.SKU || "N/A"}</td>
                         <td className="px-5 py-3 text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{row.Name || "Untitled"}</td>
                         <td className="px-5 py-3 text-[11px] font-semibold text-slate-500">{row.Category || "None"}</td>
                         <td className="px-5 py-3 text-[11px] font-bold text-emerald-600 text-right">${row.Price || 0}</td>
                      </tr>
                   ))}
                   {data.length > 5 && (
                      <tr>
                         <td colSpan={4} className="px-5 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            + {data.length - 5} more entries detected in your manifest...
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
