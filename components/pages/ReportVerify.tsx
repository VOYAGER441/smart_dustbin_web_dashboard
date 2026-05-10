"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ExternalLink,
  ImageOff,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import Map from "@/components/ui/Map";
import { binData } from "./data/binStatusData";

const POLL_MS = 4000;

type ReportStatus = "Pending" | "Verified" | "Action needed";

interface ReportRow {
  id: string;
  binId: string;
  category: string;
  description: string;
  reporterName?: string;
  reporterContact?: string;
  hasPhoto?: boolean;
  photoDataUrl?: string;
  status: ReportStatus;
  createdAt: number;
  updatedAt: number;
}

function formatRelative(ms: number, now: number): string {
  const diff = Math.max(0, now - ms);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function ReportVerify() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [photoCache, setPhotoCache] = useState<Record<string, string>>({});
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/v1/citizen-report", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { reports?: ReportRow[] };
        if (cancelledRef.current) return;
        setReports(data.reports ?? []);
        setError(null);
      } catch (e) {
        if (cancelledRef.current) return;
        setError(e instanceof Error ? e.message : "fetch failed");
      } finally {
        if (!cancelledRef.current) setHasFetched(true);
      }
    };
    tick();
    const fetchTimer = setInterval(tick, POLL_MS);
    const clockTimer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelledRef.current = true;
      clearInterval(fetchTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedId) ?? null,
    [reports, selectedId]
  );

  // Fetch photo for the selected report on demand (full payload)
  useEffect(() => {
    if (!selectedReport) return;
    if (!selectedReport.hasPhoto) return;
    if (photoCache[selectedReport.id]) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/v1/citizen-report?binId=${encodeURIComponent(selectedReport.binId)}&photos=1`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { reports?: ReportRow[] };
        const rec = data.reports?.find((r) => r.id === selectedReport.id);
        if (!cancelled && rec?.photoDataUrl) {
          setPhotoCache((curr) => ({ ...curr, [selectedReport.id]: rec.photoDataUrl ?? "" }));
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedReport, photoCache]);

  const updateStatus = async (id: string, status: ReportStatus) => {
    setReports((curr) => curr.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch("/api/v1/citizen-report", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      /* optimistic update; next poll will reconcile */
    }
  };

  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const actionCount = reports.filter((r) => r.status === "Action needed").length;
  const binAddress = (binId: string) =>
    binData.find((b) => b.id.toUpperCase() === binId.toUpperCase())?.address ?? binId;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
            <Camera className="w-4 h-4" /> Citizen reports
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Citizen report review</h1>
            <p className="mt-2 text-gray-400">
              Reports submitted by citizens via the QR sticker on each dustbin land here for triage.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Verification queue</h2>
                <p className="text-gray-400 mt-2">Newest reports surface first; act on the pending ones.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Total" value={reports.length} />
                <Stat label="Pending" value={pendingCount} />
                <Stat label="Action" value={actionCount} />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl border border-red-700/60 bg-red-900/20 p-4 text-sm text-red-200">
              Failed to load reports: {error}
            </div>
          )}

          {hasFetched && reports.length === 0 && !error && (
            <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-10 text-center">
              <ImageOff className="w-10 h-10 text-gray-500 mx-auto" />
              <h3 className="mt-4 text-xl font-semibold text-white">No reports yet</h3>
              <p className="mt-2 text-gray-400 max-w-xl mx-auto">
                Once citizens scan a bin&apos;s QR code and submit issues, they&apos;ll appear here in real time.
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedId(report.id)}
                className="group rounded-3xl border border-gray-800 bg-gray-950/90 p-6 text-left transition hover:border-cyan-500/50 hover:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{report.category}</p>
                      <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-mono text-gray-400">
                        {report.id}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-white truncate">
                      {report.binId} · {binAddress(report.binId).split(",")[0]}
                    </h3>
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">{report.description}</p>
                  </div>
                  <div className="space-y-2 text-right shrink-0">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        report.status === "Verified"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : report.status === "Action needed"
                          ? "bg-yellow-500/10 text-yellow-300"
                          : "bg-slate-700/80 text-gray-300"
                      }`}
                    >
                      {report.status}
                    </span>
                    <p className="text-xs text-gray-500">{formatRelative(report.createdAt, now)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    {report.hasPhoto ? <Camera className="w-3.5 h-3.5 text-cyan-300" /> : null}
                    {report.hasPhoto ? "Photo attached" : "No photo"}
                  </span>
                  {report.reporterName && <span>by {report.reporterName}</span>}
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
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Bin overlay</p>
                <p className="mt-2 text-xl font-semibold">Where reports cluster</p>
              </div>
            </div>
            <p className="mt-4 text-gray-400">
              Live OpenStreetMap of every monitored bin in the area.
            </p>
            <div className="mt-6">
              <Map height={320} />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center gap-3 text-white">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">QR workflow</p>
                <p className="mt-2 text-xl font-semibold">How reports arrive</p>
              </div>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-300">
              <li>Each bin has a sticker with a unique QR code.</li>
              <li>
                The QR points to <code className="text-cyan-300">/report/&lt;binId&gt;</code> on this app.
              </li>
              <li>Citizens scan, fill the form, and submit.</li>
              <li>Reports show here within a few seconds.</li>
            </ol>
            <p className="mt-4 text-xs text-gray-500">
              Tip: open any bin&apos;s detail page to copy or print its QR.
            </p>
          </div>
        </aside>
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          photoSrc={photoCache[selectedReport.id]}
          binAddress={binAddress(selectedReport.binId)}
          onClose={() => setSelectedId(null)}
          onUpdateStatus={(s) => updateStatus(selectedReport.id, s)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-gray-950/80 p-4 text-sm text-gray-300">
      <p className="text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ReportDetailModal({
  report,
  photoSrc,
  binAddress,
  onClose,
  onUpdateStatus,
}: {
  report: ReportRow;
  photoSrc?: string;
  binAddress: string;
  onClose: () => void;
  onUpdateStatus: (status: ReportStatus) => void;
}) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">
        <button
          onClick={onClose}
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
                <p className="text-sm uppercase tracking-[0.24em] text-gray-400">{report.category}</p>
                <h2 className="text-2xl font-semibold text-white">{report.binId}</h2>
                <p className="text-xs text-gray-500 font-mono mt-1">{report.id}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[2rem] border border-gray-800 bg-gray-900/80 overflow-hidden">
              <div className="relative h-72 w-full bg-slate-950">
                {report.hasPhoto && photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt={`${report.id} photo`}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="object-contain"
                  />
                ) : report.hasPhoto ? (
                  <div className="flex h-full items-center justify-center text-sm text-gray-500">
                    Loading photo…
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
                    <div>
                      <ImageOff className="mx-auto h-8 w-8 text-gray-600" />
                      <p className="mt-3">No photo attached</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-3xl border border-gray-800 bg-gray-950/80 p-6">
              <div>
                <p className="text-sm text-gray-400">Description</p>
                <p className="mt-2 text-gray-200 whitespace-pre-wrap">{report.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Bin location</p>
                <p className="mt-2 text-white">{binAddress}</p>
              </div>
              {(report.reporterName || report.reporterContact) && (
                <div>
                  <p className="text-sm text-gray-400">Reporter</p>
                  <p className="mt-2 text-white">
                    {report.reporterName || "Anonymous"}
                    {report.reporterContact ? ` · ${report.reporterContact}` : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Status</p>
              <p className="mt-3 text-2xl font-semibold text-white">{report.status}</p>
              <p className="mt-2 text-sm text-gray-400">
                Submitted {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Actions</p>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => onUpdateStatus("Verified")}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-400"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark verified
                </button>
                <button
                  onClick={() => onUpdateStatus("Action needed")}
                  className="rounded-3xl border border-yellow-500 px-4 py-3 text-sm font-semibold text-yellow-300 hover:bg-yellow-500/10"
                >
                  Flag for field team
                </button>
                <Link
                  href={`/dashboard/bin-status/${encodeURIComponent(report.binId)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl border border-gray-700 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Open bin detail <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
