export interface CitizenReport {
  id: string;
  title: string;
  category: string;
  status: "Pending" | "Verified" | "Action needed";
  time: string;
  comment: string;
}

export interface BinData {
  id: string;
  address: string;
  status: "Filled" | "Almost filled" | "Emptied";
  weight: string;
  truck: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  battery: number;
  fillLevel: number;
  temperature: number;
  networkStrength: number;
  lastVerified: string;
  condition: "Healthy" | "Attention" | "Critical";
  imageStatus: {
    camera: "Pending" | "Verified" | "Action needed";
    citizen: "Pending" | "Verified" | "Action needed";
  };
  reports: CitizenReport[];
}

export const binData: BinData[] = [
  {
    id: "BIN-001",
    address: "2464 Royal Ln. Mesa, New Jersey 45463",
    status: "Filled",
    weight: "12.4 ton",
    truck: "Unassigned",
    coordinates: { lat: 40.35, lng: -105.27 },
    battery: 76,
    fillLevel: 98,
    temperature: 29,
    networkStrength: 84,
    lastVerified: "2m ago",
    condition: "Attention",
    imageStatus: { camera: "Pending", citizen: "Pending" },
    reports: [
      {
        id: "R-001",
        title: "Overflowing waste",
        category: "Overflow",
        status: "Pending",
        time: "2m ago",
        comment: "Neighbor submitted a report that the bin is overflowing and emitting odor.",
      },
      {
        id: "R-002",
        title: "Sensor noise alert",
        category: "IoT anomaly",
        status: "Verified",
        time: "15m ago",
        comment: "Bin telemetry shows a sudden temperature spike and noisy signal.",
      },
    ],
  },
  {
    id: "BIN-002",
    address: "3891 Ranchview Dr. Richardson, California 6...",
    status: "Filled",
    weight: "TBD",
    truck: "RES-12 • TAX-1234",
    coordinates: { lat: 32.97, lng: -96.72 },
    battery: 62,
    fillLevel: 93,
    temperature: 27,
    networkStrength: 76,
    lastVerified: "5m ago",
    condition: "Attention",
    imageStatus: { camera: "Verified", citizen: "Pending" },
    reports: [
      {
        id: "R-003",
        title: "Bagged trash leak",
        category: "Maintenance",
        status: "Pending",
        time: "10m ago",
        comment: "Citizen image verifies a leaking bag around the bin perimeter.",
      },
    ],
  },
  {
    id: "BIN-003",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 854...",
    status: "Filled",
    weight: "12.2 ton",
    truck: "Unassigned",
    coordinates: { lat: 34.42, lng: -83.94 },
    battery: 83,
    fillLevel: 95,
    temperature: 30,
    networkStrength: 92,
    lastVerified: "8m ago",
    condition: "Healthy",
    imageStatus: { camera: "Verified", citizen: "Verified" },
    reports: [
      {
        id: "R-004",
        title: "Collection confirmation",
        category: "Verification",
        status: "Verified",
        time: "42m ago",
        comment: "Driver image confirm bin fullness and ready collection.",
      },
    ],
  },
  {
    id: "BIN-004",
    address: "3891 Ranchview Dr. Richardson, California 6...",
    status: "Almost filled",
    weight: "12 ton",
    truck: "RES-62 • VDS-1345",
    coordinates: { lat: 32.98, lng: -96.72 },
    battery: 88,
    fillLevel: 76,
    temperature: 24,
    networkStrength: 95,
    lastVerified: "12m ago",
    condition: "Healthy",
    imageStatus: { camera: "Verified", citizen: "Verified" },
    reports: [
      {
        id: "R-005",
        title: "Early pickup request",
        category: "Service",
        status: "Action needed",
        time: "30m ago",
        comment: "Request to dispatch an earlier collection because fill level is high.",
      },
    ],
  },
  {
    id: "BIN-005",
    address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    status: "Almost filled",
    weight: "12 ton",
    truck: "RES-91 • KKQ-5432",
    coordinates: { lat: 21.36, lng: -157.93 },
    battery: 91,
    fillLevel: 74,
    temperature: 25,
    networkStrength: 88,
    lastVerified: "24m ago",
    condition: "Healthy",
    imageStatus: { camera: "Verified", citizen: "Verified" },
    reports: [
      {
        id: "R-006",
        title: "Smell reported",
        category: "Hygiene",
        status: "Pending",
        time: "4h ago",
        comment: "Citizen reported a mild odor near the bin, suggest inspection.",
      },
    ],
  },
  {
    id: "BIN-006",
    address: "3517 W. Gray St. Utica, Pennsylvania 57867",
    status: "Emptied",
    weight: "12 ton",
    truck: "RES-32 • TAX-3455",
    coordinates: { lat: 43.10, lng: -75.23 },
    battery: 95,
    fillLevel: 12,
    temperature: 22,
    networkStrength: 99,
    lastVerified: "1h ago",
    condition: "Healthy",
    imageStatus: { camera: "Verified", citizen: "Verified" },
    reports: [
      {
        id: "R-007",
        title: "Completed collection",
        category: "Status",
        status: "Verified",
        time: "1h ago",
        comment: "Bin emptied by crew and verified by onboard camera.",
      },
    ],
  },
];

export const getStatusColor = (status: BinData["status"]) => {
  switch (status) {
    case "Filled":
      return "bg-red-500";
    case "Almost filled":
      return "bg-yellow-500";
    case "Emptied":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
