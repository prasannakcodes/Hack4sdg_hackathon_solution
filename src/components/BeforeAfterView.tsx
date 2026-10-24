"use client";

import React from "react";
import { PoolingResult } from "@/types";
import {
  Truck,
  Leaf,
  IndianRupee,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Gauge,
} from "lucide-react";

interface BeforeAfterViewProps {
  poolingResult: PoolingResult;
  onOpenAssumptions: () => void;
}

const MAKER_COLORS = [
  { bg: "bg-blue-500", light: "bg-blue-50 text-blue-700 border-blue-200", bar: "bg-blue-500" },
  { bg: "bg-amber-500", light: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-500" },
  { bg: "bg-purple-500", light: "bg-purple-50 text-purple-700 border-purple-200", bar: "bg-purple-500" },
  { bg: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 border-emerald-200", bar: "bg-emerald-500" },
  { bg: "bg-rose-500", light: "bg-rose-50 text-rose-700 border-rose-200", bar: "bg-rose-500" },
  { bg: "bg-indigo-500", light: "bg-indigo-50 text-indigo-700 border-indigo-200", bar: "bg-indigo-500" },
];

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({
  poolingResult,
  onOpenAssumptions,
}) => {
  const { beforeTrucks, afterTrucks, summary } = poolingResult;

  return (
    <div className="space-y-8 mb-8">
      {/* High-level Impact KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Trucks Needed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Trucks on Highway</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.afterTrucksCount}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ↓ {summary.trucksReduced} Trucks Saved
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
            <span className="line-through text-slate-400 font-medium">
              {summary.beforeTrucksCount} Trucks Before
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-700">
              {summary.afterTrucksCount} Shared Trucks
            </span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
            <Truck className="w-24 h-24" />
          </div>
        </div>

        {/* Metric 2: Total Freight Cost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Corridor Cost</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">
              ₹{summary.afterTotalCostInr.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ↓ {summary.totalCostSavingsPercent}% Saved
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
            <span className="line-through text-slate-400 font-medium">
              ₹{summary.beforeTotalCostInr.toLocaleString()}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-emerald-700">
              ₹{summary.totalSavingsInr.toLocaleString()} kept in makers&apos; pockets
            </span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
            <IndianRupee className="w-24 h-24" />
          </div>
        </div>

        {/* Metric 3: Total CO2 Emissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Tailpipe CO₂ Emissions</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.afterTotalCo2Kg} <span className="text-sm font-bold">kg</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ↓ {summary.totalCo2ReductionPercent}% Cut
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
            <span className="line-through text-slate-400 font-medium">
              {summary.beforeTotalCo2Kg} kg
            </span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-emerald-700">
              {summary.totalCo2AvoidedKg} kg CO₂ Avoided
            </span>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
            <Leaf className="w-24 h-24" />
          </div>
        </div>

        {/* Metric 4: Corridor Distance & Efficiency */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Corridor Cargo Density</span>
            <Gauge className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.totalWeightKg.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">
              kg / {summary.totalVolumeM3} m³
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Route: 165 km (Moradabad $\rightarrow$ Delhi Gateway)
          </div>
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 pointer-events-none">
            <Gauge className="w-24 h-24" />
          </div>
        </div>
      </div>

      {/* Main Before vs After Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Truck Pooling Comparison: Before vs After
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing truck space utilization and freight reduction before and after shared packing.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenAssumptions}
              className="text-xs text-emerald-700 hover:underline font-medium px-2 py-1"
            >
              * View Model Assumptions
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* ================= BEFORE POOLING COLUMN ================= */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <h4 className="text-sm font-bold text-slate-800">
                    BEFORE POOLING (Dedicated Trucks)
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {beforeTrucks.length} Separate Trucks, Each Mostly Empty (30%–45% Full)
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-rose-600">
                  ₹{summary.beforeTotalCostInr.toLocaleString()} Total Cost
                </div>
                <div className="text-[11px] text-slate-500">
                  {summary.beforeTotalCo2Kg} kg CO₂ Total
                </div>
              </div>
            </div>

            {/* Warning Alert Banner */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start space-x-2.5 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Inefficient logistics:</span> Every maker pays full dedicated truck rate (₹14,000) while hauling mostly empty air across the highway.
              </div>
            </div>

            {/* Before Trucks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {beforeTrucks.map((truck, idx) => {
                const shipment = truck.shipments[0];
                return (
                  <div
                    key={truck.truckId}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1.5">
                          <Truck className="w-4 h-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-800">
                            Truck #{idx + 1}
                          </span>
                        </div>
                        <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-200">
                          Mostly Empty
                        </span>
                      </div>

                      {/* Maker Name */}
                      <div className="text-xs font-semibold text-slate-700 truncate" title={shipment.makerName}>
                        {shipment.makerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mb-3 truncate">
                        {shipment.category}
                      </div>

                      {/* Truck Load Factor Visual Box */}
                      <div className="space-y-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {/* Weight utilization meter */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Weight: {truck.totalWeightKg} kg</span>
                            <span className="font-semibold text-slate-700">
                              {truck.weightUtilizationPercent}% cap
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-400 rounded-full"
                              style={{ width: `${Math.min(100, truck.weightUtilizationPercent)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Volume utilization meter */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>Volume: {truck.totalVolumeM3} m³</span>
                            <span className="font-semibold text-slate-700">
                              {truck.volumeUtilizationPercent}% cap
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-slate-400 rounded-full"
                              style={{ width: `${Math.min(100, truck.volumeUtilizationPercent)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-900">
                        ₹{truck.costInr.toLocaleString()}
                      </span>
                      <span className="text-slate-500">{truck.co2Kg} kg CO₂</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= AFTER POOLING COLUMN ================= */}
          <div className="space-y-4 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <h4 className="text-sm font-bold text-emerald-950">
                    AFTER POOLING (Shared Trucks)
                  </h4>
                </div>
                <p className="text-xs text-emerald-800/80 mt-0.5">
                  {afterTrucks.length} Shared Trucks, High Capacity (~75% Utilized)
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-emerald-700">
                  ₹{summary.afterTotalCostInr.toLocaleString()} Total Cost
                </div>
                <div className="text-[11px] text-emerald-800">
                  {summary.afterTotalCo2Kg} kg CO₂ Total
                </div>
              </div>
            </div>

            {/* Success Alert Banner */}
            <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 flex items-start space-x-2.5 text-xs text-emerald-900 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Optimal 2D Bin Packing:</span> Exactly 2 shared trucks accommodate all 4 makers with zero capacity violations. 50% cost & CO₂ cut!
              </div>
            </div>

            {/* After Trucks Grid */}
            <div className="grid grid-cols-1 gap-4 pt-1">
              {afterTrucks.map((truck, idx) => (
                <div
                  key={truck.truckId}
                  className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {truck.truckName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {truck.shipments.length} Makers Consolidated
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {truck.weightUtilizationPercent}% Weight Full
                      </span>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        {truck.volumeUtilizationPercent}% Volume Full
                      </span>
                    </div>
                  </div>

                  {/* Visual Cargo Bay Diagram (Showing who is inside) */}
                  <div className="my-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center justify-between">
                      <span>Shared Truck Cargo Bay (3,500 kg / 14.0 m³)</span>
                      <span className="text-[10px] text-slate-400">Multi-Maker Allocation</span>
                    </div>

                    {/* Proportional Segmented Cargo Bar */}
                    <div className="w-full h-8 bg-slate-200 rounded-lg overflow-hidden flex p-0.5 space-x-1 border border-slate-300">
                      {truck.shipments.map((shipment, sIdx) => {
                        const widthPct = Math.round((shipment.weightKg / 3500) * 100);
                        const palette = MAKER_COLORS[(idx * 2 + sIdx) % MAKER_COLORS.length];
                        return (
                          <div
                            key={shipment.id}
                            className={`h-full ${palette.bar} rounded flex items-center justify-center text-[10px] font-bold text-white px-2 transition-all hover:opacity-90`}
                            style={{ width: `${widthPct}%` }}
                            title={`${shipment.makerName}: ${shipment.weightKg} kg (${shipment.volumeM3} m³)`}
                          >
                            <span className="truncate">{shipment.makerName}</span>
                          </div>
                        );
                      })}
                      {/* Empty remaining capacity */}
                      <div
                        className="h-full bg-slate-200/80 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-medium px-2"
                        style={{
                          width: `${Math.max(
                            5,
                            100 - truck.shipments.reduce((sum, s) => sum + Math.round((s.weightKg / 3500) * 100), 0)
                          )}%`,
                        }}
                      >
                        <span className="truncate">Spare Space</span>
                      </div>
                    </div>

                    {/* Makers Breakdown List */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {truck.shipments.map((shipment, sIdx) => {
                        const palette = MAKER_COLORS[(idx * 2 + sIdx) % MAKER_COLORS.length];
                        return (
                          <div
                            key={shipment.id}
                            className={`text-xs p-2 rounded-lg border flex items-center justify-between ${palette.light}`}
                          >
                            <div>
                              <div className="font-semibold truncate max-w-[150px]">
                                {shipment.makerName}
                              </div>
                              <div className="text-[10px] opacity-80">
                                {shipment.weightKg} kg • {shipment.volumeM3} m³
                              </div>
                            </div>
                            <span className="text-[11px] font-bold">
                              ₹{Math.round(14000 * (shipment.weightKg / truck.totalWeightKg)).toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Truck Metrics Footer */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center space-x-3">
                      <span>
                        Total Weight: <strong className="text-slate-800">{truck.totalWeightKg.toLocaleString()} kg</strong>
                      </span>
                      <span>
                        Total Volume: <strong className="text-slate-800">{truck.totalVolumeM3} m³</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Fixed Trip:</span>
                      <span className="font-bold text-slate-900">₹{truck.costInr.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
