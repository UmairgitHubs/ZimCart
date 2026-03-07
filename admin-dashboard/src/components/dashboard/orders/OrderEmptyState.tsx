import React from 'react';
import { PackageSearch } from 'lucide-react';

interface OrderEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function OrderEmptyState({ 
  title = "No Orders Found", 
  description = "We couldn't find any orders matching your current filters. Try adjusting your search or filters.",
  action
}: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
        <PackageSearch className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-extrabold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      {action}
    </div>
  );
}
