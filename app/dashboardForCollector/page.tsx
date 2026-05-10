"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, CheckCircle2, Coins, MapPinned, Radio, Route, Trash2 } from "lucide-react";
import { binData, type BinData } from "@/components/pages/data/binStatusData";
import { LIVE_BIN_ID, deriveLiveBin, formatRelative, useLiveBin } from "@/lib/binLive";

type TaskStatus = "pending" | "assigned" | "in-progress" | "completed";

interface DustbinTask {
  binId: string;
  status: TaskStatus;
  reward: number;
  proofPhoto?: string;
  completedAt?: string;
}

const REWARD_BY_STATUS: Record<BinData["status"], number> = {
  Filled: 30,
  "Almost filled": 20,
  Emptied: 10,
};

function buildInitialTasks(): DustbinTask[] {
  return binData
    .filter((bin) => bin.status !== "Emptied")
    .map((bin) => ({
      binId: bin.id,
      status: "pending" as TaskStatus,
      reward: REWARD_BY_STATUS[bin.status],
    }));
}

export default function CollectorDashboardPage() {
  const [tasks, setTasks] = useState<DustbinTask[]>(() => buildInitialTasks());
  const [selectedBinId, setSelectedBinId] = useState("");
  const [activeBinId, setActiveBinId] = useState<string | null>(null);
  const [greenCoins, setGreenCoins] = useState(0);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState("");

  const { telemetry, derived, now } = useLiveBin(LIVE_BIN_ID);

  const binsById = useMemo(() => {
    const map: Record<string, BinData> = {};
    for (const b of binData) map[b.id] = b;
    return map;
  }, []);

  const tasksWithBin = useMemo(
    () =>
      tasks.map((task) => {
        const bin = binsById[task.binId];
        if (bin?.isLive && telemetry) {
          const live = deriveLiveBin(telemetry, now);
          return { task, bin, liveStatus: live };
        }
        return { task, bin, liveStatus: null };
      }),
    [tasks, binsById, telemetry, now]
  );

  // Auto-promote BIN-001 to in-progress when telemetry shows it's full and the
  // collector has it assigned — gives the demo a satisfying "live" handoff.
  useEffect(() => {
    if (!derived) return;
    if (activeBinId !== LIVE_BIN_ID) return;
    if (!derived.isFull) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.binId === LIVE_BIN_ID && t.status === "assigned"
          ? { ...t, status: "in-progress" }
          : t
      )
    );
  }, [derived, activeBinId]);

  const pendingTasks = tasksWithBin.filter((t) => t.task.status === "pending");
  const completedTasks = tasksWithBin.filter((t) => t.task.status === "completed");
  const activeEntry = tasksWithBin.find((t) => t.task.binId === activeBinId) ?? null;
  const hasActive = Boolean(activeEntry);

  const assignDustbin = () => {
    if (!selectedBinId || hasActive) return;
    setTasks((prev) =>
      prev.map((t) => (t.binId === selectedBinId ? { ...t, status: "assigned" } : t))
    );
    setActiveBinId(selectedBinId);
    setSelectedBinId("");
  };

  const openDirections = () => {
    if (!activeEntry?.bin) return;
    const { lat, lng } = activeEntry.bin.coordinates;
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const markInProgress = () => {
    if (!activeEntry || activeEntry.task.status !== "assigned") return;
    setTasks((prev) =>
      prev.map((t) => (t.binId === activeEntry.task.binId ? { ...t, status: "in-progress" } : t))
    );
  };

  const handleProofUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setProofPhoto(reader.result);
    };
    reader.readAsDataURL(file);
    setProofFileName(file.name);
  };

  const submitProofAndComplete = () => {
    if (!activeEntry || activeEntry.task.status !== "in-progress" || !proofPhoto) return;
    const completedAt = new Date().toLocaleString();
    setTasks((prev) =>
      prev.map((t) =>
        t.binId === activeEntry.task.binId
          ? { ...t, status: "completed", proofPhoto, completedAt }
          : t
      )
    );
    setGreenCoins((prev) => prev + activeEntry.task.reward);
    setActiveBinId(null);
    setProofPhoto(null);
    setProofFileName("");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-300 transition"
            >
              <ArrowLeft className="h-3 w-3" /> Back to landing
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-white">Collector dashboard</h1>
            <p className="mt-2 text-gray-400">
              Pick up an open dustbin task, navigate via the map, clean it, and upload a photo to earn Green Coins.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3">
            <Coins className="h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-200">Green Coins</p>
              <p className="text-xl font-bold text-white">{greenCoins}</p>
            </div>
          </div>
        </div>

        {derived && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-200">
            <Radio
              className={`h-3 w-3 ${derived.online ? "text-emerald-300" : "text-yellow-300"}`}
            />
            <span>
              {LIVE_BIN_ID} is {derived.online ? "live" : "stale"} · {derived.fillLevel}% fill ·{" "}
              last reading {formatRelative(derived.receivedAt, now)}
            </span>
          </div>
        )}
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Open tasks</h2>
          <p className="text-sm text-gray-400">
            Higher-priority bins (Filled) reward more Green Coins. You can work on one task at a time.
          </p>

          <select
            value={selectedBinId}
            onChange={(e) => setSelectedBinId(e.target.value)}
            disabled={hasActive}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select a dustbin to claim</option>
            {pendingTasks.map(({ task, bin }) =>
              bin ? (
                <option key={task.binId} value={task.binId}>
                  {bin.id} · {bin.address.split(",")[0]} · {bin.status} · +{task.reward} GC
                </option>
              ) : null
            )}
          </select>

          <button
            onClick={assignDustbin}
            disabled={!selectedBinId || hasActive}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Claim task
          </button>

          {pendingTasks.length === 0 && (
            <p className="text-sm text-gray-500">No open tasks right now — great work!</p>
          )}
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Active task</h2>

          {!activeEntry || !activeEntry.bin ? (
            <p className="text-sm text-gray-400">
              No active task. Choose a pending dustbin to begin.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-700 bg-gray-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-white">{activeEntry.bin.id}</p>
                  {activeEntry.liveStatus && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        activeEntry.liveStatus.online
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-yellow-500/15 text-yellow-300"
                      }`}
                    >
                      <Radio className="w-3 h-3" />
                      {activeEntry.liveStatus.online ? "Live" : "Stale"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-300">{activeEntry.bin.address}</p>
                <p className="mt-2 text-sm text-emerald-300">
                  Reward: +{activeEntry.task.reward} Green Coins
                </p>
                {activeEntry.liveStatus && (
                  <p className="mt-2 text-xs text-gray-400">
                    Live fill <span className="text-white font-semibold">{activeEntry.liveStatus.fillLevel}%</span> · status{" "}
                    {activeEntry.liveStatus.status}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openDirections}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
                >
                  <MapPinned className="h-4 w-4" />
                  Open in OpenStreetMap
                </button>
                <button
                  onClick={markInProgress}
                  disabled={activeEntry.task.status !== "assigned"}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-300 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Route className="h-4 w-4" />
                  Start cleaning
                </button>
              </div>

              <label className="block">
                <span className="mb-2 inline-flex items-center gap-2 text-sm text-gray-300">
                  <Camera className="h-4 w-4" />
                  Upload cleaned dustbin photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleProofUpload}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-gray-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-700"
                />
              </label>

              {proofPhoto && (
                <div className="rounded-xl border border-gray-700 bg-gray-950 p-3">
                  <p className="mb-2 text-xs text-gray-400">{proofFileName}</p>
                  <div className="relative h-40 w-full overflow-hidden rounded-md">
                    <Image
                      src={proofPhoto}
                      alt="Cleaned dustbin proof"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={submitProofAndComplete}
                disabled={activeEntry.task.status !== "in-progress" || !proofPhoto}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit proof &amp; earn coins
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6">
        <h2 className="text-xl font-semibold text-white">Completed cleanups</h2>
        {completedTasks.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">No completed tasks yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map(({ task, bin }) => (
              <div key={task.binId} className="rounded-xl border border-gray-700 bg-gray-950 p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">{bin?.id}</p>
                  <p className="text-xs text-gray-400">{bin?.address}</p>
                  <p className="text-xs text-emerald-300">+{task.reward} Green Coins</p>
                  {task.completedAt && (
                    <p className="text-[11px] text-gray-500">at {task.completedAt}</p>
                  )}
                </div>
                {task.proofPhoto && (
                  <div className="relative h-28 w-full overflow-hidden rounded-md">
                    <Image
                      src={task.proofPhoto}
                      alt={`${bin?.id} cleanup proof`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
