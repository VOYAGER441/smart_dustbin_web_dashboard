export interface ChamberReading {
  distance_cm: number;
  full: boolean;
}

export interface BinTelemetry {
  binId: string;
  dry: ChamberReading;
  wet: ChamberReading;
  deviceTs: number;
  receivedAt: number;
}

const MAX_HISTORY = 200;

declare global {
  var __binTelemetryStore: Map<string, BinTelemetry[]> | undefined;
}

const store: Map<string, BinTelemetry[]> =
  globalThis.__binTelemetryStore ?? new Map<string, BinTelemetry[]>();
globalThis.__binTelemetryStore = store;

export function recordTelemetry(reading: BinTelemetry): void {
  const history = store.get(reading.binId) ?? [];
  history.push(reading);
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }
  store.set(reading.binId, history);
}

export function getLatest(binId: string): BinTelemetry | null {
  const h = store.get(binId);
  return h && h.length > 0 ? h[h.length - 1] : null;
}

export function getLatestForAll(): BinTelemetry[] {
  const out: BinTelemetry[] = [];
  for (const history of store.values()) {
    if (history.length > 0) out.push(history[history.length - 1]);
  }
  return out.sort((a, b) => b.receivedAt - a.receivedAt);
}

export function getHistory(binId: string, limit = 50): BinTelemetry[] {
  const h = store.get(binId);
  if (!h) return [];
  return h.slice(-limit);
}
