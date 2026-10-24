"use client";

import React from "react";
import { TruckConfig } from "@/types";
import {
  X,
  Sliders,
  FileText,
  Key,
} from "lucide-react";

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TruckConfig;
  onUpdateConfig?: (newConfig: TruckConfig) => void;
}

export const AssumptionsModal: React.FC<AssumptionsModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Model Assumptions & Citations
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Clear documentation of all constants, rates, emissions factors, and Bhashini API credentials used in this prototype.
        </p>

        <div className="space-y-4 text-xs">
          {/* Section 1: Logistics & Freight Parameters */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Vehicle & Freight Tariff Assumptions</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Dedicated Truck Rate</span>
                <span className="text-sm font-bold text-slate-900">
                  ₹{config.costPerTripInr.toLocaleString()} per trip
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Standard market rate for 14-ft container truck on Moradabad–Delhi corridor.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Vehicle Class & Payload</span>
                <span className="text-sm font-bold text-slate-900">
                  {config.maxWeightKg.toLocaleString()} kg ({config.maxVolumeM3} m³)
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Medium Commercial Vehicle (MCV 3.5T, e.g., Eicher Pro 2059 / Tata 709).
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Route Corridor Distance</span>
                <span className="text-sm font-bold text-slate-900">
                  {config.routeDistanceKm} km
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Moradabad Brass Cluster (UP) $\rightarrow$ Delhi NCR ICD Patparganj / Okhla via NH9.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Emissions Factor (Tailpipe)</span>
                <span className="text-sm font-bold text-emerald-700">
                  {config.emissionFactorKgCo2PerKm} kg CO₂ / km
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Single trip emissions: {config.routeDistanceKm * config.emissionFactorKgCo2PerKm} kg CO₂ / truck.
                </p>
              </div>
            </div>

            {/* Citation Box */}
            <div className="mt-2 p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-slate-700 text-[11px] leading-relaxed">
              <strong className="text-emerald-950 font-semibold block mb-0.5">
                Emission Factor Source & Methodology Citation:
              </strong>
              {config.citation}. Corroborated with Global Logistics Emissions Council (GLEC) Framework v3.0 and India GHG Program (joint initiative by WRI India, TERI, and CII).
            </div>
          </div>

          {/* Section 2: Bhashini API Assumptions & Setup */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider text-[11px]">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Bhashini National Language Platform Credentials</span>
            </h4>

            <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900">
                    Bhashini API Authentication
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Stored in <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">.env.local</code> (never committed to repository):
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  ULCA Dhruva
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] space-y-1">
                <div>BHASHINI_USER_ID=your_ulca_user_id</div>
                <div>BHASHINI_API_KEY=your_ulca_api_key</div>
                <div>BHASHINI_PIPELINE_ID=64392f96daac500b55c543d7</div>
              </div>

              <p className="text-[11px] text-slate-600">
                <strong>Demo Safe Mode:</strong> If live Bhashini credentials are not entered, the chatbot gracefully falls back to the embedded multilingual dictionary across Hindi, Tamil, Kannada, Marathi, Gujarati, and English without throwing runtime errors.
              </p>
            </div>

            {/* Target Languages */}
            <div className="bg-white p-3 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[11px] mb-1">
                Target Languages Supported in Demo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Hindi (हिन्दी)", code: "hi" },
                  { name: "Tamil (தமிழ்)", code: "ta" },
                  { name: "Kannada (ಕನ್ನಡ)", code: "kn" },
                  { name: "Marathi (मराठी)", code: "mr" },
                  { name: "Gujarati (ગુજરાતી)", code: "gu" },
                  { name: "English", code: "en" },
                ].map((l) => (
                  <span
                    key={l.code}
                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200"
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Got it, Close
          </button>
        </div>
      </div>
    </div>
  );
};
