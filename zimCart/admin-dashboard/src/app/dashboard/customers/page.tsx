"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  UserPlus, 
  Download, 
  FileText, 
  UserCheck, 
  UserMinus, 
  UserX, 
  Search,
  Database,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CustomerList } from "@/components/dashboard/customers/CustomerList";
import { CustomerFilters } from "@/components/dashboard/customers/CustomerFilters";
import { CustomerDetailsModal } from "@/components/dashboard/customers/CustomerDetailsModal";
import { EditCustomerModal } from "@/components/dashboard/customers/EditCustomerModal";
import { DeleteCustomerModal } from "@/components/dashboard/customers/DeleteCustomerModal";
import { AddCustomerModal } from "@/components/dashboard/customers/AddCustomerModal";
import { MOCK_CUSTOMERS } from "@/constants/customers";
import { Customer } from "@/types/customers";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Modal States
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesStatus = 
        activeStatus === "All" || 
        cust.status === activeStatus;
      
      const matchesSearch = 
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, activeStatus, customers]);

  const totalSpent = customers.reduce((acc, curr) => acc + curr.totalSpent, 0);
  const activeCount = customers.filter(c => c.status === 'Active').length;
  const blockedCount = customers.filter(c => c.status === 'Blocked').length;

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };
  
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  // Confirm Handlers
  const onUpdateConfirm = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    console.log("Profile Sync Complete:", updatedCustomer.id);
  };

  const onDeleteConfirm = (customer: Customer) => {
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
    console.log("Profile Purged:", customer.id);
  };

  const onAddConfirm = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    console.log("New Customer Onboarded:", newCustomer.id);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1 md:px-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Customer <span className="text-emerald-600">Management</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your user base, monitor engagement and track customer lifetime value.
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

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/10 group"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Add Customer</span>
          </button>
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Users" 
          value={customers.length} 
          icon={Users} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50/50" 
        />
        <StatCard 
          label="Value (LTV)" 
          value={`$${(totalSpent / 1000).toFixed(1)}k`} 
          icon={TrendingUp} 
          color="text-blue-600" 
          bgColor="bg-blue-50/50" 
        />
        <StatCard 
          label="Active Now" 
          value={activeCount} 
          icon={UserCheck} 
          color="text-emerald-500" 
          bgColor="bg-emerald-50/30" 
        />
        <StatCard 
          label="Restrictions" 
          value={blockedCount} 
          icon={UserX} 
          color="text-red-500" 
          bgColor="bg-red-50/50" 
        />
      </section>

      {/* Main Content Area */}
      <section>
        <CustomerFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
        />

        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden relative group min-h-[500px]">
          {/* Glassmorphism subtle background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {filteredCustomers.length > 0 ? (
              <CustomerList 
                customers={filteredCustomers} 
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-20 text-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Database className="w-10 h-10 text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">No customers found</h3>
                 <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">Try adjusting your filters or search terms to find the customer you are looking for.</p>
                 <button 
                   onClick={() => { setSearchTerm(""); setActiveStatus("All"); }}
                   className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200"
                 >
                   Reset Search View
                 </button>
              </div>
            )}
            
            {/* Pagination Placeholder */}
            {filteredCustomers.length > 0 && (
              <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                   </div>
                   <p className="text-xs font-black text-slate-400">
                     Directory contains <span className="text-slate-800">{filteredCustomers.length}</span> matching profiles
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

      {/* Modals Handling */}
      <CustomerDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        customer={selectedCustomer}
      />

      <EditCustomerModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onConfirm={onUpdateConfirm}
      />

      <DeleteCustomerModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        customer={selectedCustomer}
        onConfirm={onDeleteConfirm}
      />

      <AddCustomerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={onAddConfirm}
      />
    </div>
  );
}
