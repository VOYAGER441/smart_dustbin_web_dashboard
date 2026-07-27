"use client";

import Link from "next/link";
import { Calendar, ChevronDown, Radio } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Map from "@/components/ui/Map";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import LiveActivityFeed from "@/components/ui/LiveActivityFeed";
import { LIVE_BIN_ID, formatRelative, useLiveBin } from "@/lib/binLive";

const wasteData = [
  { name: "Metal", value: 40, color: "#3b82f6" },
  { name: "Plastic", value: 28, color: "#a855f7" },
  { name: "Electronic", value: 12, color: "#ec4899" },
  { name: "Paper", value: 10, color: "#fbbf24" },
  { name: "Other", value: 10, color: "#6b7280" },
];

const pickupData = [
  { day: "Jun 3", pickups: 45 },
  { day: "Jun 4", pickups: 52 },
  { day: "Jun 5", pickups: 48 },
  { day: "Jun 6", pickups: 61 },
  { day: "Jun 7", pickups: 55 },
  { day: "Jun 8", pickups: 67 },
  { day: "Jun 9", pickups: 72 },
  { day: "Jun 10", pickups: 58 },
];

export default function Overview() {
  const dateRange = "3 Jun - 10 Jun";
  const period = "Last 7 days";
  const { derived, now } = useLiveBin();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <span className="text-gray-400">{period}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">{dateRange}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Live bin highlight */}
      <Link
        href={`/dashboard/bin-status/${encodeURIComponent(LIVE_BIN_ID)}`}
        className="block mb-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-gray-900 to-gray-900 p-6 transition hover:border-cyan-400/60"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Radio
              className={`w-6 h-6 ${
                derived?.online ? "text-emerald-300" : "text-yellow-300"
              }`}
            />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gray-400">Live IoT bin</p>
              <p className="text-xl font-semibold text-white">{LIVE_BIN_ID}</p>
            </div>
            <span
              className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                derived?.online
                  ? "bg-emerald-500/15 text-emerald-300"
                  : derived
                  ? "bg-yellow-500/15 text-yellow-300"
                  : "bg-slate-700/80 text-gray-300"
              }`}
            >
              {derived?.online ? "Live" : derived ? "Stale" : "Connecting…"}
            </span>
          </div>
          {derived ? (
            <div className="grid flex-1 grid-cols-3 gap-4 md:max-w-2xl">
              <LiveStat label="Status" value={derived.status} />
              <LiveStat label="Fill level" value={`${derived.fillLevel}%`} />
              <LiveStat label="Last reading" value={formatRelative(derived.receivedAt, now)} />
            </div>
          ) : (
            <p className="text-sm text-gray-400">Waiting for first telemetry…</p>
          )}
        </div>
        {derived && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ChamberBar label="Dry chamber" fill={derived.dryFill} flagFull={derived.dryFlagFull} distanceCm={derived.dryDistanceCm} />
            <ChamberBar label="Wet chamber" fill={derived.wetFill} flagFull={derived.wetFlagFull} distanceCm={derived.wetDistanceCm} />
          </div>
        )}
      </Link>

      {/* Stats Grid using BentoGrid */}
      <BentoGrid className="mb-8">
        <BentoGridItem
          className="col-span-1"
          title="Total pickups in June"
          description={
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">54.56</span>
                <span className="text-gray-400 text-sm">Tons</span>
              </div>
               <p className="text-gray-500 text-xs mt-2">based on 1653 pickups</p>
            </div>
          }
        />

        <BentoGridItem
          className="col-span-1"
          title="Valuable waste"
          description={
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">24.42</span>
                <span className="text-gray-400 text-sm">Tons</span>
              </div>
              <p className="text-cyan-400 text-xs mt-2">56% of total waste</p>
            </div>
          }
        />

        <BentoGridItem
          className="col-span-1"
          title="Ordinary waste"
          description={
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">20.14</span>
                <span className="text-gray-400 text-sm">Tons</span>
              </div>
              <p className="text-yellow-400 text-xs mt-2">44% of total waste</p>
            </div>
          }
        />
      </BentoGrid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-6">Valuable waste</h3>
          <p className="text-gray-400 text-sm mb-6">Wastes that can be recycled</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2">
            {wasteData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-6">Daily Pickups</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pickupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="pickups" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Map + activity feed */}
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">City bin overlay</h3>
              <p className="text-xs text-gray-500 mt-1">Live OpenStreetMap view of every monitored dustbin in the area.</p>
            </div>
          </div>
          <Map height={460} />
        </div>
        <LiveActivityFeed />
      </div>
    </div>
  );
}

function LiveStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gray-950/70 p-3">
      <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function ChamberBar({
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
    <div className="rounded-2xl bg-gray-950/60 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 uppercase tracking-[0.18em]">{label}</span>
        <span
          className={`text-xs font-semibold uppercase ${
            flagFull ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {flagFull ? "Full" : "OK"}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-900 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{distanceCm} cm to top</span>
        <span>{fill}%</span>
      </div>
    </div>
  );
}
