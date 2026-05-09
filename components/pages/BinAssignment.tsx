"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  MapPin,
  ShieldCheck,
  Camera,
  Layers,
  AlertCircle,
  X,
} from "lucide-react";
import Map from "@/components/ui/Map";
import { binData, getStatusColor } from "./data/binStatusData";

interface BinAssignmentProps {
  binId: string;
}

type VerifyStatus = "Pending" | "Verified" | "Action needed";

type VerificationType = "camera" | "citizen" | null;

export default function BinAssignment({ binId }: BinAssignmentProps) {
  const normalizedId = decodeURIComponent(binId).toUpperCase();
  const bin = useMemo(
    () => binData.find((item) => item.id.toUpperCase() === normalizedId),
    [normalizedId]
  );

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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <Link
            href="/dashboard/bin-status"
            className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/80 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to bin status
          </Link>
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Bin dashboard</p>
                <h1 className="mt-2 text-3xl font-bold text-white">{bin.id}</h1>
                <p className="mt-2 text-gray-400 max-w-2xl">{bin.address}</p>
              </div>
              <div className="rounded-3xl bg-gray-950/70 px-5 py-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-300" />
                  <span>Map overlay live</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">Tap an image card to open large view and review details.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-gray-950/70 p-5">
                <p className="text-sm text-gray-400">Status</p>
                <div className="mt-3 flex items-center gap-2 text-lg font-semibold text-white">
                  <span className={`h-3 w-3 rounded-full ${getStatusColor(bin.status)}`} /> {bin.status}
                </div>
              </div>
              <div className="rounded-3xl bg-gray-950/70 p-5">
                <p className="text-sm text-gray-400">Assigned truck</p>
                <p className="mt-3 text-lg font-semibold text-white">{assignedTruck || "Unassigned"}</p>
              </div>
              <div className="rounded-3xl bg-gray-950/70 p-5">
                <p className="text-sm text-gray-400">Fill level</p>
                <p className="mt-3 text-lg font-semibold text-white">{bin.fillLevel}%</p>
              </div>
              <div className="rounded-3xl bg-gray-950/70 p-5">
                <p className="text-sm text-gray-400">Last verified</p>
                <p className="mt-3 text-lg font-semibold text-white">{bin.lastVerified}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-6 xl:w-[360px]">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Dustbin health</p>
                <p className="mt-2 text-xl font-semibold">{bin.condition}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-300">
                <p className="text-gray-400">Battery</p>
                <p className="mt-2 text-white font-semibold">{bin.battery}%</p>
              </div>
              <div className="rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-300">
                <p className="text-gray-400">Network</p>
                <p className="mt-2 text-white font-semibold">{bin.networkStrength}%</p>
              </div>
              <div className="rounded-2xl bg-gray-950/70 p-4 text-sm text-gray-300">
                <p className="text-gray-400">Temperature</p>
                <p className="mt-2 text-white font-semibold">{bin.temperature}°C</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Action</p>
                <p className="mt-2 text-xl font-semibold">Next step</p>
              </div>
            </div>
            <p className="mt-4 text-gray-300">Review the pending image verification and dispatch the driver if needed.</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl bg-gray-950/70 p-4 text-sm">
                <p className="text-gray-400">Report count</p>
                <p className="mt-2 font-semibold text-white">{bin.reports.length} open reports</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-slate-950 p-4 text-sm text-cyan-200">
                <p className="font-semibold">Driver verification queue is ready.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
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

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Live location</p>
                <p className="mt-2 text-xl font-semibold">{bin.coordinates.lat.toFixed(2)}, {bin.coordinates.lng.toFixed(2)}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-400">This map overlay shows the bin cluster near the selected location.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-800">
              <Map />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">Dispatcher</h2>
            <p className="mt-2 text-gray-400">Driver dashboard recommendations for next collection.</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-gray-950/70 p-4">
                <p className="text-sm text-gray-400">Current driver</p>
                <p className="mt-2 text-white font-semibold">{assignedTruck || "No truck assigned"}</p>
              </div>
              <div className="rounded-2xl bg-cyan-500/10 p-4 text-sm text-cyan-200">
                <p className="font-semibold">Use image verification before dispatch.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
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
