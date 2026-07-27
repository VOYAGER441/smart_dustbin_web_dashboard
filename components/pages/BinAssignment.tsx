"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Camera,
  Layers,
  AlertCircle,
  Radio,
  Gauge,
  Truck,
  Clock3,
  BatteryCharging,
  Wifi,
  Thermometer,
  Sparkles,
  X,
} from "lucide-react";
import Map from "@/components/ui/Map";
import BinQrCard from "@/components/ui/BinQrCard";
import { binData, getStatusColor } from "./data/binStatusData";
import { formatRelative, useLiveBin } from "@/lib/binLive";

interface BinAssignmentProps {
  binId: string;
}

type VerifyStatus = "Pending" | "Verified" | "Action needed";

type VerificationType = "camera" | "citizen" | null;

export default function BinAssignment({ binId }: BinAssignmentProps) {
  const normalizedId = decodeURIComponent(binId).toUpperCase();
  const staticBin = useMemo(
    () => binData.find((item) => item.id.toUpperCase() === normalizedId),
    [normalizedId]
  );

  const { derived, now } = useLiveBin(normalizedId);

  const bin = useMemo(() => {
    if (!staticBin) return undefined;
    if (!staticBin.isLive || !derived) return staticBin;
    return {
      ...staticBin,
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
      networkStrength: derived.online ? Math.max(staticBin.networkStrength, 92) : 0,
    } as typeof staticBin;
  }, [staticBin, derived, now]);

  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [assignedTruck, setAssignedTruck] = useState(bin?.truck === "Unassigned" ? "" : bin?.truck ?? "");
  const [selectedImage, setSelectedImage] = useState<VerificationType>(null);
  const [verificationState, setVerificationState] = useState<{
    camera: VerifyStatus;
    citizen: VerifyStatus;
  }>(() => ({
    camera: bin?.imageStatus.camera ?? "Pending",
    citizen: bin?.imageStatus.citizen ?? "Pending",
  }));

  const freeTrucks = useMemo(
    () => [
      { id: "truck-1", name: "RES-12 • TAX-1234", status: "busy" },
      { id: "truck-2", name: "RES-32 • TAX-3455", status: "busy" },
      { id: "truck-3", name: "RES-74 • YTR-3412", status: "free" },
      { id: "truck-4", name: "RES-81 • PLM-7721", status: "free" },
    ].filter((truck) => truck.status === "free"),
    []
  );
  const selectedTruck = freeTrucks.find((truck) => truck.id === selectedTruckId);
  const canAssign = Boolean(bin && bin.status === "Filled" && !assignedTruck && selectedTruck);

  if (!bin) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
          <h1 className="text-2xl font-bold text-white">Bin not found</h1>
          <p className="mt-2 text-gray-400">No bin matches ID: {normalizedId}</p>
          <Link
            href="/dashboard/bin-status"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bin status
          </Link>
        </div>
      </div>
    );
  }

  const assignTruck = () => {
    if (!canAssign || !selectedTruck) return;

    setAssignedTruck(selectedTruck.name);
    setSelectedTruckId("");
  };

  const handleVerify = (type: Exclude<VerificationType, null>, status: VerifyStatus) => {
    setVerificationState((current) => ({ ...current, [type]: status }));
  };

  const imageCards = [
    {
      key: "camera" as const,
      title: "IoT camera verify",
      description: "Live capture from the smart bin camera.",
      status: verificationState.camera,
      icon: Camera,
    },
    {
      key: "citizen" as const,
      title: "Citizen report verify",
      description: "Verify the community submitted photo.",
      status: verificationState.citizen,
      icon: Layers,
    },
  ];
  const pendingVerifications = Object.values(verificationState).filter((status) => status === "Pending").length;
  const conditionTone =
    bin.condition === "Critical"
      ? "border-red-400/30 bg-red-500/10 text-red-200"
      : bin.condition === "Attention"
      ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-200"
      : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-0">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-6 xl:flex-1">
          <Link
            href="/dashboard/bin-status"
            className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bin status
          </Link>
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 p-8 shadow-[0_20px_70px_-40px_rgba(34,211,238,0.55)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Bin dashboard</p>
                    {bin.isLive && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          derived?.online
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-yellow-500/15 text-yellow-300"
                        }`}
                      >
                        <Radio className="w-3 h-3" />
                        {derived?.online ? "Live" : derived ? "Stale" : "Connecting…"}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-2 text-3xl font-bold text-white">{bin.id}</h1>
                  <p className="mt-2 max-w-2xl text-gray-400">{bin.address}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-full border px-3 py-1 ${conditionTone}`}>{bin.condition}</span>
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
                      {bin.status}
                    </span>
                    <span className="rounded-full border border-gray-700 bg-gray-950/70 px-3 py-1 text-gray-300">
                      Last check {bin.lastVerified}
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl border border-cyan-500/20 bg-gray-950/70 px-5 py-4 text-sm text-gray-300 shadow-inner shadow-cyan-500/10">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Control snapshot</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Tap an image card to open large view and review details.</p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-800/80 bg-gray-950/70 p-5 backdrop-blur transition hover:border-cyan-500/35">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Status</p>
                    <Gauge className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-lg font-semibold text-white">
                    <span className={`h-3 w-3 rounded-full ${getStatusColor(bin.status)}`} /> {bin.status}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-800/80 bg-gray-950/70 p-5 backdrop-blur transition hover:border-cyan-500/35">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Assigned truck</p>
                    <Truck className="h-4 w-4 text-cyan-300" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{assignedTruck || "Unassigned"}</p>
                </div>
                <div className="rounded-2xl border border-gray-800/80 bg-gray-950/70 p-5 backdrop-blur transition hover:border-cyan-500/35">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Fill level</p>
                    <Layers className="h-4 w-4 text-cyan-300" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{bin.fillLevel}%</p>
                </div>
                <div className="rounded-2xl border border-gray-800/80 bg-gray-950/70 p-5 backdrop-blur transition hover:border-cyan-500/35">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Last verified</p>
                    <Clock3 className="h-4 w-4 text-cyan-300" />
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{bin.lastVerified}</p>
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Image verification</h2>
                  <p className="text-gray-400 mt-2">Review camera captures and citizen-submitted images in a single view.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                  <Camera className="w-4 h-4" /> Live review
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {imageCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSelectedImage(item.key)}
                      className="group rounded-3xl border border-gray-800 bg-gray-950/80 p-5 text-left transition hover:border-cyan-500/50 hover:bg-gray-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                            item.status === "Verified"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : item.status === "Action needed"
                              ? "bg-yellow-500/10 text-yellow-300"
                              : "bg-slate-700/80 text-gray-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-gray-400">{item.description}</p>
                      <p className="mt-4 text-sm text-cyan-300">Open large view</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Citizen reports</h2>
                  <p className="text-gray-400 mt-2">Community-submitted observations and follow-up requests.</p>
                </div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{bin.reports.length} reports</span>
              </div>

              <div className="mt-6 space-y-4">
                {bin.reports.map((report) => (
                  <div key={report.id} className="rounded-3xl border border-gray-800 bg-gray-950/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-400">{report.category}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{report.title}</h3>
                        <p className="mt-2 text-sm text-gray-400">{report.comment}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          report.status === "Verified"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : report.status === "Action needed"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-slate-700/80 text-gray-300"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">Reported {report.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="grid gap-5 self-start xl:sticky xl:top-6 xl:w-[368px]">
          {bin.isLive && (
            <div className="rounded-[1.75rem] border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 via-slate-900/90 to-gray-950 p-6 shadow-[0_15px_50px_-35px_rgba(34,211,238,0.65)]">
              <div className="flex items-center gap-3 text-white">
                <Radio
                  className={`w-5 h-5 ${
                    derived?.online ? "text-emerald-300" : "text-yellow-300"
                  }`}
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Live chambers</p>
                  <p className="mt-2 text-xl font-semibold">
                    {derived ? `${derived.fillLevel}% full` : "Connecting…"}
                  </p>
                </div>
              </div>
              {derived ? (
                <div className="mt-5 space-y-4">
                  <ChamberRow
                    label="Dry"
                    fill={derived.dryFill}
                    distanceCm={derived.dryDistanceCm}
                    flagFull={derived.dryFlagFull}
                  />
                  <ChamberRow
                    label="Wet"
                    fill={derived.wetFill}
                    distanceCm={derived.wetDistanceCm}
                    flagFull={derived.wetFlagFull}
                  />
                  <p className="text-xs text-gray-500">
                    Last reading {formatRelative(derived.receivedAt, now)} · device uptime{" "}
                    {derived.deviceTs.toLocaleString()} ms
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-400">
                  Waiting for telemetry from <code className="text-cyan-300">/api/v1/bin/ingest</code>.
                </p>
              )}
            </div>
          )}

          <div className="rounded-[1.75rem] border border-gray-800/90 bg-gray-900/80 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Dustbin health</p>
                  <p className="mt-2 text-xl font-semibold">{bin.condition}</p>
                </div>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${conditionTone}`}>{bin.condition}</span>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BatteryCharging className="h-4 w-4 text-cyan-300" />
                    <p className="text-gray-400">Battery</p>
                  </div>
                  <p className="font-semibold text-white">{bin.battery}%</p>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-cyan-300" />
                    <p className="text-gray-400">Network</p>
                  </div>
                  <p className="font-semibold text-white">{bin.networkStrength}%</p>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-cyan-300" />
                    <p className="text-gray-400">Temperature</p>
                  </div>
                  <p className="font-semibold text-white">{bin.temperature}°C</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 via-gray-900/90 to-gray-950 p-6">
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Action</p>
                <p className="mt-2 text-xl font-semibold">Next step</p>
              </div>
            </div>
            <p className="mt-4 text-gray-300">Review pending verification and dispatch the field driver with confidence.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm">
                <p className="text-gray-400">Pending checks</p>
                <p className="mt-2 font-semibold text-white">{pendingVerifications}</p>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm">
                <p className="text-gray-400">Open reports</p>
                <p className="mt-2 font-semibold text-white">{bin.reports.length}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedImage("camera")}
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/25"
            >
              {pendingVerifications > 0 ? "Start image verification" : "Open image verification"}
            </button>
            <div className="mt-3 rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-200">
              <p className="font-semibold">Driver verification queue is ready.</p>
            </div>
          </div>

          <BinQrCard binId={bin.id} />

          <div className="rounded-[1.75rem] border border-gray-800/90 bg-gray-900/80 p-6 backdrop-blur">
            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Live location</p>
                <p className="mt-2 text-xl font-semibold">{bin.coordinates.lat.toFixed(2)}, {bin.coordinates.lng.toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-400">This map overlay shows the bin cluster near the selected location.</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-800">
              <Map height={320} focusBinId={bin.id} />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-gray-800/90 bg-gray-900/80 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Dispatcher</h2>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                {freeTrucks.length} free trucks
              </span>
            </div>
            <p className="mt-2 text-gray-400">Driver dashboard recommendations for next collection.</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                <p className="text-sm text-gray-400">Current driver</p>
                <p className="mt-2 text-white font-semibold">{assignedTruck || "No truck assigned"}</p>
              </div>
              {!assignedTruck && (
                <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
                  <label htmlFor="truck-select" className="text-sm text-gray-400">
                    Assign available truck
                  </label>
                  <select
                    id="truck-select"
                    value={selectedTruckId}
                    onChange={(event) => setSelectedTruckId(event.target.value)}
                    className="mt-3 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="">Select truck</option>
                    {freeTrucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>
                        {truck.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={assignTruck}
                    disabled={!canAssign}
                    className="mt-3 w-full rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition enabled:hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
                  >
                    Assign truck
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    {bin.status !== "Filled"
                      ? "Truck assignment unlocks when the bin status is Filled."
                      : "Select a truck to dispatch for this bin."}
                  </p>
                </div>
              )}
              <div className="rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-200">
                <p className="font-semibold">Use image verification before dispatch.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-900/90 text-gray-300 hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] p-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {selectedImage === "camera" ? "IoT camera verification" : "Citizen report verification"}
                    </h2>
                    <p className="text-gray-400 mt-1">Full-screen review mode for the selected image report.</p>
                  </div>
                </div>
                <div className="mt-6 rounded-[2rem] border border-gray-800 bg-gray-900/80 p-8">
                  <div className="flex h-80 items-center justify-center rounded-3xl bg-slate-950 text-center text-gray-500">
                    <div>
                      <p className="text-2xl font-semibold text-white">Preview image</p>
                      <p className="mt-3 max-w-xl text-sm text-gray-400">
                        {selectedImage === "camera"
                          ? "IoT snapshot from bin camera. Confirm the image against the latest telemetry and report details."
                          : "Citizen-submitted photo. Confirm the report and route the driver if the scene requires service."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Verification status</p>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="rounded-2xl bg-gray-950/70 p-4">
                      <p className="text-sm text-gray-400">Image source</p>
                      <p className="mt-2 text-white font-semibold">{selectedImage === "camera" ? "Smart camera" : "Citizen upload"}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-950/70 p-4">
                      <p className="text-sm text-gray-400">Current recommendation</p>
                      <p className="mt-2 text-white font-semibold">{verificationState[selectedImage]}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Actions</p>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      onClick={() => handleVerify(selectedImage, "Verified")}
                      className="rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
                    >
                      Approve image
                    </button>
                    <button
                      onClick={() => handleVerify(selectedImage, "Action needed")}
                      className="rounded-3xl border border-yellow-500 px-4 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/10"
                    >
                      Flag issue for field team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChamberRow({
  label,
  fill,
  distanceCm,
  flagFull,
}: {
  label: string;
  fill: number;
  distanceCm: number;
  flagFull: boolean;
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
          className={`text-xs font-semibold uppercase ${
            flagFull ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {flagFull ? "Full" : "OK"}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-950 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{distanceCm} cm</span>
        <span>{fill}%</span>
      </div>
    </div>
  );
}
