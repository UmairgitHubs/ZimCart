"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Bell, MessageSquare, Menu, LogOut, Loader2, Package } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useProductQuickSearch } from "@/hooks/useProductQuickSearch";
import type { Product } from "@/types/products";

function categoryLabel(category: Product["category"]): string {
  if (!category) return "";
  return typeof category === "string" ? category : category.name ?? "";
}

function searchHref(product: Product): string {
  const q = product.sku?.trim() || product.name?.trim() || "";
  return `/dashboard/products?q=${encodeURIComponent(q)}`;
}

/**
 * Senior Optimized Header
 * - Removed all dropdown state to simplify DOM and improve performance.
 * - Centralized user identity logic using Redux.
 * - Integrated direct Logout for a faster workflow.
 * - Product quick search calls GET /products?search= (same scope as catalog).
 */
export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 320);
  const { data: hits, isFetching, isError, error } = useProductQuickSearch(debounced);
  const rootRef = useRef<HTMLDivElement>(null);

  const showPanel = open && debounced.trim().length >= 2;

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const onInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to sign out of the ZimCart Registry?")) {
      logout.mutate();
    }
  };

  return (
    <header className="h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl active:scale-95 transition-all outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Product search — GET /products?search= */}
        <div ref={rootRef} className="relative hidden md:block w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none z-[1]" />
          <input
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onInputKeyDown}
            placeholder="Search products (name, SKU, brand)…"
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all outline-none"
            aria-autocomplete="list"
            aria-expanded={showPanel}
          />

          {showPanel && (
            <div
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 z-[60] overflow-hidden"
              role="listbox"
            >
              {isFetching && (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  Searching…
                </div>
              )}

              {!isFetching && isError && (
                <div className="px-4 py-3 text-sm text-red-700">
                  {(error as Error)?.message ?? "Search failed"}
                </div>
              )}

              {!isFetching && !isError && (hits?.length ?? 0) === 0 && (
                <div className="px-4 py-3 text-sm text-slate-500">No matching products.</div>
              )}

              {!isFetching && !isError && hits && hits.length > 0 && (
                <ul className="max-h-80 overflow-y-auto py-1">
                  {hits.map((p) => {
                    const cat = categoryLabel(p.category);
                    const thumb = p.images?.[0];
                    return (
                      <li key={p.id} role="option">
                        <Link
                          href={searchHref(p)}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-slate-800 truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {p.sku && <span className="font-mono">{p.sku}</span>}
                              {p.sku && p.brand ? " · " : null}
                              {p.brand}
                              {cat ? ` · ${cat}` : ""}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {!isFetching && !isError && debounced.trim().length >= 2 && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50/80">
                  <Link
                    href={`/dashboard/products?q=${encodeURIComponent(debounced.trim())}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View all in Products →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 border-r border-slate-100 pr-4 md:pr-6">
          {/* Quick-Action Icons (Stateless) */}
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative outline-none">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
          </button>

          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative outline-none">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* User Identity Section */}
        <div className="flex items-center gap-4 pl-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-600 border-2 border-emerald-500/20 overflow-hidden shadow-lg shadow-emerald-500/10">
               <img 
                 src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=10B981&color=fff&bold=true&format=png`} 
                 alt="Identity" 
                 className="w-full h-full object-cover"
               />
             </div>
             <div className="text-left hidden sm:block">
               <p className="text-[13px] font-black text-slate-800 leading-tight truncate max-w-[120px]">{user?.name || "ZimCart Admin"}</p>
               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.15em] mt-0.5">{user?.role?.replace('_', ' ') || "Administrator"}</p>
             </div>
          </div>

          {/* Explicit Logout - Faster workflow than a dropdown */}
          <button 
            onClick={handleLogout}
            disabled={logout.isPending}
            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 group outline-none ml-2 border border-transparent hover:border-red-100"
            title="Secure Logout"
          >
            {logout.isPending ? (
               <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            ) : (
               <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
