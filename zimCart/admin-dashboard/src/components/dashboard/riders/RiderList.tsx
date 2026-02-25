import React from "react";
import Image from "next/image";
import { ArrowRight, MoreHorizontal, Bike, CircleDot, Star, MapPin } from "lucide-react";
import { Rider } from "@/types/riders";

interface RiderListProps {
  riders: Rider[];
  onView: (rider: Rider) => void;
  onEdit: (rider: Rider) => void;
}

export function RiderList({ riders, onView, onEdit }: RiderListProps) {
  return (
    <div className="w-full">
      {/* Mobile View: Premium Cards Layout */}
      <div className="md:hidden flex flex-col gap-4 p-4 bg-slate-50/30">
        {riders.map((rider) => (
          <div 
            key={rider.id} 
            className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 group"
          >
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={rider.avatarUrl}
                    alt={rider.name}
                    width={56}
                    height={56}
                    className="rounded-2xl object-cover ring-2 ring-slate-50 group-hover:ring-emerald-50 transition-all"
                    unoptimized
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    rider.status === 'Available' ? 'bg-emerald-500' :
                    rider.status === 'Dispatched' ? 'bg-blue-500' :
                    rider.status === 'Banned' ? 'bg-red-500' : 'bg-slate-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-slate-800">{rider.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">{rider.id}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onEdit(rider)}
                className="p-2 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Status</p>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider w-max ${
                    rider.status === 'Available' ? 'text-emerald-600' :
                    rider.status === 'Dispatched' ? 'text-blue-600' :
                    rider.status === 'Banned' ? 'text-red-600' :
                    'text-slate-600'
                  }`}>
                    <CircleDot className="w-3.5 h-3.5" />
                    {rider.status}
                  </span>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Vehicle</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                    <Bike className="w-4 h-4 text-emerald-600" /> 
                    <span className="truncate">{rider.vehicleType}</span>
                  </div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Rating</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {rider.rating.toFixed(1)}
                  </div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 hidden sm:block">Location</p>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                    <MapPin className="w-4 h-4 text-blue-500" /> {rider.distanceKm} km
                  </div>
               </div>
            </div>

            <button 
              onClick={() => onView(rider)}
              className="w-full py-3 bg-slate-800 text-white text-[13px] font-bold rounded-xl hover:bg-slate-900 transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              View Full Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop View: Ultra-Refined Table Layout */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-widest text-[11px] font-black text-slate-400">
              <th className="px-8 py-5 rounded-tl-[40px]">Rider Profile</th>
              <th className="px-6 py-5">Status & Location</th>
              <th className="px-6 py-5">Vehicle Details</th>
              <th className="px-6 py-5">Performance</th>
              <th className="px-8 py-5 text-right rounded-tr-[40px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {riders.map((rider) => (
              <tr key={rider.id} className="group hover:bg-slate-50/40 transition-colors duration-300">
                
                {/* Profile Details */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={rider.avatarUrl}
                        alt={rider.name}
                        width={56}
                        height={56}
                        className="rounded-2xl object-cover ring-[3px] ring-white shadow-sm transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        rider.status === 'Available' ? 'bg-emerald-500' :
                        rider.status === 'Dispatched' ? 'bg-blue-500 text-blue-700' :
                        rider.status === 'Banned' ? 'bg-red-500 text-red-700' : 'bg-slate-400 text-slate-600'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-black text-slate-800 group-hover:text-emerald-700 transition-colors">{rider.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-sm">{rider.id}</span>
                        <span className="text-[12px] font-medium text-slate-500">{rider.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status & Location Info */}
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider w-max shadow-sm border ${
                        rider.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        rider.status === 'Dispatched' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        rider.status === 'Banned' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        <CircleDot className="w-3.5 h-3.5" />
                        {rider.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600 border border-slate-100 bg-white rounded-lg px-2.5 py-1.5 w-max shadow-sm">
                         <MapPin className="w-3.5 h-3.5 text-blue-500" />
                         {rider.distanceKm} km away
                      </div>
                   </div>
                </td>

                {/* Vehicle Info */}
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2.5">
                         <div className="w-8 h-8 bg-white border border-slate-100 shadow-sm rounded-xl flex items-center justify-center">
                            <Bike className="w-4 h-4 text-emerald-600" />
                         </div>
                         <div>
                            <p className="text-[13px] font-bold text-slate-800">{rider.vehicleType}</p>
                            <p className="text-[11px] font-bold text-slate-400">Plate: <span className="text-slate-600">{rider.licensePlate}</span></p>
                         </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 pl-[42px]">Active: <span className="text-slate-600">{rider.lastActive}</span></p>
                   </div>
                </td>
                
                {/* Performance Indicator */}
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-2 max-w-[160px]">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                           <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                           <span className="text-[14px] font-black text-slate-800">{rider.rating.toFixed(1)}</span>
                         </div>
                         <p className="text-[11px] font-bold text-slate-400">{rider.totalDeliveries} Deliveries</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 shadow-inner">
                          <div 
                             className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                             style={{ width: `${Math.min((rider.totalDeliveries / 1500) * 100, 100)}%` }}
                          ></div>
                      </div>
                   </div>
                </td>

                {/* Action Buttons */}
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2.5">
                    <button 
                      onClick={() => onView(rider)}
                      className="p-2 w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center group/btn"
                      title="View Full Profile"
                    >
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                    <button 
                      onClick={() => onEdit(rider)}
                      className="p-2 w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                      title="Manage Rider Details"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
