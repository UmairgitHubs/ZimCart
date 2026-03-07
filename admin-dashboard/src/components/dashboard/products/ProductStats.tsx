import React from "react";
import { Package, AlertTriangle, Archive, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Product } from "@/types/products";

interface ProductStatsProps {
  totalProducts: number;
  products: Product[];
}

export function ProductStats({ totalProducts, products }: ProductStatsProps) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard 
        label="Total" 
        value={totalProducts} 
        icon={Package} 
        color="text-emerald-600" 
        bgColor="bg-emerald-50/50" 
      />
      <StatCard 
        label="Low Stock" 
        value={safeProducts.filter((p: Product) => p.status === 'Low Stock').length} 
        icon={AlertTriangle} 
        color="text-amber-600" 
        bgColor="bg-amber-50/50" 
      />
      <StatCard 
        label="Out of Stock" 
        value={safeProducts.filter((p: Product) => p.status === 'Out of Stock').length} 
        icon={Archive} 
        color="text-red-600" 
        bgColor="bg-red-50/50" 
      />
      <StatCard 
        label="In Store" 
        value={safeProducts.filter((p: Product) => p.status === 'In Stock').length} 
        icon={CheckCircle2} 
        color="text-blue-600" 
        bgColor="bg-blue-50/50" 
      />
    </section>
  );
}
