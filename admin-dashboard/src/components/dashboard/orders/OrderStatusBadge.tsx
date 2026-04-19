import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Package, 
  XCircle, 
  RefreshCcw,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/orders";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { 
  label: string; 
  icon: React.ElementType; 
  colors: string;
}> = {
  Pending: { 
    label: "Pending", 
    icon: Clock, 
    colors: "bg-amber-50 text-amber-600 border-amber-100" 
  },
  Confirmed: { 
    label: "Confirmed", 
    icon: CheckCircle2, 
    colors: "bg-blue-50 text-blue-600 border-blue-100" 
  },
  Processing: {
    label: "Processing",
    icon: Clock,
    colors: "bg-indigo-50 text-indigo-600 border-indigo-100"
  },
  Shipped: { 
    label: "Shipped", 
    icon: Package, 
    colors: "bg-purple-50 text-purple-600 border-purple-100" 
  },
  "Out for Delivery": {
    label: "Out for Delivery",
    icon: Package,
    colors: "bg-cyan-50 text-cyan-700 border-cyan-100"
  },
  Delivered: { 
    label: "Delivered", 
    icon: CheckCircle2, 
    colors: "bg-emerald-50 text-emerald-600 border-emerald-100" 
  },
  Cancelled: { 
    label: "Cancelled", 
    icon: XCircle, 
    colors: "bg-red-50 text-red-600 border-red-100" 
  },
  Refunded: { 
    label: "Refunded", 
    icon: RefreshCcw, 
    colors: "bg-slate-50 text-slate-600 border-slate-100" 
  },
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || { 
    label: status, 
    icon: AlertCircle, 
    colors: "bg-slate-50 text-slate-600 border-slate-100" 
  };
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all duration-300",
      config.colors,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
}
