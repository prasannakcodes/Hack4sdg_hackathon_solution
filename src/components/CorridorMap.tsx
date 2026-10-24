"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Navigation,
  Truck,
  Factory,
  Building2,
  Map as MapIcon,
  Sliders,
} from "lucide-react";
import { MakerShipment } from "@/types";

// Dynamically load Leaflet real map to prevent SSR issues
const RealMapLeaflet = dynamic(() => import("./RealMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-500 animate-pulse border border-slate-200">
      <MapPin className="w-8 h-8 text-emerald-500 mb-2 animate-bounce" />
      <span className="text-sm font-semibold">Loading Tempowala Corridor Real Map...</span>
      <span className="text-xs text-slate-400 mt-1">Fetching OpenStreetMap coordinates for NH-9 Corridor</span>
    </div>
  ),
});

interface CorridorMapProps {
  shipments: MakerShipment[];
}

export const CorridorMap: React.FC<CorridorMapProps> = ({ shipments }) => {
  const [viewMode, setViewMode] = useState<"real" | "schematic">("real");
  const [selectedMakerId, setSelectedMakerId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Tempowala Arterial Corridor: NH-9 / NH-24
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Moradabad Metalware Artisan Cluster $\rightarrow$ Gajraula $\rightarrow$ Garhmukteshwar $\rightarrow$ Hapur $\rightarrow$ Delhi NCR Hubs (165 km)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode("real")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === "real"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Real GPS Map</span>
            </button>
            <button
              onClick={() => setViewMode("schematic")}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                viewMode === "schematic"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Transit Schematic</span>
            </button>
          </div>

          <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-200 hidden md:flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Active Corridor</span>
          </span>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="my-6">
        {viewMode === "real" ? (
          <div>
            <RealMapLeaflet
              shipments={shipments}
              selectedMakerId={selectedMakerId}
              onSelectMaker={setSelectedMakerId}
            />
            <p className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
              <span>
                💡 <em>Tip: Click any marker or consignment below to focus on their GPS pickup node in Moradabad or destination in Delhi NCR.</em>
              </span>
              <span className="text-emerald-700 font-medium">NH-9 Highway (165 km)</span>
            </p>
          </div>
        ) : (
          /* Visual Corridor Flow Schematic */
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl text-white relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Origin Node */}
              <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 backdrop-blur w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Origin Cluster
                  </div>
                  <div className="text-sm font-black text-white">
                    Moradabad (Peetal Nagri)
                  </div>
                  <div className="text-xs text-slate-400">
                    {shipments.length} Maker Consignments
                  </div>
                </div>
              </div>

              {/* Highway Transit Line */}
              <div className="flex-1 w-full flex flex-col items-center px-4">
                <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-mono mb-2">
                  <span>0 km</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/80 flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>NH-9 Express Transit (165 km)</span>
                  </span>
                  <span>165 km</span>
                </div>

                {/* Glowing Road Line */}
                <div className="w-full h-3 bg-slate-700 rounded-full relative overflow-hidden flex items-center">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 w-full animate-pulse"></div>
                  <div className="w-full border-t border-dashed border-white/60 z-10"></div>
                </div>

                {/* Intermediate Highway Waypoints */}
                <div className="flex justify-between w-full mt-2 text-[10px] text-slate-400">
                  <span>Pakbara Hub</span>
                  <span>Gajraula (53 km)</span>
                  <span>Garhmukteshwar (85 km)</span>
                  <span>Hapur Bypass (125 km)</span>
                  <span>Ghaziabad (155 km)</span>
                </div>
              </div>

              {/* Destination Node */}
              <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 backdrop-blur w-full md:w-auto">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    Destination Gateways
                  </div>
                  <div className="text-sm font-black text-white">
                    Delhi NCR Logistics Hubs
                  </div>
                  <div className="text-xs text-slate-400">
                    ICD Patparganj & Okhla Ph-III
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Maker Corridor Pickup Directory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Consignment Pickup Nodes on Corridor ({shipments.length} Active)
          </h4>
          {selectedMakerId && (
            <button
              onClick={() => setSelectedMakerId(null)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline"
            >
              Reset Selection
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {shipments.map((s) => {
            const isSelected = selectedMakerId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setSelectedMakerId(s.id);
                  if (viewMode !== "real") setViewMode("real");
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin
                      className={`w-3.5 h-3.5 ${
                        isSelected ? "text-amber-600" : "text-emerald-600"
                      }`}
                    />
                    <span className="truncate">{s.makerName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-mono">
                    {s.weightKg} kg
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  From: <span className="text-slate-700">{s.origin}</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  To: <span className="text-slate-700 font-medium">{s.destination}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{s.category}</span>
                  <span className="font-semibold text-slate-600">{s.volumeM3} m³</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
