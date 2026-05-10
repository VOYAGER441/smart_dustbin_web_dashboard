"use client";

import "leaflet/dist/leaflet.css";
import "./map-overrides.css";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layers, MapPin, Wifi, WifiOff } from "lucide-react";
import { binData, type BinData } from "@/components/pages/data/binStatusData";
import { LIVE_BIN_ID, deriveLiveBin, useLiveBin } from "@/lib/binLive";

interface DustbinMapProps {
  height?: number;
  focusBinId?: string;
}

type StatusKey = "filled" | "almost" | "empty";

const STATUS_COLOR: Record<StatusKey, string> = {
  filled: "#ef4444",
  almost: "#f59e0b",
  empty: "#10b981",
};

function statusKey(status: BinData["status"]): StatusKey {
  if (status === "Filled") return "filled";
  if (status === "Almost filled") return "almost";
  return "empty";
}

const DELHI_CENTER: [number, number] = [28.5602, 77.2055];

export default function DustbinMap({ height = 400, focusBinId }: DustbinMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const markersRef = useRef<Map<string, unknown>>(new Map());
  const [showLegend, setShowLegend] = useState(true);
  const [filter, setFilter] = useState<"all" | StatusKey>("all");
  const { telemetry, derived, now } = useLiveBin(LIVE_BIN_ID);

  const mergedBins = useMemo(() => {
    return binData.map((bin) => {
      if (!bin.isLive || !derived || !telemetry) return bin;
      const d = deriveLiveBin(telemetry, now);
      return { ...bin, status: d.status, fillLevel: d.fillLevel } satisfies BinData;
    });
  }, [derived, telemetry, now]);

  const visibleBins = useMemo(
    () => (filter === "all" ? mergedBins : mergedBins.filter((b) => statusKey(b.status) === filter)),
    [filter, mergedBins]
  );

  // Initialise the map exactly once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: DELHI_CENTER,
        zoom: 13,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);
    })();

    return () => {
      cancelled = true;
      const map = mapRef.current as { remove?: () => void } | null;
      if (map?.remove) map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Render / refresh markers when data changes
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;
      const map = mapRef.current as InstanceType<typeof L.Map>;

      // Drop markers no longer in view
      const visibleIds = new Set(visibleBins.map((b) => b.id));
      for (const [id, marker] of markersRef.current.entries()) {
        if (!visibleIds.has(id)) {
          (marker as InstanceType<typeof L.Marker>).remove();
          markersRef.current.delete(id);
        }
      }

      const markerHtml = (bin: BinData) => {
        const colour = STATUS_COLOR[statusKey(bin.status)];
        const live = bin.isLive
          ? `<span class="dustbin-marker__pulse" style="--ring:${
              derived?.online ? "#10b981" : "#f59e0b"
            }"></span>`
          : "";
        return `
          <div class="dustbin-marker" style="--dot:${colour}">
            ${live}
            <span class="dustbin-marker__dot"></span>
          </div>
        `;
      };

      const popupHtml = (bin: BinData) => {
        const liveLine = bin.isLive
          ? `<div class="dustbin-popup__live ${
              derived?.online ? "is-online" : "is-stale"
            }">${
              derived?.online ? "Live telemetry" : derived ? "Stale (no recent ping)" : "Connecting…"
            }</div>`
          : "";
        const fillLine = `<div>Fill <strong>${bin.fillLevel}%</strong> · ${bin.status}</div>`;
        return `
          <div class="dustbin-popup">
            <div class="dustbin-popup__title">${bin.id}</div>
            <div class="dustbin-popup__addr">${bin.address}</div>
            ${liveLine}
            ${fillLine}
            <a href="/dashboard/bin-status/${encodeURIComponent(bin.id)}" class="dustbin-popup__link">Open detail →</a>
          </div>
        `;
      };

      for (const bin of visibleBins) {
        const existing = markersRef.current.get(bin.id) as
          | InstanceType<typeof L.Marker>
          | undefined;
        const icon = L.divIcon({
          className: "dustbin-marker-wrap",
          html: markerHtml(bin),
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        if (existing) {
          existing.setLatLng([bin.coordinates.lat, bin.coordinates.lng]);
          existing.setIcon(icon);
          existing.setPopupContent(popupHtml(bin));
        } else {
          const marker = L.marker([bin.coordinates.lat, bin.coordinates.lng], { icon })
            .addTo(map)
            .bindPopup(popupHtml(bin));
          markersRef.current.set(bin.id, marker);
        }
      }

      if (focusBinId) {
        const target = mergedBins.find((b) => b.id.toUpperCase() === focusBinId.toUpperCase());
        if (target) map.setView([target.coordinates.lat, target.coordinates.lng], 16);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visibleBins, derived, mergedBins, focusBinId]);

  const counts = useMemo(() => {
    return {
      filled: mergedBins.filter((b) => b.status === "Filled").length,
      almost: mergedBins.filter((b) => b.status === "Almost filled").length,
      empty: mergedBins.filter((b) => b.status === "Emptied").length,
    };
  }, [mergedBins]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-gray-800"
      style={{ height }}
    >
      <div ref={containerRef} className="absolute inset-0 bg-slate-950" />

      {showLegend && (
        <div className="absolute top-4 left-4 z-[400] rounded-2xl border border-gray-800 bg-gray-950/85 backdrop-blur p-3 text-xs text-gray-200 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <Layers className="w-3.5 h-3.5 text-cyan-300" />
            <span className="uppercase tracking-wider">Bins in area</span>
          </div>
          <FilterRow active={filter === "all"} onClick={() => setFilter("all")} dot="bg-gray-300" label={`All (${mergedBins.length})`} />
          <FilterRow active={filter === "filled"} onClick={() => setFilter("filled")} dot="bg-red-500" label={`Filled (${counts.filled})`} />
          <FilterRow active={filter === "almost"} onClick={() => setFilter("almost")} dot="bg-yellow-500" label={`Almost (${counts.almost})`} />
          <FilterRow active={filter === "empty"} onClick={() => setFilter("empty")} dot="bg-emerald-500" label={`Emptied (${counts.empty})`} />
          <div className="mt-2 border-t border-gray-800 pt-2 flex items-center gap-2 text-gray-400">
            {derived?.online ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-yellow-300" />
            )}
            <span>
              {LIVE_BIN_ID}{" "}
              {derived?.online ? "live" : derived ? "stale" : "connecting…"}
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowLegend((v) => !v)}
        className="absolute top-4 right-4 z-[400] rounded-full border border-gray-700 bg-gray-950/85 backdrop-blur p-2 text-gray-300 hover:bg-gray-900"
        aria-label={showLegend ? "Hide legend" : "Show legend"}
      >
        <MapPin className="w-4 h-4" />
      </button>

      {focusBinId && (
        <Link
          href="/dashboard/bin-status"
          className="absolute bottom-4 right-4 z-[400] rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-200 backdrop-blur hover:bg-cyan-500/20"
        >
          See all bins
        </Link>
      )}
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  dot,
  label,
}: {
  active: boolean;
  onClick: () => void;
  dot: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition-colors ${
        active ? "bg-cyan-500/10 text-cyan-200" : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <span className="flex-1">{label}</span>
    </button>
  );
}
