"use client";

import React, { useState, useMemo } from "react";
import { 
  Bike, 
  MapPin, 
  Download, 
  FileText, 
  UserPlus, 
  Database,
  AlertTriangle,
  Clock
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RiderList } from "@/components/dashboard/riders/RiderList";
import { RiderFilters } from "@/components/dashboard/riders/RiderFilters";
import { MOCK_RIDERS } from "@/constants/riders";
import { Rider } from "@/types/riders";

export default function RidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filteredRiders = useMemo(() => {
    return MOCK_RIDERS.filter((rider) => {
      const matchesStatus = 
        activeStatus === "All" || 
        rider.status === activeStatus;
      
      const matchesSearch = 
        rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeStatus]);

  const activeCount = MOCK_RIDERS.filter(r => r.status === 'Available').length;
  const dispatchCount = MOCK_RIDERS.filter(r => r.status === 'Dispatched').length;
  const bannedCount = MOCK_RIDERS.filter(r => r.status === 'Banned').length;

  const handleView = (rider: Rider) => console.log("Viewing:", rider.id);
  const handleEdit = (rider: Rider) => console.log("Editing:", rider.id);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Fleet <span className="text-emerald-600">Logistics</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your rider fleet, track live locations, and coordinate handovers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
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

          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group">
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Onboard Rider</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Fleet" 
          value={MOCK_RIDERS.length} 
          icon={Bike} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Available Now" 
          value={activeCount} 
          icon={Clock} 
          color="text-emerald-500" 
          bgColor="bg-emerald-50/30" 
        />
        <StatCard 
          label="On Delivery" 
          value={dispatchCount} 
          icon={MapPin} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Action Needed" 
          value={bannedCount} 
          icon={AlertTriangle} 
          color="text-red-500" 
          bgColor="bg-red-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <RiderFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredRiders.length > 0 ? (
              <RiderList 
                riders={filteredRiders} 
                onView={handleView}
                onEdit={handleEdit}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Database className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No riders found</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">Try adjusting your filters or search terms to find the rider you are looking for.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset Search View
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredRiders.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Directory contains <span className="text-slate-800">{filteredRiders.length}</span> matching profiles
                   </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-400 cursor-not-allowed transition-all uppercase tracking-widest">Previous</button>
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-800 shadow-sm hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95 uppercase tracking-widest">Next Page</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
