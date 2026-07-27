import type { NextRequest } from "next/server";
import {
  createReport,
  listReports,
  updateReportStatus,
  type ReportCategory,
  type ReportStatus,
} from "@/lib/citizenReports";

const VALID_CATEGORIES: readonly ReportCategory[] = [
  "Overflow",
  "Maintenance",
  "Hygiene",
  "Pest",
  "Damage",
  "Other",
];

const VALID_STATUSES: readonly ReportStatus[] = [
  "Pending",
  "Verified",
  "Action needed",
];

const MAX_PHOTO_BYTES = 3_500_000;

interface CreateBody {
  binId?: unknown;
  category?: unknown;
  description?: unknown;
  reporterName?: unknown;
  reporterContact?: unknown;
  photoDataUrl?: unknown;
}

interface PatchBody {
  id?: unknown;
  status?: unknown;
}

export async function POST(request: NextRequest) {
  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const binId = typeof body.binId === "string" ? body.binId.trim() : "";
  const category = typeof body.category === "string" ? body.category : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (!binId) return Response.json({ error: "binId_required" }, { status: 400 });
  if (!description)
    return Response.json({ error: "description_required" }, { status: 400 });
  if (!VALID_CATEGORIES.includes(category as ReportCategory)) {
    return Response.json({ error: "invalid_category" }, { status: 400 });
  }

  const photoDataUrl =
    typeof body.photoDataUrl === "string" && body.photoDataUrl.startsWith("data:image/")
      ? body.photoDataUrl
      : undefined;
  if (photoDataUrl && photoDataUrl.length > MAX_PHOTO_BYTES) {
    return Response.json({ error: "photo_too_large" }, { status: 413 });
  }

  const record = createReport({
    binId,
    category: category as ReportCategory,
    description,
    reporterName:
      typeof body.reporterName === "string" && body.reporterName.trim()
        ? body.reporterName.trim().slice(0, 80)
        : undefined,
    reporterContact:
      typeof body.reporterContact === "string" && body.reporterContact.trim()
        ? body.reporterContact.trim().slice(0, 80)
        : undefined,
    photoDataUrl,
  });

  return Response.json({ ok: true, report: record }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const binId = url.searchParams.get("binId") ?? undefined;
  const includePhotos = url.searchParams.get("photos") === "1";

  const records = listReports(binId);
  const sanitized = includePhotos
    ? records
    : records.map(({ photoDataUrl, ...rest }) => ({
        ...rest,
        hasPhoto: Boolean(photoDataUrl),
      }));

  return Response.json({ reports: sanitized });
}

export async function PATCH(request: NextRequest) {
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id) return Response.json({ error: "id_required" }, { status: 400 });
  if (!VALID_STATUSES.includes(status as ReportStatus)) {
    return Response.json({ error: "invalid_status" }, { status: 400 });
  }

  const updated = updateReportStatus(id, status as ReportStatus);
  if (!updated) return Response.json({ error: "not_found" }, { status: 404 });

  return Response.json({ ok: true, report: updated });
}
