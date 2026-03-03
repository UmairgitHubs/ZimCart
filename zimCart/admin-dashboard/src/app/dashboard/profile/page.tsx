"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  User, 
  Store as StoreIcon, 
  CreditCard, 
  FileText, 
  Settings, 
  CheckCircle2,
  Camera,
  MapPin,
  Clock,
  Plus,
  ChevronRight,
  ChevronLeft,
  Globe,
  Wallet,
  Calendar,
  Briefcase,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/dashboard/profile/StepIndicator";
import { 
  SectionHeader, 
  InputField, 
  SelectField, 
  FileUploadField, 
  ReviewCard 
} from "@/components/dashboard/profile/FormUI";

type OnboardingStep = 
  | 'business' 
  | 'owner' 
  | 'store' 
  | 'banking' 
  | 'uploads' 
  | 'operations' 
  | 'review';

const STEPS = [
  { id: 'business', label: 'Business Identity', icon: <Building2 className="w-4 h-4" /> },
  { id: 'owner', label: 'Principal Owner', icon: <User className="w-4 h-4" /> },
  { id: 'store', label: 'Store Analytics', icon: <StoreIcon className="w-4 h-4" /> },
  { id: 'banking', label: 'Settlements', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'uploads', label: 'Verifications', icon: <FileText className="w-4 h-4" /> },
  { id: 'operations', label: 'Control Center', icon: <Settings className="w-4 h-4" /> },
  { id: 'review', label: 'Final Audit', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function ProfilePage() {
  const [activeStep, setActiveStep] = useState<OnboardingStep>('business');
  const [status, setStatus] = useState<'IDLE' | 'PENDING_REVIEW'>('IDLE');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const [formData, setFormData] = useState({
    legalName: "ZimCart Wholesale PVT LTD",
    tradeName: "ZimCart Mart",
    businessType: "Supermarket",
    taxId: "NTN-882910-1",
    regNumber: "REG-99102-PK",
    yearEstablished: "2024",
    branches: "1",
    ownerName: "Zain Ahmed",
    cnic: "42101-9922810-1",
    dob: "1992-05-15",
    personalPhone: "+92 321 8829101",
    personalEmail: "zain.ahmed@zimcart.com",
    residentialAddress: "House 12, Street 4, DHA Phase 6, Karachi",
    storeName: "ZimCart Mart Central",
    storeAddress: "Plot 44-C, Main 26th Street, Karachi",
    city: "Karachi",
    province: "Sindh",
    postalCode: "75500",
    latitude: "24.8607",
    longitude: "67.0011",
    storePhone: "+92 21 3456789",
    supportEmail: "support.central@zimcart.com",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    openingTime: "09:00",
    closingTime: "23:00",
    deliveryAvailable: true,
    deliveryRadius: "10",
    pickupAvailable: true,
    bankName: "Habib Bank Limited",
    accountTitle: "ZimCart Wholesale PVT LTD",
    iban: "PK00HABB00112233445566",
    branchCode: "0011",
    bankCountry: "Pakistan",
    currency: "PKR",
    taxPercentage: "17",
    prepTime: "20",
    deliveryCharges: "150",
    categories: ["Grocery", "Fresh Produce"],
    paymentMethods: { cod: true, online: true, wallet: true }
  });

  const nextStep = () => {
    const idx = STEPS.findIndex(s => s.id === activeStep);
    if (idx < STEPS.length - 1) setActiveStep(STEPS[idx + 1].id as OnboardingStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    const idx = STEPS.findIndex(s => s.id === activeStep);
    if (idx > 0) setActiveStep(STEPS[idx - 1].id as OnboardingStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMounted) return null;

  if (status === 'PENDING_REVIEW') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in zoom-in duration-700">
        <div className="relative group">
           <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-700" />
           <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl shadow-emerald-200/50 flex items-center justify-center border border-emerald-100 rotate-3 group-hover:rotate-6 transition-transform duration-500">
              <ShieldCheck className="w-12 h-12 text-emerald-600 animate-pulse" />
           </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 tracking-tighter mt-12 text-center">Audit in Progress</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed mt-4 text-center font-medium">
          Your documentation is being verified by the <span className="text-emerald-600 font-semibold">ZimCart Compliance Engine</span>. 
          High-tier merchants typically receive approval within 24 hours.
        </p>
        <button 
          onClick={() => setStatus('IDLE')}
          className="mt-12 px-10 py-4 bg-slate-900 text-white rounded-2xl font-semibold uppercase tracking-widest text-[12px] hover:bg-black transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-32 mt-6 px-4 sm:px-8 lg:px-12 animate-in fade-in duration-1000">
      
      {/* Dynamic Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-200 shadow-sm">
               Compliance Tier 1
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">System Operational</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tighter">Merchant Profile</h1>
          <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-xl">
            Integrate your business into the <span className="text-emerald-600 font-semibold">ZimCart Ecosystem</span> by completing our multi-vector verification process.
          </p>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50">
           <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-[14px]">
             {formData.legalName.charAt(0)}
           </div>
           <div className="pr-4">
              <p className="text-[12px] font-bold text-slate-800 leading-tight">{formData.legalName}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5 tracking-wider">Enterprise ID: #ZM-992</p>
           </div>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Modular Sidebar */}
        <StepIndicator 
          steps={STEPS} 
          activeStep={activeStep} 
          onStepClick={(id) => setActiveStep(id as OnboardingStep)} 
        />

        {/* Dynamic Canvas Area */}
        <div className="flex-1 w-full max-w-5xl group/canvas">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] border border-slate-200/60 shadow-2xl shadow-slate-200/40 relative overflow-hidden min-h-[700px] flex flex-col transition-all duration-500 hover:shadow-emerald-200/20">
            
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/5 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

            <div className="p-10 lg:p-14 flex-1 relative z-10">
              {activeStep === 'business' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <SectionHeader icon={<Building2 className="w-6 h-6" />} title="Legal Core" subtitle="Authenticate your corporation's legal status and tax standing within the region." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Corporation Name" value={formData.legalName} onChange={(v) => setFormData({...formData, legalName: v})} placeholder="Legal PVT LTD" />
                    <InputField label="Public Trade Name" value={formData.tradeName} onChange={(v) => setFormData({...formData, tradeName: v})} placeholder="Store Brand Name" />
                    <SelectField label="Industry Sector" options={["Grocery", "Pharmacy", "Wholesale", "FMCG"]} value={formData.businessType} onChange={(v) => setFormData({...formData, businessType: v})} />
                    <InputField label="Tax Identity (NTN)" value={formData.taxId} onChange={(v) => setFormData({...formData, taxId: v})} placeholder="800-291-0" />
                    <InputField label="Gov Registration" value={formData.regNumber} onChange={(v) => setFormData({...formData, regNumber: v})} placeholder="REG-10293" />
                  </div>
                </div>
              )}

              {activeStep === 'owner' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <SectionHeader icon={<User className="w-6 h-6" />} title="Principal Beneficiary" subtitle="KYC validation for the primary merchant representative or owner." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Authorized Full Name" value={formData.ownerName} onChange={(v) => setFormData({...formData, ownerName: v})} />
                    <InputField label="National Identity Card" value={formData.cnic} onChange={(v) => setFormData({...formData, cnic: v})} />
                    <InputField label="Identification DOB" type="date" value={formData.dob} onChange={(v) => setFormData({...formData, dob: v})} />
                    <InputField label="Direct Contact" value={formData.personalPhone} onChange={(v) => setFormData({...formData, personalPhone: v})} />
                  </div>
                </div>
              )}

              {activeStep === 'store' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <SectionHeader icon={<StoreIcon className="w-6 h-6" />} title="Logistics Hub" subtitle="Define your physical dispatch locations and operational radius." />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField label="Terminal Name" value={formData.storeName} onChange={(v) => setFormData({...formData, storeName: v})} />
                      <InputField label="Hub Address" value={formData.storeAddress} onChange={(v) => setFormData({...formData, storeAddress: v})} />
                      <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 md:col-span-2">
                         <h4 className="text-[12px] font-semibold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-emerald-500" /> Operational Cycle
                         </h4>
                         <div className="flex flex-wrap gap-2 mb-8">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                               <button key={day} onClick={() => {
                                 const days = formData.workingDays.includes(day) ? formData.workingDays.filter(d => d !== day) : [...formData.workingDays, day];
                                 setFormData({...formData, workingDays: days});
                               }} className={cn("px-5 py-2.5 rounded-full text-[11px] font-semibold transition-all border shadow-sm", formData.workingDays.includes(day) ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-200/50 scale-105" : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
                                 {day}
                               </button>
                            ))}
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <InputField label="Hub Opening" type="time" value={formData.openingTime} onChange={(v) => setFormData({...formData, openingTime: v})} />
                            <InputField label="Hub Closing" type="time" value={formData.closingTime} onChange={(v) => setFormData({...formData, closingTime: v})} />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeStep === 'banking' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <SectionHeader icon={<CreditCard className="w-6 h-6" />} title="Yield & Settlements" subtitle="Secure banking configuration for automated revenue distribution." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Merchant Bank" value={formData.bankName} onChange={(v) => setFormData({...formData, bankName: v})} />
                    <InputField label="Settlement Title" value={formData.accountTitle} onChange={(v) => setFormData({...formData, accountTitle: v})} />
                    <InputField label="IBAN Direct" value={formData.iban} onChange={(v) => setFormData({...formData, iban: v})} />
                    <div className="md:col-span-2">
                       <FileUploadField label="Financial Proof" subtitle="Cheque Copy / Bank Statement (PDF/IMG)" />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 'uploads' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <SectionHeader icon={<FileText className="w-6 h-6" />} title="Documentation Matrix" subtitle="Mandatory legal uploads for platform-wide risk assessment." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FileUploadField label="License Certificate" icon={<Briefcase className="w-5 h-5" />} />
                    <FileUploadField label="Tax Registration" icon={<FileText className="w-5 h-5" />} />
                    <FileUploadField label="Frontier ID (Owner)" icon={<User className="w-5 h-5" />} />
                    <FileUploadField label="Store Architecture" icon={<Camera className="w-5 h-5" />} />
                  </div>
                </div>
              )}

              {activeStep === 'operations' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <SectionHeader icon={<Settings className="w-6 h-6" />} title="Control Layer" subtitle="Optimize your terminal's efficiency and tax governance." />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField label="Platform Currency" value={formData.currency} onChange={(v) => setFormData({...formData, currency: v})} />
                      <InputField label="VAT / Tax Policy (%)" type="number" value={formData.taxPercentage} onChange={(v) => setFormData({...formData, taxPercentage: v})} />
                      <InputField label="SLA Prep Time (M)" type="number" value={formData.prepTime} onChange={(v) => setFormData({...formData, prepTime: v})} />
                      <div className="md:col-span-2">
                         <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-1 mb-4 block">Merchant Catalog Ties</label>
                         <div className="flex flex-wrap gap-2">
                            {["Dairy", "Meat", "Pharmacy", "Snacks", "Electronics"].map(cat => (
                               <button key={cat} onClick={() => {
                                 const cats = formData.categories.includes(cat) ? formData.categories.filter(c => c !== cat) : [...formData.categories, cat];
                                 setFormData({...formData, categories: cats});
                               }} className={cn("px-4 py-2 rounded-xl text-[11px] font-semibold transition-all border", formData.categories.includes(cat) ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-slate-50 border-slate-200 text-slate-500")}>
                                 {cat}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeStep === 'review' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <SectionHeader icon={<ShieldCheck className="w-6 h-6" />} title="Strategic Confirmation" subtitle="Final audit check before syncing your profile with the ZimCart Grid." />
                  <div className="space-y-6">
                    <ReviewCard title="Entity & Trust" items={[
                      { label: "Legal Name", value: formData.legalName },
                      { label: "Representative", value: formData.ownerName },
                      { label: "Tax ID", value: formData.taxId }
                    ]} onEdit={() => setActiveStep('business')} />

                    <ReviewCard title="Financial Nodes" items={[
                      { label: "Bank Institution", value: formData.bankName },
                      { label: "IBAN", value: formData.iban }
                    ]} onEdit={() => setActiveStep('banking')} />

                    {/* Final Declaration Glass Card */}
                    <div className="p-8 bg-emerald-600 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 relative group overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700" />
                       <div className="flex items-start gap-4 text-white relative z-10">
                          <input 
                            type="checkbox" 
                            id="final-dec" 
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="w-6 h-6 mt-1 rounded-lg border-white/30 bg-white/20 text-emerald-500 focus:ring-white/50 cursor-pointer"
                          />
                          <label htmlFor="final-dec" className="text-[15px] font-bold leading-relaxed cursor-pointer select-none">
                            Strategic Confirmation: <span className="text-emerald-50 font-medium">I verify that all telemetry and data points submitted are accurate. I acknowledge that ZimCart executes algorithmic and manual audits to maintain ecosystem integrity.</span>
                          </label>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Control Dock */}
            <div className="p-8 lg:p-10 border-t border-slate-200/60 bg-slate-50/50 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
               <div className="flex items-center gap-2.5 text-slate-400">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping scale-75" />
                    <Info className="w-4 h-4 text-emerald-500 relative" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Secure session encrypted</p>
               </div>

               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <button 
                   onClick={prevStep}
                   disabled={activeStep === 'business'}
                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 text-slate-500 font-semibold text-[11px] uppercase tracking-widest hover:text-slate-800 disabled:opacity-20 transition-all duration-300 border border-transparent hover:border-slate-200 rounded-2xl"
                 >
                   <ChevronLeft className="w-4 h-4" /> Previous
                 </button>

                 {activeStep === 'review' ? (
                   <button 
                      disabled={!isAgreed}
                      onClick={() => setStatus('PENDING_REVIEW')}
                      className="flex-1 sm:flex-none px-12 py-4 bg-emerald-600 text-white rounded-2xl font-semibold uppercase tracking-widest text-[11px] hover:bg-emerald-700 disabled:opacity-30 disabled:translate-y-0 hover:-translate-y-1 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                      Complete Sync <ShieldCheck className="w-4 h-4" />
                    </button>
                 ) : (
                   <button 
                    onClick={nextStep}
                    className="flex-1 sm:flex-none px-10 py-4 bg-slate-900 text-white rounded-2xl font-semibold uppercase tracking-widest text-[11px] hover:bg-black hover:-translate-y-1 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                  >
                    Save & Continue <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>
                 )}
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
