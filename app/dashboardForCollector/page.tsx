"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle2, Coins, MapPinned, Route, Trash2 } from "lucide-react";

type TaskStatus = "pending" | "assigned" | "in-progress" | "completed";

interface DustbinTask {
  id: string;
  dustbinCode: string;
  zone: string;
  address: string;
  reward: number;
  status: TaskStatus;
  proofPhoto?: string;
}

const initialTasks: DustbinTask[] = [
  {
    id: "task-001",
    dustbinCode: "BIN-1042",
    zone: "Green Park",
    address: "Green Park Main Gate, New Delhi",
    reward: 20,
    status: "pending",
  },
  {
    id: "task-002",
    dustbinCode: "BIN-2208",
    zone: "River Front",
    address: "River Front Signal Junction, Ahmedabad",
    reward: 25,
    status: "pending",
  },
  {
    id: "task-003",
    dustbinCode: "BIN-3315",
    zone: "Market Square",
    address: "Market Square Bus Stop, Pune",
    reward: 18,
    status: "pending",
  },
];

export default function CollectorDashboardPage() {
  const [tasks, setTasks] = useState<DustbinTask[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [greenCoins, setGreenCoins] = useState(0);
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState("");

  const pendingTasks = useMemo(() => tasks.filter((task) => task.status === "pending"), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.status === "completed"), [tasks]);
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeTaskId) ?? null,
    [tasks, activeTaskId]
  );
  const hasActiveTask = Boolean(activeTask);

  const assignDustbin = () => {
    if (!selectedTaskId || hasActiveTask) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === selectedTaskId ? { ...task, status: "assigned" } : task
      )
    );
    setActiveTaskId(selectedTaskId);
    setSelectedTaskId("");
  };

  const openDirections = () => {
    if (!activeTask) return;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeTask.address)}`;
    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  const markInProgress = () => {
    if (!activeTask || activeTask.status !== "assigned") return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === activeTask.id ? { ...task, status: "in-progress" } : task
      )
    );
  };

  const handleProofUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProofPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
    setProofFileName(file.name);
  };

  const submitProofAndComplete = () => {
    if (!activeTask || activeTask.status !== "in-progress" || !proofPhoto) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === activeTask.id
          ? { ...task, status: "completed", proofPhoto }
          : task
      )
    );
    setGreenCoins((prev) => prev + activeTask.reward);
    setActiveTaskId(null);
    setProofPhoto(null);
    setProofFileName("");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Collector Dashboard</h1>
            <p className="mt-2 text-gray-400">
              Assign a dustbin, navigate to its location, clean it, and upload a photo to earn Green Coins.
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
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Assign Dustbin Task</h2>
          <p className="text-sm text-gray-400">You can work on one active task at a time.</p>

          <select
            value={selectedTaskId}
            onChange={(event) => setSelectedTaskId(event.target.value)}
            disabled={hasActiveTask}
            className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select a dustbin to assign</option>
            {pendingTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.dustbinCode} • {task.zone} • +{task.reward} GC
              </option>
            ))}
          </select>

          <button
            onClick={assignDustbin}
            disabled={!selectedTaskId || hasActiveTask}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Assign dustbin
          </button>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Active Task</h2>

          {!activeTask ? (
            <p className="text-sm text-gray-400">
              No active task assigned. Choose a pending dustbin to begin.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-700 bg-gray-950 p-4">
                <p className="text-sm text-gray-400">Dustbin</p>
                <p className="text-lg font-semibold text-white">{activeTask.dustbinCode}</p>
                <p className="mt-1 text-sm text-gray-300">{activeTask.zone}</p>
                <p className="text-sm text-gray-500">{activeTask.address}</p>
                <p className="mt-2 text-sm text-emerald-300">Reward: +{activeTask.reward} Green Coins</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openDirections}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
                >
                  <MapPinned className="h-4 w-4" />
                  Open location
                </button>
                <button
                  onClick={markInProgress}
                  disabled={activeTask.status !== "assigned"}
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
                disabled={activeTask.status !== "in-progress" || !proofPhoto}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit proof & earn coins
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6">
        <h2 className="text-xl font-semibold text-white">Completed Cleanups</h2>
        {completedTasks.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">No completed tasks yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-gray-700 bg-gray-950 p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-white">{task.dustbinCode}</p>
                  <p className="text-xs text-gray-400">{task.zone}</p>
                  <p className="text-xs text-emerald-300">+{task.reward} Green Coins</p>
                </div>
                {task.proofPhoto ? (
                  <div className="relative h-28 w-full overflow-hidden rounded-md">
                    <Image
                      src={task.proofPhoto}
                      alt={`${task.dustbinCode} cleanup proof`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
