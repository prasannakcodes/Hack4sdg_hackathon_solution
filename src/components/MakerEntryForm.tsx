"use client";

import React, { useState } from "react";
import { MakerShipment } from "@/types";
import {
  PlusCircle,
  RotateCcw,
  Package,
  Calendar,
  MapPin,
  Scale,
  Box,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface MakerEntryFormProps {
  shipments: MakerShipment[];
  onAddShipment: (shipment: MakerShipment) => void;
  onResetToSeeded: () => void;
  onRemoveShipment: (id: string) => void;
  onRunPooling: () => void;
  isCalculating: boolean;
}

export const MakerEntryForm: React.FC<MakerEntryFormProps> = ({
  shipments,
  onAddShipment,
  onResetToSeeded,
  onRemoveShipment,
  onRunPooling,
  isCalculating,
}) => {
  const [makerName, setMakerName] = useState("");
  const [category, setCategory] = useState("Handicrafts / Metalware");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [lengthCm, setLengthCm] = useState<number | "">("");
  const [widthCm, setWidthCm] = useState<number | "">("");
  const [heightCm, setHeightCm] = useState<number | "">("");
  const [destination, setDestination] = useState(
    "ICD Patparganj Freight Complex, Delhi NCR"
  );
  const [pickupDate, setPickupDate] = useState("2026-10-25");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Compute live volume in m3
  const computedVolumeM3 =
    lengthCm && widthCm && heightCm
      ? Number(
          ((Number(lengthCm) * Number(widthCm) * Number(heightCm)) / 1_000_000).toFixed(2)
        )
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!makerName.trim() || !weightKg || !lengthCm || !widthCm || !heightCm) {
      alert("Please fill in maker name, weight, and dimensions.");
      return;
    }

    const newShipment: MakerShipment = {
      id: `maker-${Date.now()}`,
      makerName: makerName.trim(),
      category: category.trim() || "Artisan Goods",
      weightKg: Number(weightKg),
      dimensionsCm: {
        length: Number(lengthCm),
        width: Number(widthCm),
        height: Number(heightCm),
      },
      volumeM3: computedVolumeM3,
      origin: "Moradabad Artisan Cluster, Uttar Pradesh",
      destination: destination.trim(),
      pickupDate: pickupDate || "2026-10-25",
      approved: true,
    };

    onAddShipment(newShipment);

    // Reset form fields
    setMakerName("");
    setWeightKg("");
    setLengthCm("");
    setWidthCm("");
    setHeightCm("");
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-lg font-bold text-slate-900">
              Corridor Cluster Makers (Moradabad $\rightarrow$ Delhi)
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
              {shipments.length} Makers Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Makers in the same artisan cluster submit their cargo load for shared truck dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onResetToSeeded}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1.5 transition-colors"
            title="Reset back to the 4 seeded makers on the corridor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset 4 Seeded Makers</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isFormOpen ? "Close Form" : "Add Maker Shipment"}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Maker Entry Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 p-5 bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl border border-emerald-100 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Register Maker Consignment</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              * Required for multi-capacity packing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Maker Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maker / Workshop Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aligarh Lock & Brass Works"
                value={makerName}
                onChange={(e) => setMakerName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Category / Cargo type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Category
              </label>
              <input
                type="text"
                placeholder="e.g. Metal Artware, Brass Lamps"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Weight in kg */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={10}
                  max={3500}
                  placeholder="e.g. 1200"
                  value={weightKg}
                  onChange={(e) =>
                    setWeightKg(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 pr-9"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">
                  kg
                </span>
              </div>
            </div>

            {/* Dimensions (cm) */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dimensions (Length × Width × Height in cm) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  required
                  placeholder="L (cm)"
                  value={lengthCm}
                  onChange={(e) =>
                    setLengthCm(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <input
                  type="number"
                  required
                  placeholder="W (cm)"
                  value={widthCm}
                  onChange={(e) =>
                    setWidthCm(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <input
                  type="number"
                  required
                  placeholder="H (cm)"
                  value={heightCm}
                  onChange={(e) =>
                    setHeightCm(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="text-xs px-2.5 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="mt-1 flex items-center space-x-2 text-[11px] text-slate-500">
                <span>Calculated volume:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {computedVolumeM3} m³
                </span>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination (Delhi NCR Corridor)
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="ICD Patparganj Freight Complex, Delhi NCR">
                  ICD Patparganj Freight Complex, Delhi NCR
                </option>
                <option value="Okhla Industrial Area Phase-III, New Delhi">
                  Okhla Industrial Area Phase-III, New Delhi
                </option>
                <option value="Tughlakabad ICD Container Depot, New Delhi">
                  Tughlakabad ICD Container Depot, New Delhi
                </option>
                <option value="Kirti Nagar Furniture & Decor Hub, New Delhi">
                  Kirti Nagar Furniture & Decor Hub, New Delhi
                </option>
              </select>
            </div>

            {/* Pick-up Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pick-up Date
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add to Corridor Pool</span>
            </button>
          </div>
        </form>
      )}

      {/* Makers List / Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-3">Maker & Cluster Location</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Weight (kg)</th>
              <th className="py-2.5 px-3">Dimensions & Volume</th>
              <th className="py-2.5 px-3">Corridor Destination</th>
              <th className="py-2.5 px-3">Pick-up Date</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {shipments.map((shipment, idx) => (
              <tr
                key={shipment.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                      M{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {shipment.makerName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{shipment.origin}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">{shipment.category}</td>
                <td className="py-3 px-3 font-semibold text-slate-800">
                  <div className="flex items-center space-x-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shipment.weightKg.toLocaleString()} kg</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Box className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {shipment.dimensionsCm.length}×{shipment.dimensionsCm.width}×
                      {shipment.dimensionsCm.height} cm
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">
                      {shipment.volumeM3} m³
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-700">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                    {shipment.destination.replace(", Delhi NCR", "").replace(", New Delhi", "")}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div className="flex items-center space-x-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{shipment.pickupDate}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right">
                  {shipments.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemoveShipment(shipment.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Remove shipment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Pooling CTA Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-4 rounded-xl border border-emerald-200/50">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-800">
              Ready to Pool Consignments
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Group shipments, solve 2D weight & volume packing, and calculate cost & CO₂ savings.
          </p>
        </div>

        <button
          type="button"
          onClick={onRunPooling}
          disabled={isCalculating}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {isCalculating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Optimizing Truck Packs...</span>
            </div>
          ) : (
            <>
              <span>⚡ Pool Shipments Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
