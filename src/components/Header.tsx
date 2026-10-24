"use client";

import React from "react";
import { Truck, ShieldAlert, Sliders, MapPin, Building2, Globe, Database } from "lucide-react";
import { SupportedLanguage } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface HeaderProps {
  activeTab: "simulator" | "corridor" | "admin" | "database";
  setActiveTab: (tab: "simulator" | "corridor" | "admin" | "database") => void;
  onOpenAssumptions: () => void;
  onOpenPlanned: () => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAssumptions,
  onOpenPlanned,
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Tempowala <span className="text-emerald-600 font-extrabold">SDG</span>
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                  Prototype
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Shared Truck Pooling for Small Makers & Artisans (Moradabad $\rightarrow$ Delhi Corridor)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "simulator"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pooling Simulator
            </button>
            <button
              onClick={() => setActiveTab("corridor")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center space-x-1 transition-all ${
                activeTab === "corridor"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 mr-1" />
              Corridor Map
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center space-x-1 transition-all ${
                activeTab === "admin"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 mr-1" />
              Coop Dashboard
            </button>
            <button
              onClick={() => setActiveTab("database")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center space-x-1 transition-all ${
                activeTab === "database"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Database className="w-3.5 h-3.5 mr-1" />
              Dispatches DB
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Picker */}
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                title="Select Language for Bhashini"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Assumptions modal trigger */}
            <button
              onClick={onOpenAssumptions}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-200 flex items-center space-x-1 transition-colors"
              title="View Model Assumptions & Citations"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">Assumptions</span>
            </button>

            {/* Planned Features modal trigger */}
            <button
              onClick={onOpenPlanned}
              className="px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 flex items-center space-x-1 transition-colors"
              title="Features Marked as Planned (Do Not Build)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Planned Scope</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
