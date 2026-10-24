"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MakerShipment } from "@/types";
import {
  Layers,
  Compass,
  Key,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface RealMapLeafletProps {
  shipments: MakerShipment[];
  selectedMakerId?: string | null;
  onSelectMaker?: (id: string | null) => void;
}

// Corridor route coordinates along NH-9 from Moradabad to Delhi NCR
const NH9_CORRIDOR_WAYPOINTS: [number, number][] = [
  [28.8472, 78.7621], // Moradabad Peetal Nagri
  [28.8386, 78.7733], // Moradabad City Center
  [28.8260, 78.6920], // Pakbara Artisan Hub
  [28.8170, 78.5300], // Joya Toll
  [28.8480, 78.2380], // Gajraula
  [28.8050, 78.1350], // Brijghat
  [28.7850, 78.1050], // Garhmukteshwar (Ganga Crossing)
  [28.7520, 77.9500], // Kuchesar Road
  [28.7290, 77.7760], // Hapur Bypass
  [28.7120, 77.6550], // Pilkhuwa
  [28.6880, 77.5300], // Dasna (Eastern Peripheral)
  [28.6480, 77.4100], // Ghaziabad Vijay Nagar
  [28.6290, 77.3290], // Ghazipur / UP Gate Border
];

// Delivery branches in Delhi NCR
const PATPARGANJ_BRANCH: [number, number][] = [
  [28.6290, 77.3290], // Ghazipur
  [28.6289, 77.3060], // ICD Patparganj Freight Complex
];

const OKHLA_BRANCH: [number, number][] = [
  [28.6290, 77.3290], // Ghazipur Border
  [28.6150, 77.3050], // Noida Link
  [28.5700, 77.2950], // Kalindi Kunj / Sarita Vihar
  [28.5355, 77.2713], // Okhla Industrial Area Phase-III
];

// Seeded maker GPS locations around Moradabad cluster
const MAKER_COORDS: Record<string, [number, number]> = {
  "maker-1": [28.8472, 78.7621], // Moradabad Brass Artwares (Peetal Nagri)
  "maker-2": [28.8190, 78.7580], // Royal Peetal Handicrafts (Sambhal Road)
  "maker-3": [28.8260, 78.6920], // Sunrise Copper & Metal (Pakbara)
  "maker-4": [28.8320, 78.7840], // Heritage Bell Metal (Station Road)
};

export const RealMapLeaflet: React.FC<RealMapLeafletProps> = ({
  shipments,
  selectedMakerId,
  onSelectMaker,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // CARTO Basemaps Key State
  const defaultCartoKey =
    process.env.NEXT_PUBLIC_CARTO_API_KEY || "cb1_4twi_1_88afa596671c24585d72d336";
  const [cartoKey, setCartoKey] = useState<string>(defaultCartoKey);
  const [keyInput, setKeyInput] = useState<string>(defaultCartoKey);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const [mapType, setMapType] = useState<
    "voyager" | "positron" | "dark" | "satellite" | "osm"
  >("voyager");

  useEffect(() => {
    const saved = localStorage.getItem("tempowala_carto_key");
    if (saved) {
      setCartoKey(saved);
      setKeyInput(saved);
    }
  }, []);

  const getTileConfig = (type: typeof mapType, key: string) => {
    const keyParam = key ? `?api_key=${encodeURIComponent(key)}` : "";

    switch (type) {
      case "voyager":
        return {
          url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png${keyParam}`,
          attribution:
            '&copy; <a href="https://carto.com/basemaps/">CARTO</a> &copy; OpenStreetMap',
          tileSize: 256,
          maxZoom: 20,
        };
      case "positron":
        return {
          url: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png${keyParam}`,
          attribution:
            '&copy; <a href="https://carto.com/basemaps/">CARTO</a> &copy; OpenStreetMap',
          tileSize: 256,
          maxZoom: 20,
        };
      case "dark":
        return {
          url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${keyParam}`,
          attribution:
            '&copy; <a href="https://carto.com/basemaps/">CARTO</a> &copy; OpenStreetMap',
          tileSize: 256,
          maxZoom: 20,
        };
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
          tileSize: 256,
          maxZoom: 18,
        };
      case "osm":
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          tileSize: 256,
          maxZoom: 19,
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.72, 78.02],
      zoom: 9,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const cfg = getTileConfig(mapType, cartoKey);
    const tileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      tileSize: cfg.tileSize,
      maxZoom: cfg.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Highway Corridor Polylines
    // Glow border for main highway
    L.polyline(NH9_CORRIDOR_WAYPOINTS, {
      color: "#059669",
      weight: 7,
      opacity: 0.35,
      lineCap: "round",
    }).addTo(map);

    // Primary highway line
    L.polyline(NH9_CORRIDOR_WAYPOINTS, {
      color: "#10b981",
      weight: 4,
      opacity: 0.95,
      dashArray: "8, 6",
    }).addTo(map);

    // Patparganj branch
    L.polyline(PATPARGANJ_BRANCH, {
      color: "#0284c7",
      weight: 3.5,
      opacity: 0.85,
      dashArray: "4, 4",
    }).addTo(map);

    // Okhla branch
    L.polyline(OKHLA_BRANCH, {
      color: "#0d9488",
      weight: 3.5,
      opacity: 0.85,
      dashArray: "4, 4",
    }).addTo(map);

    // Destination Marker 1: ICD Patparganj
    const destIcon1 = L.divIcon({
      className: "custom-dest-pin",
      html: `
        <div style="background:#0284c7;color:#fff;border-radius:10px;padding:4px 8px;font-size:11px;font-weight:bold;display:flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(2,132,199,0.4);border:2px solid #fff;white-space:nowrap;">
          <span>📦</span>
          <span>ICD Patparganj</span>
        </div>
      `,
      iconSize: [130, 28],
      iconAnchor: [65, 14],
    });
    L.marker([28.6289, 77.3060], { icon: destIcon1 })
      .addTo(map)
      .bindPopup(
        "<strong>ICD Patparganj Freight Complex</strong><br/>Gateway: Rail & Container Export Depot, East Delhi"
      );

    // Destination Marker 2: Okhla Industrial Area
    const destIcon2 = L.divIcon({
      className: "custom-dest-pin",
      html: `
        <div style="background:#0d9488;color:#fff;border-radius:10px;padding:4px 8px;font-size:11px;font-weight:bold;display:flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(13,148,136,0.4);border:2px solid #fff;white-space:nowrap;">
          <span>🏭</span>
          <span>Okhla Ind. Area Ph-III</span>
        </div>
      `,
      iconSize: [150, 28],
      iconAnchor: [75, 14],
    });
    L.marker([28.5355, 77.2713], { icon: destIcon2 })
      .addTo(map)
      .bindPopup(
        "<strong>Okhla Industrial Area Ph-III</strong><br/>Gateway: Domestic Wholesale & Fulfillment Hub, South Delhi"
      );

    // Highway Waypoint Markers
    const waypoints: { name: string; km: string; coords: [number, number] }[] = [
      { name: "Gajraula Crossing", km: "53 km", coords: [28.8480, 78.2380] },
      { name: "Garhmukteshwar Ganga Bridge", km: "85 km", coords: [28.7850, 78.1050] },
      { name: "Hapur Bypass Hub", km: "125 km", coords: [28.7290, 77.7760] },
      { name: "Ghaziabad (UP Gate)", km: "155 km", coords: [28.6290, 77.3290] },
    ];

    waypoints.forEach((wp) => {
      const wpIcon = L.divIcon({
        className: "custom-wp-pin",
        html: `
          <div style="background:#334155;color:#94a3b8;border-radius:999px;width:12px;height:12px;border:2px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      L.marker(wp.coords, { icon: wpIcon })
        .addTo(map)
        .bindTooltip(`<strong>${wp.name}</strong><br/>Corridor Distance: ${wp.km}`, {
          direction: "top",
          offset: [0, -6],
        });
    });

    // In-transit Tempowala Pooled Trucks
    const truck1Icon = L.divIcon({
      className: "custom-truck-pin",
      html: `
        <div style="background:#047857;color:#fff;border-radius:12px;padding:4px 8px;font-size:10px;font-weight:bold;display:flex;align-items:center;gap:4px;box-shadow:0 4px 12px rgba(4,120,87,0.5);border:2px solid #6ee7b7;">
          <span>🚛</span>
          <span>Tempowala Alpha-1</span>
        </div>
      `,
      iconSize: [130, 26],
      iconAnchor: [65, 13],
    });
    L.marker([28.765, 78.01], { icon: truck1Icon })
      .addTo(map)
      .bindPopup(
        "<strong>Tempowala Shared Truck Alpha-1</strong><br/>Pooled: Sunrise Copper (1,600 kg) + Moradabad Brass (1,400 kg)<br/><strong>Current Status: En Route along NH-9 near Garhmukteshwar</strong>"
      );

    const truck2Icon = L.divIcon({
      className: "custom-truck-pin",
      html: `
        <div style="background:#0f766e;color:#fff;border-radius:12px;padding:4px 8px;font-size:10px;font-weight:bold;display:flex;align-items:center;gap:4px;box-shadow:0 4px 12px rgba(15,118,110,0.5);border:2px solid #5eead4;">
          <span>🚛</span>
          <span>Tempowala Alpha-2</span>
        </div>
      `,
      iconSize: [130, 26],
      iconAnchor: [65, 13],
    });
    L.marker([28.725, 77.72], { icon: truck2Icon })
      .addTo(map)
      .bindPopup(
        "<strong>Tempowala Shared Truck Alpha-2</strong><br/>Pooled: Royal Peetal (1,100 kg) + Heritage Bell (950 kg)<br/><strong>Current Status: En Route along NH-9 near Hapur</strong>"
      );

    mapInstanceRef.current = map;

    // Initial Bounds
    const bounds = L.latLngBounds([
      [28.50, 77.20],
      [28.88, 78.85],
    ]);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapType or cartoKey changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    const cfg = getTileConfig(mapType, cartoKey);
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      tileSize: cfg.tileSize,
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [mapType, cartoKey]);

  // Update Maker Markers dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    shipments.forEach((s, idx) => {
      const baseCoords: [number, number] =
        MAKER_COORDS[s.id] || [
          28.835 + (idx % 3) * 0.012 - 0.015,
          78.755 + (idx % 4) * 0.014 - 0.02,
        ];

      const isSelected = selectedMakerId === s.id;

      const markerHtml = `
        <div style="background:${isSelected ? '#d97706' : '#f59e0b'};color:#fff;border-radius:12px;padding:3px 7px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;box-shadow:0 3px 8px rgba(0,0,0,0.25);border:2px solid ${isSelected ? '#fef08a' : '#fff'};transform:scale(${isSelected ? 1.15 : 1.0});transition:transform 0.2s;white-space:nowrap;cursor:pointer;">
          <span>🏭</span>
          <span>${s.makerName.length > 18 ? s.makerName.substring(0, 16) + '…' : s.makerName}</span>
        </div>
      `;

      const makerIcon = L.divIcon({
        className: "custom-maker-pin",
        html: markerHtml,
        iconSize: [140, 26],
        iconAnchor: [70, 13],
      });

      const marker = L.marker(baseCoords, { icon: makerIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:12px;line-height:1.4;">
          <div style="font-weight:bold;font-size:13px;color:#0f172a;margin-bottom:4px;">${s.makerName}</div>
          <div style="color:#64748b;margin-bottom:6px;">${s.category}</div>
          <div style="background:#f8fafc;padding:6px;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:6px;">
            <div><strong>Weight:</strong> ${s.weightKg} kg</div>
            <div><strong>Volume:</strong> ${s.volumeM3} m³</div>
            <div><strong>Pickup:</strong> ${s.origin}</div>
            <div><strong>Drop:</strong> ${s.destination}</div>
          </div>
          <div style="color:#059669;font-weight:600;">✓ Ready for Tempowala Corridor Consolidation</div>
        </div>
      `);

      marker.on("click", () => {
        if (onSelectMaker) {
          onSelectMaker(s.id);
        }
      });

      markersRef.current[s.id] = marker;
    });
  }, [shipments, selectedMakerId, onSelectMaker]);

  // Center on selected maker if changed
  useEffect(() => {
    if (!selectedMakerId || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedMakerId];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 13, { animate: true });
      marker.openPopup();
    }
  }, [selectedMakerId]);

  const fitCorridorView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.fitBounds(
      [
        [28.50, 77.20],
        [28.88, 78.85],
      ],
      { padding: [40, 40], animate: true }
    );
    if (onSelectMaker) onSelectMaker(null);
  };

  const focusMoradabad = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([28.835, 78.75], 12, { animate: true });
  };

  const focusDelhi = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([28.58, 77.29], 11, { animate: true });
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    setCartoKey(trimmed);
    localStorage.setItem("tempowala_carto_key", trimmed);
    setIsKeyModalOpen(false);
  };

  const isCartoActive = Boolean(cartoKey && cartoKey.startsWith("cb1_"));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      {/* Top Left Navigation Buttons */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-2">
        <button
          onClick={fitCorridorView}
          className="bg-white/95 backdrop-blur text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center space-x-1.5"
          title="Fit full 165 km corridor into view"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Full Corridor (165 km)</span>
        </button>

        <button
          onClick={focusMoradabad}
          className="bg-white/95 backdrop-blur text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center space-x-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Moradabad Cluster</span>
        </button>

        <button
          onClick={focusDelhi}
          className="bg-white/95 backdrop-blur text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center space-x-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span>Delhi Gateways</span>
        </button>
      </div>

      {/* Top Right Controls (Layer Switcher + CARTO Key Badge) */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center space-x-2">
        {/* CARTO Key Verified Badge */}
        <button
          onClick={() => setIsKeyModalOpen(true)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border shadow-sm backdrop-blur transition-all ${
            isCartoActive
              ? "bg-emerald-50/95 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
              : "bg-white/95 border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
          title="CARTO Basemaps Key Settings"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isCartoActive ? "CARTO Active" : "CARTO Key"}</span>
        </button>

        {/* Layer Switcher */}
        <div className="bg-white/95 backdrop-blur rounded-lg border border-slate-200 shadow-sm p-1 flex items-center space-x-1 text-xs">
          <Layers className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />

          {/* Carto Voyager */}
          <button
            onClick={() => setMapType("voyager")}
            className={`px-2 py-1 rounded-md font-medium transition-colors ${
              mapType === "voyager"
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Voyager
          </button>

          {/* Carto Positron (Clean Light) */}
          <button
            onClick={() => setMapType("positron")}
            className={`px-2 py-1 rounded-md font-medium transition-colors ${
              mapType === "positron"
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Positron
          </button>

          {/* Carto Dark Matter */}
          <button
            onClick={() => setMapType("dark")}
            className={`px-2 py-1 rounded-md font-medium transition-colors ${
              mapType === "dark"
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dark
          </button>

          {/* Satellite */}
          <button
            onClick={() => setMapType("satellite")}
            className={`px-2 py-1 rounded-md font-medium transition-colors ${
              mapType === "satellite"
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Satellite
          </button>

          {/* OpenStreetMap standard */}
          <button
            onClick={() => setMapType("osm")}
            className={`px-2 py-1 rounded-md font-medium transition-colors ${
              mapType === "osm"
                ? "bg-emerald-600 text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            OSM
          </button>
        </div>
      </div>

      {/* CARTO Key Modal */}
      {isKeyModalOpen && (
        <div className="absolute inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    CARTO Basemaps Key Active
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Verified access to CARTO Voyager, Positron & Dark Matter
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Key:
                </label>
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Key verified! High-resolution CARTO Basemaps vector raster tiles are active.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Route Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-[11px] flex items-center space-x-4 max-w-[90%] overflow-x-auto">
        <div className="flex items-center space-x-1.5 whitespace-nowrap">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white shadow-xs"></span>
          <span className="font-medium text-slate-700">Artisan Pickups</span>
        </div>
        <div className="flex items-center space-x-1.5 whitespace-nowrap">
          <span className="w-4 h-1 bg-emerald-500 inline-block rounded"></span>
          <span className="font-medium text-slate-700">NH-9 Corridor</span>
        </div>
        <div className="flex items-center space-x-1.5 whitespace-nowrap">
          <span className="w-3 h-3 rounded bg-emerald-700 text-[9px] text-white font-bold flex items-center justify-center">
            🚛
          </span>
          <span className="font-medium text-slate-700">Tempowala Trucks</span>
        </div>
        <div className="flex items-center space-x-1.5 whitespace-nowrap">
          <span className="w-3 h-3 rounded-full bg-sky-600 inline-block border border-white shadow-xs"></span>
          <span className="font-medium text-slate-700">Delhi Gateways</span>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-[480px] sm:h-[540px] bg-slate-100 z-0"
      />
    </div>
  );
};

export default RealMapLeaflet;
