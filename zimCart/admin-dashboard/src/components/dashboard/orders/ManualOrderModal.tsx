import React, { useEffect } from "react";
import { X, Plus, Trash2, ShoppingBag, User, MapPin, DollarSign, Loader2, CheckCircle2, Clock } from "lucide-react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { manualOrderSchema, ManualOrderFormData } from "@/validations/order";
import { createManualOrder, resetSubmitSuccess } from "@/lib/features/orders/ordersSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Order, OrderItem } from "@/types/orders";

interface ManualOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editOrder?: Order | null;
}

export function ManualOrderModal({ isOpen, onClose, editOrder }: ManualOrderModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, submitSuccess, error } = useSelector((state: RootState) => state.orders);

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
      status: "Pending",
      items: [{ name: "", quantity: 1, price: 0 }]
    }
  });

  // Load edit data
  useEffect(() => {
    if (editOrder && isOpen) {
      reset({
        customerName: editOrder.customer.name,
        customerPhone: editOrder.customer.phone || "",
        customerEmail: editOrder.customer.email || "",
        deliveryAddress: editOrder.shippingAddress,
        paymentMethod: editOrder.paymentMethod as any,
        status: editOrder.status,
        items: editOrder.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      });
    } else if (!isOpen) {
      reset(); // Full reset on close
    }
  }, [editOrder, isOpen, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const itemsWatch = useWatch({ control, name: "items" });
  const statusWatch = useWatch({ control, name: "status" });
  
  const calculateTotal = () => {
    if (!itemsWatch) return 0;
    return itemsWatch.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  };

  // Close & Reset Effects
  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetSubmitSuccess());
        reset();
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, dispatch, reset, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmitForm = (data: ManualOrderFormData) => {
    if (editOrder) {
      // Logic for updating order would go here (e.g., dispatch updateOrder)
      // For now, we simulate success for demo
      dispatch(createManualOrder({
        ...editOrder,
        customer: { ...editOrder.customer, name: data.customerName, phone: data.customerPhone, email: data.customerEmail || "" },
        shippingAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        status: (data.status as any) || editOrder.status,
        items: data.items.map((i, idx) => ({ 
          id: editOrder.items[idx]?.id || `ITEM-${Math.floor(Math.random() * 1000)}`,
          ...i,
          image: editOrder.items[idx]?.image 
        })) as any,
        totalAmount: calculateTotal()
      }));
    } else {
      dispatch(createManualOrder({
        customer: {
          id: `CUST-${Math.floor(Math.random() * 1000)}`,
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail || "",
        },
        shippingAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        items: data.items.map(i => ({ ...i, id: `ITEM-${Math.floor(Math.random() * 1000)}` })) as OrderItem[],
        totalAmount: calculateTotal()
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => !isLoading && !submitSuccess && onClose()}
      />
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
               <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {editOrder ? `Edit Order #${editOrder.id}` : "Create Manual Order"}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {editOrder ? "Update the customer or order details below." : "Draft and confirm a new customer order directly."}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading || submitSuccess}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 custom-scrollbar">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-500/10">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  Order {editOrder ? "Updated" : "Created"} Successfully!
                </h3>
                <p className="text-slate-500 font-medium mt-2 max-w-sm">
                  {editOrder ? "Changes have been saved and applied to the order." : "The new order has been added to the queue."}
                </p>
            </div>
          ) : (
            <form id="manual-order-form" onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
              
              {/* Error Alert */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Customer Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Customer Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Full Name *</label>
                    <input 
                      {...register("customerName")}
                      placeholder="E.g. John Doe" 
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.customerName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                    />
                    {errors.customerName && <p className="text-[11px] text-red-500 mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Phone Number *</label>
                    <input 
                      {...register("customerPhone")}
                      placeholder="+1 (555) 000-0000" 
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.customerPhone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                    />
                    {errors.customerPhone && <p className="text-[11px] text-red-500 mt-1">{errors.customerPhone.message}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500">Email Address (Optional)</label>
                    <input 
                      {...register("customerEmail")}
                      placeholder="john@example.com" 
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.customerEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all`}
                    />
                    {errors.customerEmail && <p className="text-[11px] text-red-500 mt-1">{errors.customerEmail.message}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Delivery & Payment</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Complete Address *</label>
                    <textarea 
                      {...register("deliveryAddress")}
                      placeholder="123 Main St, Apartment 4B, City, State, ZIP" 
                      rows={2}
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.deliveryAddress ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all resize-none`}
                    />
                    {errors.deliveryAddress && <p className="text-[11px] text-red-500 mt-1">{errors.deliveryAddress.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Payment Method *</label>
                    <select 
                      {...register("paymentMethod")}
                      className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.paymentMethod ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10'} rounded-xl text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 transition-all appearance-none cursor-pointer`}
                    >
                      <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                      <option value="Pos on Delivery">POS on Delivery</option>
                      <option value="Bank Transfer">Direct Bank Transfer</option>
                      <option value="Paid Online">Paid Online (External)</option>
                    </select>
                    {errors.paymentMethod && <p className="text-[11px] text-red-500 mt-1">{errors.paymentMethod.message}</p>}
                  </div>

                  {editOrder && (
                    <div className="space-y-1.5 pt-2">
                       <div className="flex items-center gap-2 pb-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <label className="text-xs font-bold text-slate-500 tracking-tight">Update Order Progress</label>
                       </div>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'].map((stat) => (
                             <label 
                                key={stat}
                                className={`cursor-pointer group flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                                   statusWatch === stat 
                                   ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20' 
                                   : 'bg-white border-slate-100 hover:border-slate-200'
                                }`}
                             >
                                <input 
                                   type="radio"
                                   {...register("status")}
                                   value={stat}
                                   className="hidden"
                                />
                                <span className={`text-[9px] font-black uppercase tracking-tighter text-center ${
                                   statusWatch === stat ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                                }`}>
                                   {stat}
                                </span>
                             </label>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BoxIcon className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-[13px] font-bold text-slate-800 uppercase tracking-wider">Order Items</h3>
                  </div>
                  <button 
                    type="button"
                    onClick={() => append({ name: "", quantity: 1, price: 0 })}
                    className="text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                
                {errors.items?.root && <p className="text-[11px] text-red-500 mt-1">{errors.items.root.message}</p>}

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm relative group">
                      <div className="flex-1 w-full space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block sm:hidden">Item Name</label>
                        <input 
                          {...register(`items.${index}.name`)}
                          placeholder="Search or enter item name..."
                          className={`w-full bg-slate-50 border ${errors.items?.[index]?.name ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} focus:bg-white outline-none px-3 py-2 rounded-lg text-[13px] font-medium text-slate-700 transition-all`}
                        />
                        {errors.items?.[index]?.name && <p className="text-[10px] text-red-500 mt-1">{errors.items[index]?.name?.message}</p>}
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-24 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block sm:hidden">Price ($)</label>
                          <div className="relative">
                            <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input 
                              type="number"
                              step="0.01"
                              {...register(`items.${index}.price`, { valueAsNumber: true })}
                              placeholder="0.00"
                              className={`w-full bg-slate-50 border ${errors.items?.[index]?.price ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} focus:bg-white outline-none pl-7 pr-3 py-2 rounded-lg text-[13px] font-bold text-slate-700 transition-all`}
                            />
                          </div>
                          {errors.items?.[index]?.price && <p className="text-[10px] text-red-500 mt-1">{errors.items[index]?.price?.message}</p>}
                        </div>
                        <div className="w-20 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block sm:hidden">Qty</label>
                          <input 
                            type="number"
                            step="1"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                            className={`w-full bg-slate-50 border ${errors.items?.[index]?.quantity ? 'border-red-300' : 'border-slate-200 focus:border-emerald-500'} focus:bg-white outline-none px-3 py-2 rounded-lg text-[13px] font-bold text-slate-700 transition-all text-center`}
                          />
                          {errors.items?.[index]?.quantity && <p className="text-[10px] text-red-500 mt-1">{errors.items[index]?.quantity?.message}</p>}
                        </div>
                        <div className="flex items-end h-[42px] pt-[20px] sm:pt-0">
                          <button 
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300 mb-[1px]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!submitSuccess && (
          <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-10">
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto overflow-hidden">
               <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                 <div className="text-xl font-black text-slate-800">${calculateTotal().toFixed(2)}</div>
               </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="manual-order-form"
                disabled={isLoading || calculateTotal() <= 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white text-[13px] font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-emerald-500/20"
              >
                 {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <>{editOrder ? "Save Changes" : "Create Order"}</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon helper to avoid lucide import conflicts 
function BoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
