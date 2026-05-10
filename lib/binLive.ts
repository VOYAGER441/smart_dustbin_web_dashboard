"use client";

import { useEffect, useRef, useState } from "react";
import type { BinTelemetry } from "./binTelemetry";

export type { BinTelemetry } from "./binTelemetry";

export const LIVE_BIN_ID = "BIN-001";
export const POLL_MS = 2000;
export const STALE_AFTER_MS = 10_000;
export const EMPTY_DISTANCE_CM = 16;
export const FULL_DISTANCE_CM = 10;

export type LiveBinStatus = "Filled" | "Almost filled" | "Emptied";

export interface DerivedLiveBin {
  fillLevel: number;
  dryFill: number;
  wetFill: number;
  isFull: boolean;
  status: LiveBinStatus;
  online: boolean;
  receivedAt: number;
  deviceTs: number;
  dryDistanceCm: number;
  wetDistanceCm: number;
  dryFlagFull: boolean;
  wetFlagFull: boolean;
}

export function fillPercent(distanceCm: number): number {
  const span = EMPTY_DISTANCE_CM - FULL_DISTANCE_CM;
  if (span <= 0) return 0;
  const raw = ((EMPTY_DISTANCE_CM - distanceCm) / span) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function formatRelative(receivedAt: number, now: number): string {
  const diff = Math.max(0, now - receivedAt);
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function deriveLiveBin(
  telemetry: BinTelemetry,
  now: number
): DerivedLiveBin {
  const dryFill = fillPercent(telemetry.dry.distance_cm);
  const wetFill = fillPercent(telemetry.wet.distance_cm);
  const fillLevel = Math.max(dryFill, wetFill);
  const isFull = telemetry.dry.full || telemetry.wet.full;

  let status: LiveBinStatus;
  if (isFull || fillLevel >= 90) status = "Filled";
  else if (fillLevel >= 60) status = "Almost filled";
  else status = "Emptied";

  return {
    fillLevel,
    dryFill,
    wetFill,
    isFull,
    status,
    online: now - telemetry.receivedAt < STALE_AFTER_MS,
    receivedAt: telemetry.receivedAt,
    deviceTs: telemetry.deviceTs,
    dryDistanceCm: telemetry.dry.distance_cm,
    wetDistanceCm: telemetry.wet.distance_cm,
    dryFlagFull: telemetry.dry.full,
    wetFlagFull: telemetry.wet.full,
  };
}

export interface LiveBinHookResult {
  bins: BinTelemetry[];
  byId: Record<string, BinTelemetry>;
  now: number;
  error: string | null;
  hasFetched: boolean;
}

export function useLiveBins(): LiveBinHookResult {
  const [bins, setBins] = useState<BinTelemetry[]>([]);
  const [now, setNow] = useState<number>(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const tick = async () => {
      try {
        const res = await fetch("/api/v1/bin/ingest", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { bins?: BinTelemetry[] };
        if (cancelledRef.current) return;
        setBins(data.bins ?? []);
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

  const byId: Record<string, BinTelemetry> = {};
  for (const b of bins) byId[b.binId] = b;

  return { bins, byId, now, error, hasFetched };
}

export function useLiveBin(binId: string = LIVE_BIN_ID): {
  telemetry: BinTelemetry | null;
  derived: DerivedLiveBin | null;
  now: number;
  error: string | null;
  hasFetched: boolean;
} {
  const { byId, now, error, hasFetched } = useLiveBins();
  const telemetry = byId[binId] ?? null;
  return {
    telemetry,
    derived: telemetry ? deriveLiveBin(telemetry, now) : null,
    now,
    error,
    hasFetched,
  };
}
