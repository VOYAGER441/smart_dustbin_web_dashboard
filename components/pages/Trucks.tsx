"use client";

import Link from "next/link";
import { Coins, Truck } from "lucide-react";
import { trucksData } from "./data/trucksData";

export default function Trucks() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="w-8 h-8 text-gray-300" />
        <h1 className="text-3xl font-bold text-white">Trucks</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trucksData.map((truck) => (
          <div key={truck.id} className="rounded-xl border border-gray-800 bg-gray-900/80 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{truck.trackNumber}</p>
                <p className="mt-1 text-sm text-gray-400">Driver: {truck.driver}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                  truck.status === "free"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {truck.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-300">{truck.currentAssignment}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-emerald-300">
              <Coins className="h-4 w-4" />
              Green Coins: {truck.greenCoins}
            </p>

            <Link
              href={`/dashboard/trucks/${encodeURIComponent(truck.trackNumber)}`}
              className="mt-4 inline-flex items-center rounded-md border border-cyan-500/40 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10 transition-colors"
            >
              Open truck status
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
