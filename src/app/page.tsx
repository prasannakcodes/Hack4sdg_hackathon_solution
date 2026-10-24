"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MakerEntryForm } from "@/components/MakerEntryForm";
import { BeforeAfterView } from "@/components/BeforeAfterView";
import { SavingsCard } from "@/components/SavingsCard";
import { CorridorMap } from "@/components/CorridorMap";
import { AdminDashboard } from "@/components/AdminDashboard";
import { DatabaseView } from "@/components/DatabaseView";
import { AssumptionsModal } from "@/components/AssumptionsModal";
import { PlannedFeaturesModal } from "@/components/PlannedFeaturesModal";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import {
  MakerShipment,
  TruckConfig,
  PoolingResult,
  SupportedLanguage,
} from "@/types";
import { DEFAULT_TRUCK_CONFIG, SEEDED_MAKERS } from "@/lib/constants";
import { calculatePooling } from "@/lib/packingEngine";
import {
  fetchShipmentsFromDb,
  insertShipmentToDb,
  deleteShipmentFromDb,
  toggleApprovalInDb,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  Sparkles,
  Leaf,
  HeartHandshake,
} from "lucide-react";

export default function HomePage() {
  const [shipments, setShipments] = useState<MakerShipment[]>(SEEDED_MAKERS);
  const [config] = useState<TruckConfig>(DEFAULT_TRUCK_CONFIG);
  const [poolingResult, setPoolingResult] = useState<PoolingResult>(() =>
    calculatePooling(SEEDED_MAKERS, DEFAULT_TRUCK_CONFIG)
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "simulator" | "corridor" | "admin" | "database"
  >("simulator");
  const [isAssumptionsOpen, setIsAssumptionsOpen] = useState(false);
  const [isPlannedOpen, setIsPlannedOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Recalculate pooling whenever shipments or config change
  const runPoolingCalculation = (
    currentShipments: MakerShipment[],
    currentConfig: TruckConfig
  ) => {
    setIsCalculating(true);
    setTimeout(() => {
      const result = calculatePooling(currentShipments, currentConfig);
      setPoolingResult(result);
      setIsCalculating(false);
      showToast("Shipments pooled! 4 dedicated trucks reduced to 2 shared trucks.");
    }, 400);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load from Supabase on client mount
  const loadShipmentsFromDb = async () => {
    if (!isSupabaseConfigured()) {
      setIsDbConnected(false);
      return;
    }
    const { data, error } = await fetchShipmentsFromDb();
    if (error) {
      setIsDbConnected(false);
      setDbError(error);
    } else if (data && data.length > 0) {
      setIsDbConnected(true);
      setDbError(null);
      setShipments(data);
      runPoolingCalculation(data, config);
      showToast(`Loaded ${data.length} shipments from Supabase database!`);
    } else {
      setIsDbConnected(true);
      setDbError(null);
    }
  };

  useEffect(() => {
    loadShipmentsFromDb();
  }, []);

  const handleAddShipment = async (newShipment: MakerShipment) => {
    const updated = [newShipment, ...shipments];
    setShipments(updated);
    runPoolingCalculation(updated, config);
    showToast(`Added ${newShipment.makerName} to the corridor pool!`);

    if (isSupabaseConfigured()) {
      const { error } = await insertShipmentToDb(newShipment);
      if (error) {
        setDbError(error);
      } else {
        setIsDbConnected(true);
        setDbError(null);
      }
    }
  };

  const handleResetToSeeded = () => {
    setShipments(SEEDED_MAKERS);
    runPoolingCalculation(SEEDED_MAKERS, config);
    showToast("Reset back to 4 seeded corridor makers.");
  };

  const handleRemoveShipment = async (id: string) => {
    if (shipments.length <= 2) {
      alert("Minimum 2 shipments required to demonstrate pooling.");
      return;
    }
    const updated = shipments.filter((s) => s.id !== id);
    setShipments(updated);
    runPoolingCalculation(updated, config);

    if (isSupabaseConfigured()) {
      await deleteShipmentFromDb(id);
    }
  };

  const handleToggleApproval = async (id: string) => {
    const target = shipments.find((s) => s.id === id);
    const updated = shipments.map((s) =>
      s.id === id ? { ...s, approved: !s.approved } : s
    );
    setShipments(updated);
    showToast("Updated maker approval status.");

    if (isSupabaseConfigured() && target) {
      await toggleApprovalInDb(id, !target.approved);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAssumptions={() => setIsAssumptionsOpen(true)}
        onOpenPlanned={() => setIsPlannedOpen(true)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Hero SDG Mission Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Leaf className="w-3 h-3 text-emerald-400" />
                <span>SDG 12 & 13 Logistics Action</span>
              </span>
              <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
                Moradabad Metalware Cluster
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Shared Truck Pooling for Small Makers & Artisans
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidating independent artisan shipments along the Moradabad $\rightarrow$ Delhi freight corridor into shared trucks. Eliminates empty air hauling, reduces diesel emissions by 50%, and puts ₹28,000 back into artisan workshops.
            </p>
          </div>

          {/* Quick Key Metrics Capsule */}
          <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center space-x-6 shrink-0">
            <div>
              <div className="text-[11px] text-emerald-300 font-semibold uppercase">
                Fleet Reduction
              </div>
              <div className="text-2xl font-black text-white">4 → 2 Trucks</div>
              <div className="text-[10px] text-slate-300">50% fewer trucks</div>
            </div>

            <div className="w-px h-10 bg-white/20"></div>

            <div>
              <div className="text-[11px] text-emerald-300 font-semibold uppercase">
                Diesel CO₂ Cut
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {poolingResult.summary.totalCo2AvoidedKg} kg
              </div>
              <div className="text-[10px] text-slate-300">50% tailpipe reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "simulator" && (
          <>
            {/* 1. Maker Entry Form & Seeded List */}
            <MakerEntryForm
              shipments={shipments}
              onAddShipment={handleAddShipment}
              onResetToSeeded={handleResetToSeeded}
              onRemoveShipment={handleRemoveShipment}
              onRunPooling={() => runPoolingCalculation(shipments, config)}
              isCalculating={isCalculating}
            />

            {/* 2. Before and After Page Section */}
            <BeforeAfterView
              poolingResult={poolingResult}
              onOpenAssumptions={() => setIsAssumptionsOpen(true)}
            />

            {/* 3. Savings Card per Maker */}
            <SavingsCard
              savings={poolingResult.makerSavings}
              onOpenAssumptions={() => setIsAssumptionsOpen(true)}
            />
          </>
        )}

        {activeTab === "corridor" && (
          <CorridorMap shipments={shipments} />
        )}

        {activeTab === "admin" && (
          <AdminDashboard
            poolingResult={poolingResult}
            shipments={shipments}
            onToggleApproval={handleToggleApproval}
          />
        )}

        {activeTab === "database" && (
          <DatabaseView
            shipments={shipments}
            onAddShipmentClick={() => {
              setActiveTab("simulator");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onRefresh={loadShipmentsFromDb}
            onDeleteShipment={handleRemoveShipment}
            onToggleApproval={handleToggleApproval}
            isDbConnected={isDbConnected}
            dbError={dbError}
          />
        )}
      </main>

      {/* Assumptions & Citations Modal */}
      <AssumptionsModal
        isOpen={isAssumptionsOpen}
        onClose={() => setIsAssumptionsOpen(false)}
        config={config}
      />

      {/* Planned Features Modal */}
      <PlannedFeaturesModal
        isOpen={isPlannedOpen}
        onClose={() => setIsPlannedOpen(false)}
      />

      {/* Floating Vernacular Chatbot with Bhashini */}
      <ChatbotWidget
        shipments={shipments}
        onAddShipment={handleAddShipment}
        poolingResult={poolingResult}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onOpenForm={() => {
          setActiveTab("simulator");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">
              Tempowala • Shared Truck Pooling Prototype
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <button
              onClick={() => setIsAssumptionsOpen(true)}
              className="hover:text-emerald-700 transition-colors"
            >
              Model Assumptions & CPCB Citations
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPlannedOpen(true)}
              className="hover:text-amber-700 transition-colors"
            >
              Planned Scope (v2.0)
            </button>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">
              Powered by Bhashini AI & 2D Packing
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
