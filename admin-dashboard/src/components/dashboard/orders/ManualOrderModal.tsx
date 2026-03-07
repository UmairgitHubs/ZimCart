import React, { useEffect } from "react";
import { 
  X, Plus, Trash2, ShoppingBag, User, MapPin, 
  DollarSign, Loader2, CheckCircle2, Clock, 
  CreditCard, FileText, Truck, AlertCircle,
  Package, Info, ChevronRight, Hash, Mail, 
  Settings, Save, Globe, Phone, ListChecks,
  Monitor
} from "lucide-react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { manualOrderSchema, ManualOrderFormData } from "@/validations/order";
import { useOrders } from "@/hooks/useOrders";
import { Order } from "@/types/orders";
import { cn } from "@/lib/utils";

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editOrder?: Order | null;
}

export function ManualOrderModal({ isOpen, onClose, editOrder }: ManualOrderModalProps) {
  const { createOrder, updateOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ManualOrderFormData>({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deliveryAddress: "",
      paymentMethod: "Cash on Delivery" as any,
      deliveryFee: 0,
      items: [{ name: "", quantity: 1, price: 0 }],
      notes: "",
      status: "Pending"
    }
  });

  // Load edit data
  useEffect(() => {
    if (editOrder && isOpen) {
      let address = editOrder.shippingAddress;
      try {
          const parsed = JSON.parse(editOrder.shippingAddress);
          if (parsed.address) address = parsed.address;
      } catch (e) {}

      reset({
        customerName: editOrder.customer.name,
        customerPhone: (editOrder.customer.phone === "N/A" || !editOrder.customer.phone) ? "" : editOrder.customer.phone,
        customerEmail: editOrder.customer.email || "",
        deliveryAddress: address,
        paymentMethod: editOrder.paymentMethod as any,
        deliveryFee: (editOrder as any).deliveryFee || 0,
        status: editOrder.status,
        items: editOrder.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        notes: (editOrder as any).notes || ""
      });
    } else if (!isOpen) {
      reset();
    }
  }, [editOrder, isOpen, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const itemsWatch = useWatch({ control, name: "items" });
  const statusWatch = useWatch({ control, name: "status" }) as string;
  const deliveryFeeWatch = useWatch({ control, name: "deliveryFee" }) || 0;
  
  const calculateSubtotal = () => {
    if (!itemsWatch) return 0;
    return itemsWatch.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + Number(deliveryFeeWatch) + calculateTax();
  };

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        reset();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, reset, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmitForm = async (data: ManualOrderFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (editOrder) {
        const orderIdToUpdate = (editOrder as any).dbId || (editOrder as any)._id || editOrder.id;
        await updateOrder({ 
          id: orderIdToUpdate, 
          data: {
            ...data,
            items: data.items.map((item, idx) => ({
              ...item,
              productId: editOrder.items[idx]?.productId
            }))
          } 
        });
      } else {
        await createOrder(data);
      }
      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Internal server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      {/* Professional Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isSubmitting && !submitSuccess && onClose()}
      />
      
      {/* Clean Modal Dialog - Syncing with OrderDetailsModal style */}
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Professional Header */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8 border-b border-slate-100 flex-shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100">
                <ShoppingBag className="w-5 h-5 text-white" />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  {editOrder ? "Edit Manifest" : "Manual Fulfilment"}
                </h2>
                {editOrder && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    ID: {editOrder.id}
                  </span>
                )}
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area - Dense & Professional */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50">
          {submitSuccess ? (
             <div className="h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                   <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Success</h3>
                <p className="text-slate-500 mt-2 font-medium">Record has been synchronized and saved.</p>
             </div>
          ) : (
            <form id="pro-order-form" onSubmit={handleSubmit(onSubmitForm)} className="p-6 md:p-10 space-y-10">
              
              {submitError && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 items-start animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold">{submitError}</p>
                 </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                
                {/* Left Side: Logistics & Customer */}
                <div className="xl:col-span-7 space-y-8">
                  
                  {/* Customer Information Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                       <User className="w-4 h-4 text-emerald-600" />
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Customer Intelligence</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                        <input 
                           {...register("customerName")}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                           placeholder="Enter customer name..."
                        />
                        {errors.customerName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.customerName.message}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                        <input 
                           {...register("customerPhone")}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                           placeholder="+263..."
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Email Address (Optional)</label>
                        <input 
                           {...register("customerEmail")}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                           placeholder="customer@domain.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Logistics Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                       <Truck className="w-4 h-4 text-blue-600" />
                       <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Route & Settlement</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Precise Delivery Address</label>
                        <textarea 
                           {...register("deliveryAddress")}
                           rows={3}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300 resize-none"
                           placeholder="Building, Street, Area..."
                        />
                        {errors.deliveryAddress && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.deliveryAddress.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Payment Protocol</label>
                          <select 
                             {...register("paymentMethod")}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all appearance-none cursor-pointer"
                          >
                             <option value="Cash on Delivery">Cash on Delivery</option>
                             <option value="Pos on Delivery">POS on Delivery</option>
                             <option value="Bank Transfer">Bank Transfer</option>
                             <option value="Paid Online">Already Paid</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Manifest Instructions</label>
                          <input 
                             {...register("notes")}
                             className="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:bg-white focus:border-slate-500 rounded-xl text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                             placeholder="Internal notes..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Order Items */}
                <div className="xl:col-span-5 space-y-8">
                   <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
                      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                         <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Order Items</h3>
                         <button 
                            type="button" 
                            onClick={() => append({ name: "", quantity: 1, price: 0 })}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors"
                         >
                            <Plus className="w-3 h-3" /> Add Item
                         </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                         {fields.map((field, index) => (
                            <div key={field.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 group/item transition-all">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                                     <Package className="w-4 h-4" />
                                  </div>
                                  <input 
                                     {...register(`items.${index}.name`)}
                                     className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-200"
                                     placeholder="Item name..."
                                  />
                                  <button 
                                     type="button" 
                                     onClick={() => remove(index)} 
                                     disabled={fields.length === 1}
                                     className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hidden group-hover/item:block"
                                  >
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                               
                               <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100/50">
                                  <div className="space-y-1">
                                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider block ml-1">Price</span>
                                     <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rs</span>
                                        <input 
                                           type="number"
                                           step="0.01"
                                           {...register(`items.${index}.price`, { valueAsNumber: true })}
                                           className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-100 rounded-lg text-xs font-black text-slate-700 outline-none"
                                        />
                                     </div>
                                  </div>
                                  <div className="space-y-1">
                                     <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider block ml-1 text-right">Quantity</span>
                                     <input 
                                        type="number"
                                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                        className="w-full px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-xs font-black text-slate-700 outline-none text-right"
                                     />
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>

                      {/* Summary Section within Card */}
                      <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
                         <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <span>Manifest Subtotal</span>
                            <span>Rs {calculateSubtotal().toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider items-center">
                            <span>Tax (GST 5%)</span>
                            <span className="text-slate-700 font-black">Rs {calculateTax().toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider items-center">
                            <span>Delivery Logistics</span>
                            <div className="flex items-center gap-1">
                               <span className="text-slate-400">Rs</span>
                               <input 
                                  type="number" 
                                  step="0.01"
                                  {...register("deliveryFee", { valueAsNumber: true })}
                                  className="w-16 bg-transparent border-none focus:outline-none text-right font-black text-slate-700"
                               />
                            </div>
                         </div>
                         <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grand Total</span>
                            <span className="text-2xl font-black text-emerald-600 tracking-tighter">Rs {calculateTotal().toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   {/* Status Picker - Clean & Unobtrusive */}
                   {editOrder && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                         <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                            <Settings className="w-4 h-4 text-slate-400" />
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Workflow State</h3>
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((stat) => (
                               <label key={stat} className={cn(
                                  "cursor-pointer px-2 py-2 rounded-xl border text-[9px] font-black uppercase text-center transition-all",
                                  statusWatch === stat 
                                  ? "bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-100" 
                                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                               )}>
                                  <input type="radio" {...register("status")} value={stat} className="hidden" />
                                  {stat}
                               </label>
                            ))}
                         </div>
                      </div>
                   )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Professional Footer */}
        {!submitSuccess && (
           <div className="px-8 py-5 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
             <div className="hidden md:flex flex-col">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Manifest Finalization</p>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[11px] font-bold text-slate-500">System Ready for Transmission</p>
                </div>
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={onClose}
                  className="flex-1 md:flex-none px-6 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit"
                  form="pro-order-form"
                  disabled={isSubmitting || calculateTotal() <= 0}
                  className="flex-1 md:flex-none px-10 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.1em] shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:shadow-emerald-200 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-2"
                >
                   {isSubmitting ? (
                     <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing</>
                   ) : (
                     <><Save className="w-3.5 h-3.5" /> {editOrder ? 'Save Changes' : 'Confirm Order'}</>
                   )}
                </button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
