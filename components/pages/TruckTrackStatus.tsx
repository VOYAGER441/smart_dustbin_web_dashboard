"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Coins, History, Truck } from "lucide-react";
import { trucksData } from "./data/trucksData";

interface TruckTrackStatusProps {
  trackNumber: string;
}

export default function TruckTrackStatus({ trackNumber }: TruckTrackStatusProps) {
  const normalizedTrackNumber = decodeURIComponent(trackNumber).toUpperCase();
  const truck = trucksData.find(
    (item) => item.trackNumber.toUpperCase() === normalizedTrackNumber
  );

  if (!truck) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-6">
          <h1 className="text-2xl font-bold text-white">Truck not found</h1>
          <p className="mt-2 text-gray-400">
            No truck matches track number: {normalizedTrackNumber}
          </p>
          <Link
            href="/dashboard/trucks"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to trucks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <Link
        href="/dashboard/trucks"
        className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to trucks
      </Link>

      <section className="rounded-xl border border-gray-800 bg-gray-900/80 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="inline-flex items-center gap-2 text-3xl font-bold text-white">
              <Truck className="h-7 w-7 text-gray-300" />
              {truck.trackNumber}
            </h1>
            <p className="text-sm text-gray-400">Driver: {truck.driver}</p>
            <p className="text-sm text-gray-300">Current assignment: {truck.currentAssignment}</p>
          </div>

          <div className="space-y-2">
            <p
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                truck.status === "free"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {truck.status}
            </p>
            <p className="flex items-center gap-2 text-emerald-300">
              <Coins className="h-5 w-5" />
              Green Coins: <span className="font-semibold text-white">{truck.greenCoins}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-800 bg-gray-900/80 p-6">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
          <History className="h-5 w-5 text-gray-300" />
          Clean history with images
        </h2>

        {truck.cleanHistory.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">No cleanup history for this truck yet.</p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {truck.cleanHistory.map((entry) => (
              <article key={entry.id} className="rounded-xl border border-gray-700 bg-gray-950 p-4">
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={entry.proofImage}
                    alt={`${entry.binId} clean proof`}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-semibold text-white">{entry.binId}</p>
                  <p className="text-xs text-gray-400">Cleaned at: {entry.cleanedAt}</p>
                  <p className="text-xs text-gray-300">Collector: {entry.collector}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
