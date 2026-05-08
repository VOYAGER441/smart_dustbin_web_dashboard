export interface BinData {
  id: string;
  address: string;
  status: "Filled" | "Almost filled" | "Emptied";
  weight: string;
  truck: string;
}

export const binData: BinData[] = [
  {
    id: "BIN-001",
    address: "2464 Royal Ln. Mesa, New Jersey 45463",
    status: "Filled",
    weight: "12 ton",
    truck: "Unassigned",
  },
  {
    id: "BIN-002",
    address: "3891 Ranchview Dr. Richardson, California 6...",
    status: "Filled",
    weight: "TBD",
    truck: "RES-12 • TAX-1234",
  },
  {
    id: "BIN-003",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 854...",
    status: "Filled",
    weight: "12 ton",
    truck: "Unassigned",
  },
  {
    id: "BIN-004",
    address: "3891 Ranchview Dr. Richardson, California 6...",
    status: "Almost filled",
    weight: "12 ton",
    truck: "RES-62 • VDS-1345",
  },
  {
    id: "BIN-005",
    address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    status: "Almost filled",
    weight: "12 ton",
    truck: "RES-91 • KKQ-5432",
  },
  {
    id: "BIN-006",
    address: "3517 W. Gray St. Utica, Pennsylvania 57867",
    status: "Emptied",
    weight: "12 ton",
    truck: "RES-32 • TAX-3455",
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
