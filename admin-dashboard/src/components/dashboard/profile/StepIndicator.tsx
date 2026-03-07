"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  activeStep: string;
  onStepClick: (id: any) => void;
}

export function StepIndicator({ steps, activeStep, onStepClick }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(s => s.id === activeStep);

  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden sticky top-24">
        <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
             <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Verification Cycle</span>
             <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
               Step {currentIndex + 1}
             </span>
          </div>
          <p className="text-sm font-semibold text-slate-700">Merchant Onboarding</p>
          
          {/* Global Progress Bar */}
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
               style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }} 
             />
          </div>
        </div>

        <div className="py-4 px-3 space-y-1">
          {steps.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isCompleted = currentIndex > idx;

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 group relative",
                  isActive 
                    ? "bg-emerald-600 shadow-lg shadow-emerald-700/20 translate-x-1" 
                    : "hover:bg-slate-50 text-slate-500"
                )}
              >
                {/* Active Indicator Pulse */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full" />
                )}

                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive 
                    ? "bg-white text-emerald-600" 
                    : isCompleted 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.icon}
                </div>
                
                <div className="flex-1">
                  <p className={cn(
                    "text-[13px] font-semibold tracking-tight transition-colors",
                    isActive ? "text-white" : "text-slate-700"
                  )}>
                    {step.label}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold",
                      isActive ? "text-emerald-100" : "text-slate-400"
                    )}>
                      {isCompleted ? "Verified" : isActive ? "Active" : `Step ${idx + 1}`}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Support Card in Sidebar */}
        <div className="p-5 mt-2">
           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">Help & Support</p>
              <p className="text-[12px] text-emerald-600 mt-1 font-medium leading-relaxed">Need help with verification?</p>
              <button className="mt-3 text-[11px] font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800 transition-colors">
                 Chat with Agent
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
