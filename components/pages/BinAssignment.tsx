"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Truck } from "lucide-react";
import { binData, getStatusColor } from "./data/binStatusData";

interface BinAssignmentProps {
  binId: string;
}

interface TruckAssignment {
  id: string;
  name: string;
  status: "free" | "busy";
}

const truckPool: TruckAssignment[] = [
  { id: "truck-1", name: "RES-12 • TAX-1234", status: "busy" },
  { id: "truck-2", name: "RES-32 • TAX-3455", status: "busy" },
  { id: "truck-3", name: "RES-74 • YTR-3412", status: "free" },
  { id: "truck-4", name: "RES-81 • PLM-7721", status: "free" },
];

export default function BinAssignment({ binId }: BinAssignmentProps) {
  const normalizedId = decodeURIComponent(binId).toUpperCase();
  const bin = useMemo(
    () => binData.find((item) => item.id.toUpperCase() === normalizedId),
    [normalizedId]
  );

  const [trucks, setTrucks] = useState(truckPool);
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [assignedTruck, setAssignedTruck] = useState(bin?.truck === "Unassigned" ? "" : (bin?.truck ?? ""));

  const freeTrucks = useMemo(() => trucks.filter((truck) => truck.status === "free"), [trucks]);
  const selectedTruck = freeTrucks.find((truck) => truck.id === selectedTruckId);
  const canAssign = Boolean(bin && bin.status === "Filled" && !assignedTruck && selectedTruck);

  if (!bin) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-6">
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
    setTrucks((prev) =>
      prev.map((truck) =>
        truck.id === selectedTruck.id ? { ...truck, status: "busy" } : truck
      )
    );
    setSelectedTruckId("");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/bin-status"
          className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bin status
        </Link>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-6">
        <h1 className="text-2xl font-bold text-white">Bin assignment • {bin.id}</h1>
        <p className="mt-2 text-gray-400">{bin.address}</p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <span className={`h-3 w-3 rounded-full ${getStatusColor(bin.status)}`} />
            <span className="text-gray-300">Status: {bin.status}</span>
          </div>
          <p className="text-sm text-gray-300">Estimated weight: {bin.weight}</p>
          <p className="text-sm text-gray-300">
            Assigned truck: <span className="text-white">{assignedTruck || "Unassigned"}</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-6">
        <h2 className="text-xl font-semibold text-white">Assign truck if bin is full</h2>
        {bin.status !== "Filled" ? (
          <p className="mt-3 text-sm text-yellow-300">
            This bin cannot be assigned right now because it is not marked as Filled.
          </p>
        ) : assignedTruck ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            This full bin is already assigned to {assignedTruck}.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={selectedTruckId}
                onChange={(event) => setSelectedTruckId(event.target.value)}
                className="w-full sm:max-w-sm rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select a free truck</option>
                {freeTrucks.map((truck) => (
                  <option key={truck.id} value={truck.id}>
                    {truck.name}
                  </option>
                ))}
              </select>
              <button
                onClick={assignTruck}
                disabled={!canAssign}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Truck className="h-4 w-4" />
                Assign truck
              </button>
            </div>
            <p className="text-sm text-gray-400">
              Only trucks with status <span className="text-emerald-300">free</span> can be assigned.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
