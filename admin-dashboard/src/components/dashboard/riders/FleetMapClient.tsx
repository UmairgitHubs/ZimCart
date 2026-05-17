"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export type FleetRiderPin = {
  id: string;
  name: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  activeOrders: { orderNumber: string }[];
};

const HARARE = { lat: -17.8292, lng: 31.0522 };

export function FleetMapClient({ riders }: { riders: FleetRiderPin[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<{ remove: () => void } | null>(null);
  const [ready, setReady] = useState(false);

  const withGps = riders.filter((r) => r.latitude != null && r.longitude != null);

  useEffect(() => {
    let cancelled = false;

    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;
      const w = window as Window & { L?: unknown };
      if (!w.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Leaflet load failed"));
          document.body.appendChild(script);
        });
      }
      if (!cancelled) setReady(true);
    };

    loadLeaflet().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = (window as unknown as { L: any }).L;
    if (!L) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const map = L.map(mapRef.current).setView([HARARE.lat, HARARE.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    const bounds: [number, number][] = [];

    withGps.forEach((r) => {
      const lat = r.latitude!;
      const lng = r.longitude!;
      bounds.push([lat, lng]);
      const color =
        r.status === "AVAILABLE"
          ? "#10b981"
          : r.status === "DISPATCHED"
            ? "#06b6d4"
            : "#94a3b8";
      const marker = L.circleMarker([lat, lng], {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 2,
      }).addTo(map);
      marker.bindPopup(
        `<strong>${r.name}</strong><br/>${r.status}<br/>${
          r.activeOrders.length ? `${r.activeOrders.length} active job(s)` : "No active jobs"
        }`
      );
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [ready, riders]);

  return (
    <div className="relative w-full h-[min(70vh,560px)] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {withGps.length === 0 && ready && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl p-3 text-sm text-slate-600 border border-slate-200">
          No riders have shared GPS yet. Riders appear after they go online and use the app.
        </div>
      )}
    </div>
  );
}
