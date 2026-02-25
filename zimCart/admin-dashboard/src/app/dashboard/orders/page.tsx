"use client";

import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  Download,
  FileText,
  Clock,
  XCircle,
  Plus
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrderTable } from "@/components/dashboard/orders/OrderTable";
import { OrderFilters } from "@/components/dashboard/orders/OrderFilters";
import { OrderEmptyState } from "@/components/dashboard/orders/OrderEmptyState";
import { Order } from "@/types/orders";
import { MOCK_ORDERS, STATUS_TABS } from "@/constants/orders";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Orders");
  const [timeRange, setTimeRange] = useState("All Time");

  // Modern Search and Filter Logic
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      // 1. Status Filter
      const matchesStatus = 
        activeTab === "All Orders" || 
        order.status === activeTab;
      
      if (!matchesStatus) return false;

      // 2. Search Filter
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 3. Time Range Filter
      if (timeRange === "All Time") return true;

      const orderDate = new Date(order.createdAt);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      switch (timeRange) {
        case "Today": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return orderDate >= today;
        }
        case "This Week": {
          const lastWeek = new Date();
          lastWeek.setDate(now.getDate() - 7);
          return orderDate >= lastWeek;
        }
        case "This Month": {
          const lastMonth = new Date();
          lastMonth.setMonth(now.getMonth() - 1);
          return orderDate >= lastMonth;
        }
        default:
          return true;
      }
    });
  }, [searchTerm, activeTab, timeRange]);

  const handleViewOrder = (order: Order) => {
    console.log("Viewing order:", order.id);
    // Modal logic would be triggered here
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* ... header and stats ... */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Order <span className="text-emerald-600"> Management</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage live orders and track shipping status in real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Actions Group */}
          <div className="hidden sm:flex items-center bg-white border border-slate-100 rounded-xl p-1 gap-1">
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[12px] font-bold text-slate-600 transition-all active:scale-95">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-100"></div>
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-[12px] font-bold text-slate-600 transition-all active:scale-95">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDF</span>
            </button>
          </div>

          {/* Primary Action */}
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Manual Order</span>
          </button>
        </div>
      </section>

      {/* Analytics Overview Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Volume" 
          value={MOCK_ORDERS.length} 
          icon={ShoppingBag} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Active Pending" 
          value={MOCK_ORDERS.filter(o => o.status === 'Pending').length} 
          icon={Clock} 
          color="text-amber-600" 
          bgColor="bg-amber-50/50" 
        />
        <StatCard 
          label="Gross Revenue" 
          value={`$${MOCK_ORDERS.reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}`} 
          icon={ShoppingBag} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Canceled Rate" 
          value="1.2%" 
          icon={XCircle} 
          color="text-red-600" 
          bgColor="bg-red-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <OrderFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          statusTabs={STATUS_TABS}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/30 blur-[100px] -z-10 rounded-full"></div>
          
          {filteredOrders.length > 0 ? (
            <OrderTable 
              orders={filteredOrders} 
              onViewDetails={handleViewOrder}
            />
          ) : (
            <OrderEmptyState 
              action={
                <button 
                  onClick={() => { setSearchTerm(""); setActiveTab("All Orders"); }}
                  className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl text-xs font-bold hover:bg-slate-900 transition-all"
                >
                  Clear All Filters
                </button>
              }
            />
          )}

          {/* Simple Pagination */}
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-xs font-extrabold text-slate-400">
              Showing <span className="text-slate-600">{filteredOrders.length}</span> of {MOCK_ORDERS.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95">Next</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
