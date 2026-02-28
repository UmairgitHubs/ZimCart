"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Tags, 
  Users, 
  CreditCard, 
  BarChart3, 
  MessagesSquare, 
  Settings, 
  User, 
  LogOut,
  TicketPercent,
  Box,
  X,
  Bike,
  Trash2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { logout } from "@/lib/features/auth/authSlice";
import { authService } from "@/services/auth.service";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders" },
  { icon: Box, label: "Products", href: "/dashboard/products" },
  { icon: Tags, label: "Categories", href: "/dashboard/categories" },
  { icon: Package, label: "Inventory", href: "/dashboard/inventory" },
  { icon: Users, label: "Customers", href: "/dashboard/customers" },
  { icon: Bike, label: "Riders", href: "/dashboard/riders" },
  { icon: TicketPercent, label: "Promotions", href: "/dashboard/promotions" },
  { icon: CreditCard, label: "Transactions", href: "/dashboard/transactions" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Trash2, label: "Waste Log", href: "/dashboard/waste-log" },
  { icon: MessagesSquare, label: "Customer Support", href: "/dashboard/support" },
  { icon: Settings, label: "Mart Settings", href: "/dashboard/settings" },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-[100] w-64 h-screen bg-white border-r border-slate-100 transition-all duration-300 transform lg:static lg:translate-x-0 flex flex-col",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    )}>
      {/* Logo & Close Button */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Z</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            Zim<span className="text-emerald-600">Cart</span>
          </span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200" 
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"
                )} />
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-slate-50">
        <nav className="space-y-1">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200"
          >
            <User className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold">Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
