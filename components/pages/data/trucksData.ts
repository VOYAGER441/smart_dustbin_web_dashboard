export type TruckAvailability = "free" | "assigned";

export interface CleaningHistoryItem {
  id: string;
  binId: string;
  cleanedAt: string;
  collector: string;
  proofImage: string;
}

export interface TruckData {
  id: string;
  trackNumber: string;
  driver: string;
  status: TruckAvailability;
  greenCoins: number;
  currentAssignment: string;
  cleanHistory: CleaningHistoryItem[];
}

const createProofImage = (label: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
      <rect width="100%" height="100%" fill="${color}" />
      <rect x="24" y="24" width="592" height="312" rx="16" fill="rgba(15,23,42,0.45)" />
      <text x="50%" y="50%" fill="#e2e8f0" font-size="34" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">
        ${label}
      </text>
    </svg>`
  )}`;

export const trucksData: TruckData[] = [
  {
    id: "truck-1",
    trackNumber: "TRK-101",
    driver: "Aman Sharma",
    status: "assigned",
    greenCoins: 240,
    currentAssignment: "BIN-001 • Green Park",
    cleanHistory: [
      {
        id: "h-101-1",
        binId: "BIN-001",
        cleanedAt: "2026-05-08 09:10",
        collector: "Ravi Kumar",
        proofImage: createProofImage("BIN-001 Cleaned", "#0f766e"),
      },
      {
        id: "h-101-2",
        binId: "BIN-011",
        cleanedAt: "2026-05-07 14:40",
        collector: "Ravi Kumar",
        proofImage: createProofImage("BIN-011 Cleaned", "#1d4ed8"),
      },
    ],
  },
  {
    id: "truck-2",
    trackNumber: "TRK-202",
    driver: "Priya Mehta",
    status: "free",
    greenCoins: 150,
    currentAssignment: "No active assignment",
    cleanHistory: [
      {
        id: "h-202-1",
        binId: "BIN-022",
        cleanedAt: "2026-05-07 10:20",
        collector: "Mehul Patel",
        proofImage: createProofImage("BIN-022 Cleaned", "#a16207"),
      },
    ],
  },
  {
    id: "truck-3",
    trackNumber: "TRK-303",
    driver: "Karan Singh",
    status: "assigned",
    greenCoins: 305,
    currentAssignment: "BIN-003 • River Front",
    cleanHistory: [
      {
        id: "h-303-1",
        binId: "BIN-003",
        cleanedAt: "2026-05-08 11:05",
        collector: "Karan Singh",
        proofImage: createProofImage("BIN-003 Cleaned", "#be123c"),
      },
      {
        id: "h-303-2",
        binId: "BIN-018",
        cleanedAt: "2026-05-06 16:30",
        collector: "Karan Singh",
        proofImage: createProofImage("BIN-018 Cleaned", "#0369a1"),
      },
    ],
  },
];
