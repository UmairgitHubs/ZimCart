import React from "react";
import { cn } from "@/lib/utils";
import { ProductStatus } from "@/types/products";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const getStatusStyles = (status: ProductStatus) => {
    switch (status) {
      case "In Stock":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Low Stock":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Out of Stock":
        return "bg-red-50 text-red-600 border-red-100";
      case "Draft":
        return "bg-slate-50 text-slate-600 border-slate-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap inline-flex items-center justify-center",
      getStatusStyles(status)
    )}>
      {status}
    </span>
  );
}
