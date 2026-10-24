"use client";

import React from "react";
import { MakerSavings } from "@/types";
import {
  Leaf,
  Scale,
  Sparkles,
  CheckCircle,
  Truck,
} from "lucide-react";

interface SavingsCardProps {
  savings: MakerSavings[];
  onOpenAssumptions: () => void;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({
  savings,
  onOpenAssumptions,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-lg font-bold text-slate-900">
              Savings Card per Maker
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
              Fair Share Cooperative Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cost share, cost saved per kg, and diesel CO₂ avoided for each artisan workshop.
          </p>
        </div>

        <button
          onClick={onOpenAssumptions}
          className="text-xs text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center space-x-1"
        >
          <span>Assumptions: ₹14,000/trip • 0.65 kg CO₂/km</span>
        </button>
      </div>

      {/* Grid of Individual Maker Savings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {savings.map((item, idx) => (
          <div
            key={item.makerId}
            className="rounded-2xl p-5 border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 hover:border-emerald-300 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Row: Maker name & badge */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    M{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {item.makerName}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Payload: {item.weightKg.toLocaleString()} kg • {item.volumeM3} m³
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                    {item.percentageSaved}% Saved
                  </span>
                </div>
              </div>

              {/* Main Financial Cost Comparison Box */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Dedicated Truck Cost (Before):</span>
                  <span className="line-through text-slate-400 font-semibold">
                    ₹{item.beforeCostInr.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700">
                    Pooled Cost Share (After):
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    ₹{item.afterCostShareInr.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Net Rupee Savings:</span>
                  </span>
                  <span className="font-black text-base text-emerald-600">
                    +₹{item.costSavedInr.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Granular Unit Metrics: ₹/kg and CO2 avoided */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Cost Saved per kg */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1 mb-0.5">
                    <Scale className="w-3 h-3 text-emerald-600" />
                    <span>Cost Saved / kg</span>
                  </div>
                  <div className="text-sm font-black text-slate-800">
                    ₹{item.costSavedPerKgInr} <span className="text-[10px] font-normal text-slate-500">/ kg</span>
                  </div>
                </div>

                {/* CO2 Avoided */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1 mb-0.5">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>CO₂ Avoided</span>
                  </div>
                  <div className="text-sm font-black text-emerald-600">
                    {item.co2AvoidedKg} <span className="text-[10px] font-normal text-slate-500">kg CO₂</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Truck Assignment Indicator */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Assigned:{" "}
                  <strong className="text-slate-700 capitalize">
                    {item.truckAssignedId.replace("-", " ")}
                  </strong>
                </span>
              </div>
              <span className="text-emerald-700 font-semibold flex items-center space-x-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>Space Guaranteed</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
