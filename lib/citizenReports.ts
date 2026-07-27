export type ReportCategory =
  | "Overflow"
  | "Maintenance"
  | "Hygiene"
  | "Pest"
  | "Damage"
  | "Other";

export type ReportStatus = "Pending" | "Verified" | "Action needed";

export interface CitizenReportRecord {
  id: string;
  binId: string;
  category: ReportCategory;
  description: string;
  reporterName?: string;
  reporterContact?: string;
  photoDataUrl?: string;
  status: ReportStatus;
  createdAt: number;
  updatedAt: number;
}

const MAX_REPORTS = 200;

declare global {
  var __citizenReports: CitizenReportRecord[] | undefined;
  var __citizenReportSeq: number | undefined;
}

const reports: CitizenReportRecord[] = globalThis.__citizenReports ?? [];
globalThis.__citizenReports = reports;
if (typeof globalThis.__citizenReportSeq !== "number") {
  globalThis.__citizenReportSeq = 0;
}

function nextId(): string {
  globalThis.__citizenReportSeq = (globalThis.__citizenReportSeq ?? 0) + 1;
  return `CR-${String(globalThis.__citizenReportSeq).padStart(4, "0")}`;
}

export interface CreateReportInput {
  binId: string;
  category: ReportCategory;
  description: string;
  reporterName?: string;
  reporterContact?: string;
  photoDataUrl?: string;
}

export function createReport(input: CreateReportInput): CitizenReportRecord {
  const now = Date.now();
  const record: CitizenReportRecord = {
    id: nextId(),
    binId: input.binId,
    category: input.category,
    description: input.description,
    reporterName: input.reporterName,
    reporterContact: input.reporterContact,
    photoDataUrl: input.photoDataUrl,
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  };
  reports.unshift(record);
  if (reports.length > MAX_REPORTS) {
    reports.length = MAX_REPORTS;
  }
  return record;
}

export function listReports(binId?: string): CitizenReportRecord[] {
  if (!binId) return [...reports];
  const upper = binId.toUpperCase();
  return reports.filter((r) => r.binId.toUpperCase() === upper);
}

export function updateReportStatus(
  id: string,
  status: ReportStatus
): CitizenReportRecord | null {
  const record = reports.find((r) => r.id === id);
  if (!record) return null;
  record.status = status;
  record.updatedAt = Date.now();
  return record;
}
