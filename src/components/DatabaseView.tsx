"use client";

import React, { useState } from "react";
import { MakerShipment } from "@/types";
import {
  Database,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Code,
  Copy,
  Check,
  PlusCircle,
  Sparkles,
  Settings,
  Scale,
  Box,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  SUPABASE_SQL_SCHEMA,
  isSupabaseConfigured,
  seedInitialShipments,
} from "@/lib/supabase";

interface DatabaseViewProps {
  shipments: MakerShipment[];
  onAddShipmentClick: () => void;
  onRefresh: () => void;
  onDeleteShipment: (id: string) => void;
  onToggleApproval: (id: string) => void;
  isDbConnected: boolean;
  dbError: string | null;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  shipments,
  onAddShipmentClick,
  onRefresh,
  onDeleteShipment,
  onToggleApproval,
  isDbConnected,
  dbError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDest, setFilterDest] = useState<string>("all");
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("tempowala_supabase_url") || ""
      : ""
  );
  const [supabaseKey, setSupabaseKey] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("tempowala_supabase_anon_key") || ""
      : ""
  );
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("tempowala_supabase_url", supabaseUrl.trim());
      localStorage.setItem("tempowala_supabase_anon_key", supabaseKey.trim());
    }
    setIsSettingsModalOpen(false);
    onRefresh();
  };

  const handleClearSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tempowala_supabase_url");
      localStorage.removeItem("tempowala_supabase_anon_key");
    }
    setSupabaseUrl("");
    setSupabaseKey("");
    setIsSettingsModalOpen(false);
    onRefresh();
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    const { count, error } = await seedInitialShipments(shipments);
    setIsSeeding(false);
    if (error) {
      alert(`Seeding failed: ${error}`);
    } else {
      setSeedSuccess(`Successfully seeded ${count} shipments to Supabase!`);
      setTimeout(() => setSeedSuccess(null), 3500);
      onRefresh();
    }
  };

  // Filtered rows
  const filtered = shipments.filter((s) => {
    const matchesSearch =
      s.makerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDest =
      filterDest === "all" ||
      s.destination.toLowerCase().includes(filterDest.toLowerCase());
    return matchesSearch && matchesDest;
  });

  const totalWeight = shipments.reduce((sum, s) => sum + s.weightKg, 0);
  const totalVolume = shipments.reduce((sum, s) => sum + s.volumeM3, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <Database className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Supabase PostgreSQL: Dispatches Database
                  </h2>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center space-x-1.5 ${
                      isDbConnected
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDbConnected ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    ></span>
                    <span>
                      {isDbConnected
                        ? "Supabase Live Connected"
                        : "Local Mode (Supabase Ready)"}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live table storage for corridor artisan shipments (`public.shipments`)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Connect Supabase</span>
            </button>

            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              <span>SQL Schema</span>
            </button>

            {isDbConnected && (
              <button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isSeeding ? "Seeding..." : "Seed Database"}</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold flex items-center space-x-1.5 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Database Notice or Alerts */}
        {seedSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{seedSuccess}</span>
          </div>
        )}

        {dbError && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Database Notice: </span>
              <span>{dbError}</span>
              <span className="block mt-0.5 text-amber-700">
                You can run the SQL script in your Supabase SQL Editor to create the table, or use local state.
              </span>
            </div>
          </div>
        )}

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium block mb-1">
              Total Database Rows
            </span>
            <span className="text-xl font-black text-slate-900">
              {shipments.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Active consignments
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium block mb-1 flex items-center space-x-1">
              <Scale className="w-3 h-3 text-emerald-600" />
              <span>Aggregate Weight</span>
            </span>
            <span className="text-xl font-black text-emerald-700">
              {totalWeight.toLocaleString()} kg
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Across all makers
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium block mb-1 flex items-center space-x-1">
              <Box className="w-3 h-3 text-teal-600" />
              <span>Total Volume</span>
            </span>
            <span className="text-xl font-black text-teal-700">
              {totalVolume.toFixed(2)} m³
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Container space
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-slate-500 font-medium block mb-1">
              Approval Status
            </span>
            <span className="text-xl font-black text-emerald-600">
              {shipments.filter((s) => s.approved).length} / {shipments.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Ready to pool
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search maker name, craft category, origin..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Destination:</span>
            <select
              value={filterDest}
              onChange={(e) => setFilterDest(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="all">All Delhi Gateways</option>
              <option value="Patparganj">ICD Patparganj</option>
              <option value="Okhla">Okhla Ind. Area</option>
            </select>
          </div>

          <button
            onClick={onAddShipmentClick}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Consignment</span>
          </button>
        </div>
      </div>

      {/* Database Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Maker Details</th>
                <th className="px-4 py-3.5">Craft Category</th>
                <th className="px-4 py-3.5 text-right">Weight</th>
                <th className="px-4 py-3.5 text-right">Volume</th>
                <th className="px-4 py-3.5">Origin Cluster</th>
                <th className="px-4 py-3.5">Drop Gateway</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    No database records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{s.makerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID: {s.id}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {s.category}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-emerald-800">
                      {s.weightKg} kg
                    </td>

                    <td className="px-4 py-3.5 text-right font-mono text-slate-600">
                      {s.volumeM3} m³
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{s.origin}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-teal-500 shrink-0" />
                        <span className="truncate max-w-[180px] font-medium text-slate-800">
                          {s.destination}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => onToggleApproval(s.id)}
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                          s.approved
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                        title="Click to toggle approved status in database"
                      >
                        {s.approved ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onDeleteShipment(s.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete consignment from database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: SQL Schema for Supabase Table */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Supabase PostgreSQL Table Schema
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Run this once in your Supabase SQL Editor to create the table
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 relative">
              <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Supabase Credentials Setup */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Connect Supabase Database
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Find these in Supabase Dashboard → Settings → API
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Project URL:
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Anon / Public Key:
                </label>
                <textarea
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  rows={3}
                  className="w-full px-3 py-2 font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <p>
                  <strong>Tip:</strong> You can also set these permanently in{" "}
                  <code className="text-emerald-700 font-mono">.env.local</code>:
                </p>
                <p className="font-mono text-[11px] text-slate-500">
                  NEXT_PUBLIC_SUPABASE_URL=...
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleClearSettings}
                  className="text-rose-600 hover:underline font-medium"
                >
                  Clear Saved Keys
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm"
                  >
                    Save & Connect
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
