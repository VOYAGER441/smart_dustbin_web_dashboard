import type { NextRequest } from "next/server";
import {
  getHistory,
  getLatest,
  getLatestForAll,
  recordTelemetry,
} from "@/lib/binTelemetry";

interface IngestPayload {
  dry?: { distance_cm?: unknown; full?: unknown };
  wet?: { distance_cm?: unknown; full?: unknown };
  ts?: unknown;
}

const DEFAULT_BIN_ID = "BIN-001";

export async function POST(request: NextRequest) {
  let body: IngestPayload;
  try {
    body = (await request.json()) as IngestPayload;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const dryDistance = Number(body?.dry?.distance_cm);
  const wetDistance = Number(body?.wet?.distance_cm);
  if (!Number.isFinite(dryDistance) || !Number.isFinite(wetDistance)) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const binId =
    new URL(request.url).searchParams.get("binId") ?? DEFAULT_BIN_ID;

  const reading = {
    binId,
    dry: {
      distance_cm: dryDistance,
      full: Boolean(body.dry?.full),
    },
    wet: {
      distance_cm: wetDistance,
      full: Boolean(body.wet?.full),
    },
    deviceTs: Number(body.ts ?? 0),
    receivedAt: Date.now(),
  };

  recordTelemetry(reading);

  return Response.json({ ok: true, binId, receivedAt: reading.receivedAt });
}

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const binId = params.get("binId");
  const historyParam = params.get("history");

  if (binId) {
    if (historyParam !== null) {
      const limit = Number.parseInt(historyParam, 10) || 50;
      return Response.json({ binId, history: getHistory(binId, limit) });
    }
    return Response.json({ binId, latest: getLatest(binId) });
  }

  return Response.json({ bins: getLatestForAll() });
}
