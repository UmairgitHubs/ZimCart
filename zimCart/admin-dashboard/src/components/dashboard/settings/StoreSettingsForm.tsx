import React, { useState } from "react";
import { Store, Mail, Phone, MapPin, DollarSign, Clock, Percent, Truck, Save, AlertTriangle, Calendar, FileText, UploadCloud, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoreSettings } from "@/types/settings";

interface StoreSettingsFormProps {
  initialData: StoreSettings;
}

export function StoreSettingsForm({ initialData }: StoreSettingsFormProps) {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="animate-in fade-in duration-500">
      
      <div className="mb-6 flex items-center gap-2 text-emerald-600">
         <Store className="w-5 h-5" />
         <h2 className="text-lg font-bold text-slate-800 tracking-tight">General Store Configuration</h2>
      </div>

      <div className="space-y-4">
        
        {/* Core Identity */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
           <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Core Identity</h3>
           <p className="text-[13px] text-slate-500 mb-5">Primary public-facing details for your merchant dashboard.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
             <div className="space-y-1.5">
               <label className="text-[13px] font-medium text-slate-700">Store Name</label>
               <input
                 type="text"
                 value={formData.storeName}
                 onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                 className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
               />
             </div>
             
             <div className="space-y-1.5">
               <label className="text-[13px] font-medium text-slate-700">Physical Address</label>
               <input
                 type="text"
                 value={formData.physicalAddress}
                 onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                 className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
               />
             </div>
             
             <div className="space-y-1.5">
               <label className="text-[13px] font-medium text-slate-700">Support Email</label>
               <input
                 type="email"
                 value={formData.contactEmail}
                 onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                 className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
               />
             </div>
             
             <div className="space-y-1.5">
               <label className="text-[13px] font-medium text-slate-700">Support Hotline</label>
               <input
                 type="tel"
                 value={formData.supportPhone}
                 onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                 className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
               />
             </div>
           </div>
        </div>

        {/* Localization & Operations */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
           <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Localization & Orders</h3>
           <p className="text-[13px] text-slate-500 mb-5">Financial and delivery bounds for your operations.</p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Currency</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                  >
                     <option value="ZWL">ZWL - Zim Dollar</option>
                     <option value="USD">USD - US Dollar</option>
                     <option value="ZAR">ZAR - SA Rand</option>
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Timezone</label>
                  <select 
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                  >
                     <option value="Africa/Harare">Africa/Harare</option>
                     <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                     <option value="UTC">UTC Universal</option>
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">VAT/Tax Rate (%)</label>
                  <input
                     type="number"
                     value={formData.taxRate}
                     onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                     className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
              </div>

              <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Delivery Radius (KM)</label>
                  <input
                     type="number"
                     value={formData.deliveryRadiusKm}
                     onChange={(e) => setFormData({ ...formData, deliveryRadiusKm: parseInt(e.target.value) })}
                     className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
              </div>
           </div>
        </div>

        {/* Operations Manager */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
           <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Operations Manager</h3>
           <p className="text-[13px] text-slate-500 mb-5">Configure store hours, holidays, and emergency controls.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Store Hours */}
              <div className="space-y-4">
                  <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-700">Opening Time</label>
                      <input
                          type="time"
                          value={formData.storeHours?.openTime || "08:00"}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            storeHours: { ...formData.storeHours, openTime: e.target.value } as any
                          })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-700">Closing Time</label>
                      <input
                          type="time"
                          value={formData.storeHours?.closeTime || "22:00"}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            storeHours: { ...formData.storeHours, closeTime: e.target.value }  as any
                          })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                  </div>
              </div>

              {/* Emergency Close and Holidays */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-100 mb-4">
                     <div>
                        <h4 className="text-[13px] font-semibold text-rose-800 flex items-center gap-1.5">
                           <AlertTriangle className="w-4 h-4" /> Emergency Close
                        </h4>
                        <p className="text-[12px] text-rose-600 mt-0.5">Temporarily halt all new orders.</p>
                     </div>
                     <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, emergencyClose: !formData.emergencyClose })}
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border",
                          formData.emergencyClose ? "bg-rose-600 border-rose-600" : "bg-slate-200 border-slate-300"
                        )}
                      >
                        <div className={cn(
                          "bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300",
                          formData.emergencyClose ? "translate-x-6" : "translate-x-0"
                        )} />
                      </button>
                 </div>

                 <div className="space-y-1.5">
                     <label className="text-[13px] font-medium text-slate-700 flex items-center gap-1.5 mb-2">
                        <Calendar className="w-4 h-4 text-slate-400" /> Holiday Calendar
                     </label>
                     <div className="bg-white border border-slate-200 rounded-lg p-3 max-h-[140px] overflow-y-auto">
                        {formData.holidayCalendar?.map((holiday, idx) => (
                           <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                               <span className="text-[12px] font-medium text-slate-700">{holiday.description}</span>
                               <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{holiday.date}</span>
                           </div>
                        ))}
                     </div>
                     <button type="button" className="text-[12px] font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md mt-2 transition-colors">
                        + Add Holiday
                     </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Document Vault */}
        <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
           <div className="flex items-center justify-between mb-5">
              <div>
                 <h3 className="text-[14px] font-semibold text-slate-800 mb-1">Document Vault</h3>
                 <p className="text-[13px] text-slate-500">Manage legal compliance, tax, and safety documents.</p>
              </div>
              <button type="button" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 py-1.5 text-[12px] font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                 <UploadCloud className="w-4 h-4" /> Upload Document
              </button>
           </div>
           
           <div className="space-y-3">
              {formData.complianceDocuments?.map((doc) => (
                 <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-slate-200 rounded-lg hover:border-emerald-200 transition-colors gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                           <FileText className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-[13px] font-medium text-slate-800">{doc.name}</p>
                           <p className="text-[11px] text-slate-400">Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        {doc.status === 'Verified' ? (
                           <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                              <CheckCircle className="w-3 h-3" /> Verified
                           </span>
                        ) : (
                           <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                              <Clock className="w-3 h-3" /> Pending Review
                           </span>
                        )}
                        <button type="button" className="text-[12px] font-medium text-slate-500 hover:text-rose-600 transition-colors">
                           Remove
                        </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
