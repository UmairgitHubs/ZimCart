import React from "react";
import Image from "next/image";
import { Eye, Edit2, Trash2, MoreHorizontal, ChevronRight, Tags, Search, ArrowUpDown, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { Category } from "@/types/categories";

interface CategoryListProps {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onView: (cat: Category) => void;
}

export function CategoryList({ categories, onEdit, onDelete, onView }: CategoryListProps) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-visible">
        <table className="w-full text-left border-collapse min-w-full">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/30 font-bold">
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-center">Products</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] text-slate-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                           <Tags className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{cat.name}</h4>
                        {cat.isFeatured && (
                          <span className="bg-amber-100/50 text-amber-600 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-amber-200 uppercase tracking-tighter">Featured</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">ID: {cat.id} • Order: {cat.displayOrder}</p>
                        {cat.parentCategory && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100 uppercase tracking-tighter">
                            <Network className="w-2.5 h-2.5" />
                            {cat.parentCategory}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <p className="text-xs font-bold text-slate-500 max-w-[250px] truncate">{cat.description}</p>
                </td>
                <td className="px-6 py-5 text-center">
                   <span className="text-sm font-black text-slate-700 bg-slate-100/50 px-3 py-1 rounded-lg">{cat.productCount} Items</span>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col gap-1.5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest inline-flex items-center gap-1.5 w-fit",
                      cat.status === 'Published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      cat.status === 'Draft' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full",
                        cat.status === 'Published' ? "bg-emerald-500" :
                        cat.status === 'Draft' ? "bg-amber-500" : "bg-slate-300"
                      )}></span>
                      {cat.status}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Updated {new Date(cat.lastUpdated).toLocaleDateString()}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onView(cat); }} 
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === cat.id ? null : cat.id);
                          }}
                          className={cn(
                            "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all",
                            openMenuId === cat.id && "bg-slate-100 text-slate-600"
                          )}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        
                        {openMenuId === cat.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => { onEdit(cat); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-emerald-500" />
                              Edit Category
                            </button>
                            <button 
                              onClick={() => { onDelete(cat); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                              Delete Category
                            </button>
                          </div>
                        )}
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-4">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => onView(cat)}
            className="group bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all relative overflow-hidden"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative shrink-0">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                ) : <Tags className="w-6 h-6 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors leading-none">{cat.name}</h4>
                    {cat.parentCategory && (
                      <Network className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-tighter shrink-0",
                    cat.status === 'Published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    cat.status === 'Draft' ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-slate-50 text-slate-400 border-slate-100"
                  )}>{cat.status}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 line-clamp-2 leading-relaxed mt-1.5">{cat.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</span>
                    <span className="text-[13px] font-black text-slate-700">{cat.productCount} Items</span>
                  </div>
                  <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
