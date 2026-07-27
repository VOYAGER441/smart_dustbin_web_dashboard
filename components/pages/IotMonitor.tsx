"use client";

import { Activity, Trash2, Wifi, WifiOff } from "lucide-react";
import {
  POLL_MS,
  deriveLiveBin,
  formatRelative,
  useLiveBins,
} from "@/lib/binLive";

export default function IotMonitor() {
  const { bins, now, error, hasFetched } = useLiveBins();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">IoT live telemetry</h1>
            <p className="text-gray-400 mt-1">
              Smart dustbin nodes POST to{" "}
              <code className="text-cyan-300">/api/v1/bin/ingest</code>. Polling every {POLL_MS / 1000}s.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-800 bg-gray-900/80 px-5 py-3 text-sm text-gray-300">
          <span className="text-gray-500">Reporting bins</span>
          <span className="ml-3 text-white font-semibold">{bins.length}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-700/60 bg-red-900/20 p-4 text-sm text-red-200">
          Failed to fetch telemetry: {error}
        </div>
      )}

      {hasFetched && bins.length === 0 && !error && (
        <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-10 text-center">
          <WifiOff className="w-10 h-10 text-gray-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-white">Waiting for first reading</h2>
          <p className="mt-2 text-gray-400 max-w-xl mx-auto">
            No telemetry has been ingested yet. Power the ESP node on and confirm it can reach the dashboard host.
          </p>
        </div>
      )}

      {bins.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bins.map((b) => {
            const d = deriveLiveBin(b, now);
            return (
              <div
                key={b.binId}
                className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5 text-cyan-300" />
                    <h2 className="text-lg font-semibold text-white">{b.binId}</h2>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      d.online
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-yellow-500/10 text-yellow-300"
                    }`}
                  >
                    {d.online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {d.online ? "Live" : "Stale"}
                  </span>
                </div>

                <Chamber
                  label="Dry chamber"
                  fill={d.dryFill}
                  flagFull={d.dryFlagFull}
                  distanceCm={d.dryDistanceCm}
                />
                <Chamber
                  label="Wet chamber"
                  fill={d.wetFill}
                  flagFull={d.wetFlagFull}
                  distanceCm={d.wetDistanceCm}
                />

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800">
                  <span>device uptime {b.deviceTs.toLocaleString()} ms</span>
                  <span>{formatRelative(b.receivedAt, now)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chamber({
  label,
  fill,
  flagFull,
  distanceCm,
}: {
  label: string;
  fill: number;
  flagFull: boolean;
  distanceCm: number;
}) {
  const barColor = flagFull
    ? "bg-red-500"
    : fill >= 70
    ? "bg-yellow-400"
    : "bg-emerald-500";
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 uppercase tracking-[0.18em]">{label}</span>
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            flagFull ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {flagFull ? "Full" : "OK"}
        </span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-gray-950 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{distanceCm} cm to top</span>
        <span>{fill}% full</span>
      </div>
    </div>
  );
}
