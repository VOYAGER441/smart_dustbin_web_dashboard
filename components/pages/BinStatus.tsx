"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Trash2, Lock, MapPin, Camera, AlertTriangle, Radio } from "lucide-react";
import { BinData, binData, getStatusColor } from "./data/binStatusData";
import Map from "@/components/ui/Map";
import { formatRelative, useLiveBin } from "@/lib/binLive";

type SortOption = "Status" | "Location" | "Weight";
type StatusFilter = "All" | BinData["status"];

export default function BinStatus() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("Status");
  const [show, setShow] = useState<StatusFilter>("All");

  const { telemetry, derived, now } = useLiveBin();

  const mergedData = useMemo(() => {
    return binData.map((bin) => {
      if (!bin.isLive || !telemetry || !derived) return bin;
      return {
        ...bin,
        status: derived.status,
        fillLevel: derived.fillLevel,
        lastVerified: formatRelative(derived.receivedAt, now),
        condition: derived.online
          ? derived.fillLevel >= 90
            ? "Critical"
            : derived.fillLevel >= 60
            ? "Attention"
            : "Healthy"
          : "Attention",
      } satisfies BinData;
    });
  }, [telemetry, derived, now]);

  const filteredData = mergedData
    .filter((item) => item.address.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => show === "All" || item.status === show);

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "Location":
        return a.address.localeCompare(b.address);
      case "Weight": {
        const weightA = Number.parseFloat(a.weight);
        const weightB = Number.parseFloat(b.weight);
        const normalizedA = Number.isNaN(weightA) ? -1 : weightA;
        const normalizedB = Number.isNaN(weightB) ? -1 : weightB;
        return normalizedB - normalizedA;
      }
      case "Status":
      default:
        return a.status.localeCompare(b.status);
    }
  });

  const pendingVerifications = mergedData.filter(
    (item) => item.imageStatus.camera === "Pending" || item.imageStatus.citizen === "Pending"
  ).length;

  const healthAlerts = mergedData.filter((item) => item.condition !== "Healthy").length;
  const liveOnline = derived?.online ?? false;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Trash2 className="w-8 h-8 text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Bin status</h1>
            <p className="text-gray-400 mt-1">Track bin health, map overlays, and verify image reports.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
            <p className="text-sm text-gray-400 uppercase tracking-[0.24em]">Active bins</p>
            <p className="mt-3 text-3xl font-semibold text-white">{mergedData.length}</p>
          </div>
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
            <p className="text-sm text-gray-400 uppercase tracking-[0.24em]">Pending verify</p>
            <p className="mt-3 text-3xl font-semibold text-white">{pendingVerifications}</p>
          </div>
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
            <p className="text-sm text-gray-400 uppercase tracking-[0.24em]">Health alerts</p>
            <p className="mt-3 text-3xl font-semibold text-white">{healthAlerts}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Live bin overlay</h2>
                <p className="text-gray-400 mt-2">See nearby bin clusters and current status annotations on the city map.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                <MapPin className="w-4 h-4" /> Map overlay
              </div>
            </div>

            <div className="mt-6">
              <Map height={420} />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Bin queue</h2>
                <p className="text-gray-400 mt-1">Quick access to active verifications and health checks.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-950/80 px-3 py-1 text-sm text-gray-300">
                <Camera className="w-4 h-4 text-cyan-300" /> Image verify enabled
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-gray-400 font-medium">Province / Area</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Fill</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Weight</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Truck</th>
                    <th className="px-6 py-4 text-gray-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <span>{item.address}</span>
                          {item.isLive && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                liveOnline
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-yellow-500/15 text-yellow-300"
                              }`}
                            >
                              <Radio className="w-3 h-3" />
                              {liveOnline ? "Live" : "Stale"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(item.status)}`} />
                          <span>{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-950">
                            <div
                              className={`h-full ${
                                item.fillLevel >= 90
                                  ? "bg-red-500"
                                  : item.fillLevel >= 60
                                  ? "bg-yellow-400"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${item.fillLevel}%` }}
                            />
                          </div>
                          <span className="text-xs">{item.fillLevel}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.weight}</td>
                      <td className="px-6 py-4 text-gray-300">{item.truck}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/bin-status/${encodeURIComponent(item.id)}`}
                          className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 transition"
                        >
                          Open detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <Radio className={`w-5 h-5 ${liveOnline ? "text-emerald-300" : "text-yellow-300"}`} />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Live telemetry</p>
                <p className="mt-2 text-xl font-semibold">BIN-001</p>
              </div>
            </div>
            {derived ? (
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl bg-gray-950/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="font-semibold text-white">{derived.status}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full ${
                        derived.fillLevel >= 90 ? "bg-red-500" : derived.fillLevel >= 60 ? "bg-yellow-400" : "bg-emerald-500"
                      }`}
                      style={{ width: `${derived.fillLevel}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{derived.fillLevel}% full</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-950/70 p-3 text-xs">
                    <p className="text-gray-400">Dry</p>
                    <p className="mt-1 font-semibold text-white">{derived.dryFill}%</p>
                    <p className="text-gray-500">{derived.dryDistanceCm} cm</p>
                  </div>
                  <div className="rounded-2xl bg-gray-950/70 p-3 text-xs">
                    <p className="text-gray-400">Wet</p>
                    <p className="mt-1 font-semibold text-white">{derived.wetFill}%</p>
                    <p className="text-gray-500">{derived.wetDistanceCm} cm</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Last reading {formatRelative(derived.receivedAt, now)}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">Waiting for first telemetry from the IoT node…</p>
            )}
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Alerts</p>
                <p className="mt-2 text-xl font-semibold">{healthAlerts} warning bins</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-300">
                <p className="text-gray-400">Next verification</p>
                <p className="mt-2 font-semibold text-white">BIN-001 needs review in 2m</p>
              </div>
              <div className="rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-300">
                <p className="text-gray-400">Driver recommendation</p>
                <p className="mt-2 font-semibold text-white">Assign driver for image verification</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Connectivity</p>
                <p className="mt-2 text-xl font-semibold text-white">{mergedData.filter((item) => item.networkStrength >= 90).length} bins strong</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-300">
              <p className="text-gray-400">Keep the driver dashboard synchronized with the latest IoT telemetry and citizen reports.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Search and Filters */}
      <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] items-center">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search province name, postal codes, street names, etc"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950 text-white placeholder-gray-500 rounded-3xl pl-10 pr-4 py-3 text-sm ring-1 ring-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-gray-400 text-sm">
                Sort by
              </label>
              <div className="relative">
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="appearance-none bg-gray-950 text-gray-300 rounded-3xl pl-3 pr-9 py-3 text-sm border border-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Status">Status</option>
                  <option value="Location">Location</option>
                  <option value="Weight">Weight</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-gray-400 text-sm">
                Filter
              </label>
              <div className="relative">
                <select
                  id="status-filter"
                  value={show}
                  onChange={(event) => setShow(event.target.value as StatusFilter)}
                  className="appearance-none bg-gray-950 text-gray-300 rounded-3xl pl-3 pr-9 py-3 text-sm border border-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="All">All</option>
                  <option value="Filled">Filled</option>
                  <option value="Almost filled">Almost filled</option>
                  <option value="Emptied">Emptied</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">Showing {sortedData.length} entries</p>
        <div className="flex gap-2">
          <button className="bg-gray-950 text-gray-400 rounded-full px-4 py-2 text-sm hover:bg-gray-900 transition-colors">
            Previous
          </button>
          <button className="bg-gray-950 text-gray-400 rounded-full px-4 py-2 text-sm hover:bg-gray-900 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
