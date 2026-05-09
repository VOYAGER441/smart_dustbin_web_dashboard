"use client";

import { useState } from "react";
import { ArrowLeft, Camera, CheckCircle2, MapPin, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import Map from "@/components/ui/Map";

type ReportCard = {
  id: string;
  title: string;
  category: string;
  status: "Pending" | "Accepted" | "Action needed";
  location: string;
  timestamp: string;
  detail: string;
  source: "Citizen" | "IoT";
};

const reports: ReportCard[] = [
  {
    id: "RP-101",
    title: "Overflowing street bin",
    category: "Overflow",
    status: "Pending",
    location: "Downtown Ridge",
    timestamp: "3m ago",
    detail: "Community image shows overflowing trash and a blocked walkway.",
    source: "Citizen",
  },
  {
    id: "RP-102",
    title: "Broken lid sensor",
    category: "Maintenance",
    status: "Action needed",
    location: "West Creek",
    timestamp: "12m ago",
    detail: "Camera feed indicates lid is stuck open after the last collection.",
    source: "IoT",
  },
  {
    id: "RP-103",
    title: "Smell near bin",
    category: "Hygiene",
    status: "Accepted",
    location: "Harbor Gate",
    timestamp: "22m ago",
    detail: "Citizen report confirms odor and recommends next collection shift.",
    source: "Citizen",
  },
];

export default function ReportVerify() {
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  const pendingCount = reports.filter((report) => report.status === "Pending").length;
  const actionCount = reports.filter((report) => report.status === "Action needed").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
            <Camera className="w-4 h-4" /> Report verification
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Citizen report review</h1>
            <p className="mt-2 text-gray-400">Verify images, confirm issues, and dispatch field teams from one centralized view.</p>
          </div>
        </div>
        <Link
          href="/dashboard/bin-status"
          className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/80 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to bin status
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Verification queue</h2>
                <p className="text-gray-400 mt-2">Open image reports waiting for review and dispatch.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-gray-950/80 p-4 text-sm text-gray-300">
                  <p className="text-gray-400">Total reports</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{reports.length}</p>
                </div>
                <div className="rounded-3xl bg-gray-950/80 p-4 text-sm text-gray-300">
                  <p className="text-gray-400">Pending</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{pendingCount}</p>
                </div>
                <div className="rounded-3xl bg-gray-950/80 p-4 text-sm text-gray-300">
                  <p className="text-gray-400">Action needed</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{actionCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedReport(report)}
                className="group rounded-3xl border border-gray-800 bg-gray-950/90 p-6 text-left transition hover:border-cyan-500/50 hover:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{report.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{report.title}</h3>
                    <p className="mt-3 text-gray-400 max-w-xl">{report.detail}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        report.status === "Accepted"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : report.status === "Action needed"
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "bg-slate-700/80 text-gray-300"
                      }`}
                    >
                      {report.status}
                    </span>
                    <p className="text-sm text-gray-500">{report.timestamp}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-cyan-300">
                  <span>{report.source} image</span>
                  <span className="font-semibold">View large</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Map overlay</p>
                <p className="mt-2 text-xl font-semibold">City bin locations</p>
              </div>
            </div>
            <p className="mt-4 text-gray-400">Visualize where incoming citizen reports are clustered and where drivers should prioritize.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-gray-800">
              <Map />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Verify workflow</p>
                <p className="mt-2 text-xl font-semibold">Driver-ready checks</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="rounded-3xl bg-gray-950/70 p-4">
                <p className="font-semibold text-white">Verify image type</p>
                <p className="mt-2 text-gray-400">Confirm whether this is a real citizen report or IoT camera event.</p>
              </div>
              <div className="rounded-3xl bg-gray-950/70 p-4">
                <p className="font-semibold text-white">Dispatch event</p>
                <p className="mt-2 text-gray-400">Flag high-priority cases for driver response.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-gray-900/90 text-gray-300 hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] p-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-400">{selectedReport.source} verification</p>
                    <h2 className="text-2xl font-semibold text-white">{selectedReport.title}</h2>
                  </div>
                </div>
                <div className="mt-6 rounded-[2rem] border border-gray-800 bg-gray-900/80 p-8 text-center text-gray-500">
                  <div className="flex h-80 items-center justify-center rounded-3xl bg-slate-950">
                    <p className="max-w-lg text-gray-400">
                      Large preview of the selected image report. Review the scene, check whether the bin is full, and confirm next action for the driver.
                    </p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 rounded-3xl border border-gray-800 bg-gray-950/80 p-6">
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="mt-2 text-white">{selectedReport.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Report details</p>
                    <p className="mt-2 text-gray-300">{selectedReport.detail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Report id</p>
                    <p className="mt-2 text-white">{selectedReport.id}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Status</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{selectedReport.status}</p>
                  <p className="mt-2 text-sm text-gray-400">{selectedReport.timestamp}</p>
                </div>
                <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Actions</p>
                  <div className="mt-4 flex flex-col gap-3">
                    <button className="rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400">
                      Accept report
                    </button>
                    <button className="rounded-3xl border border-yellow-500 px-4 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/10">
                      Flag for field team
                    </button>
                  </div>
                </div>
                <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Driver dispatch</p>
                  <p className="mt-3 text-gray-300">When verified, route the closest driver and update the bin location overlay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
