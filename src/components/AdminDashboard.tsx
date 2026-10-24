"use client";

import React, { useState } from "react";
import { PoolingResult, MakerShipment } from "@/types";
import {
  Building2,
  Printer,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Truck,
  Users,
  Download,
} from "lucide-react";

interface AdminDashboardProps {
  poolingResult: PoolingResult;
  shipments: MakerShipment[];
  onToggleApproval: (makerId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  poolingResult,
  shipments,
  onToggleApproval,
}) => {
  const { summary } = poolingResult;
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportManifest = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(poolingResult, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `tempowala_manifest_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Artisan Cooperative Logistics Authority Dashboard
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Moradabad Metalware Cooperative Union • Batch Dispatch Consolidation & Consensus
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>

          <button
            onClick={handleExportManifest}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center space-x-1 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? "Manifest Exported!" : "Export Manifest JSON"}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Cooperative Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Artisans</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{summary.totalMakers} Makers</div>
          <div className="text-[11px] text-slate-400 mt-1">100% Corridor Match</div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Highway Fleet Reduction</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {summary.beforeTrucksCount} → {summary.afterTrucksCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {summary.trucksReduced} Heavy Trucks Reduced
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Collective Cash Saved</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{summary.totalSavingsInr.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {summary.totalCostSavingsPercent}% Savings per batch
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Diesel CO₂ Prevented</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {summary.totalCo2AvoidedKg} kg
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            SDG 12 & 13 Certified
          </div>
        </div>
      </div>

      {/* Consensus & Approval Section */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Batchmate Approval & Consignment Release Status
        </h4>
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
          {shipments.map((s, idx) => (
            <div
              key={s.id}
              className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                  M{idx + 1}
                </span>
                <div>
                  <div className="font-bold text-slate-900">{s.makerName}</div>
                  <div className="text-[11px] text-slate-500">
                    {s.weightKg} kg • {s.category} • Destination: {s.destination}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  Status:{" "}
                  <strong className="text-emerald-700">Consolidated & Verified</strong>
                </span>

                <button
                  type="button"
                  onClick={() => onToggleApproval(s.id)}
                  className={`px-3 py-1 rounded-lg font-semibold text-xs border flex items-center space-x-1 transition-all ${
                    s.approved !== false
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      s.approved !== false ? "text-emerald-600" : "text-slate-400"
                    }`}
                  />
                  <span>{s.approved !== false ? "Approved by Maker" : "Pending Sign-off"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
