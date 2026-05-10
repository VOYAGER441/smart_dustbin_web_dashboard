"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Printer, QrCode } from "lucide-react";

interface BinQrCardProps {
  binId: string;
}

export default function BinQrCard({ binId }: BinQrCardProps) {
  const [origin, setOrigin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const reportUrl = origin ? `${origin}/report/${encodeURIComponent(binId)}` : "";
  const qrSrc = reportUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(reportUrl)}`
    : "";

  const copyUrl = async () => {
    if (!reportUrl) return;
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be denied; ignore */
    }
  };

  const printQr = () => {
    if (!reportUrl) return;
    const w = window.open("", "_blank", "noopener,noreferrer,width=420,height=560");
    if (!w) return;
    w.document.write(`<!doctype html>
<html>
  <head>
    <title>${binId} QR sticker</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
      .badge { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #0e7490; }
      h1 { font-size: 28px; margin: 4px 0; }
      img { width: 320px; height: 320px; border: 1px solid #e5e7eb; padding: 8px; border-radius: 16px; }
      p { font-size: 12px; color: #475569; max-width: 320px; text-align: center; }
      .url { font-family: ui-monospace, monospace; font-size: 11px; color: #0f172a; word-break: break-all; max-width: 320px; text-align: center; }
      @media print { body { padding: 0; } }
    </style>
  </head>
  <body>
    <span class="badge">Smart Dustbin · Report</span>
    <h1>${binId}</h1>
    <img src="${qrSrc}" alt="${binId} QR" />
    <p>Scan to report an issue with this bin (overflow, damage, smell, etc.)</p>
    <div class="url">${reportUrl}</div>
    <script>window.onload = () => setTimeout(() => window.print(), 250);</script>
  </body>
</html>`);
    w.document.close();
  };

  return (
    <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
      <div className="flex items-center gap-3 text-white">
        <QrCode className="w-5 h-5 text-cyan-300" />
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Citizen QR sticker</p>
          <p className="mt-2 text-xl font-semibold">Scan to report</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-400">
        Print this QR and stick it on the bin. Citizens scan to land directly on the report form for{" "}
        <span className="font-mono text-cyan-300">{binId}</span>.
      </p>

      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="rounded-2xl bg-white p-3">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrSrc} alt={`${binId} report QR`} width={200} height={200} />
          ) : (
            <div className="h-[200px] w-[200px] animate-pulse rounded-md bg-gray-200" />
          )}
        </div>

        <div className="w-full rounded-2xl bg-gray-950/70 p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Target URL</p>
          <p className="mt-1 break-all font-mono text-xs text-cyan-200">
            {reportUrl || "Resolving…"}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={copyUrl}
            disabled={!reportUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <button
            type="button"
            onClick={printQr}
            disabled={!reportUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            Print sticker
          </button>
        </div>
      </div>
    </div>
  );
}
