"use client";

import { useState } from "react";
import { Search, ChevronDown, Wifi, Trash2, Lock } from "lucide-react";

interface BinData {
  id: string;
  address: string;
  status: "Filled" | "Almost filled" | "Emptied";
  weight: string;
  truck: string;
}

type SortOption = "Status" | "Location" | "Weight";
type StatusFilter = "All" | BinData["status"];

const binData: BinData[] = [
  {
    id: "BIN-001",
    address: "2464 Royal Ln. Mesa, New Jersey 45463",
    status: "Filled",
    weight: "12 ton",
    truck: "RES-12 • TAX-1234",
  },
  {
    id: "BIN-002",
    address: "3891 Ranchview Dr. Richardson, California 6...",
    status: "Filled",
    weight: "TBD",
    truck: "RES-Ab • OMO-2234",
  },
  {
    id: "BIN-003",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 854...",
    status: "Filled",
    weight: "12 ton",
    truck: "RES-32 • TAX-3455",
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

const getStatusColor = (status: string) => {
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

export default function BinStatus() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("Status");
  const [show, setShow] = useState<StatusFilter>("All");

  const filteredData = binData
    .filter((item) => item.address.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((item) => show === "All" || item.status === show);

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "Location":
        return a.address.localeCompare(b.address);
      case "Weight": {
        const weightA = Number.parseFloat(a.weight);
        const weightB = Number.parseFloat(b.weight);
        const normalizedA = Number.isNaN(weightA) ? -1 : weightA;
        const normalizedB = Number.isNaN(weightB) ? -1 : weightB;
        return normalizedB - normalizedA;
      }
      case "Status":
      default:
        return a.status.localeCompare(b.status);
    }
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Trash2 className="w-8 h-8 text-gray-400" />
        <h1 className="text-3xl font-bold text-white">Bin status</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Registered device</p>
              <h3 className="text-4xl font-bold text-white">12,233</h3>
              <p className="text-gray-500 text-xs mt-2">Total devices enrolled</p>
            </div>
            <Lock className="w-6 h-6 text-cyan-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Total active</p>
              <h3 className="text-4xl font-bold text-white">10,120</h3>
              <p className="text-gray-500 text-xs mt-2">Devices online (last 15m)</p>
            </div>
            <Wifi className="w-6 h-6 text-cyan-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Un-filled bin</p>
              <h3 className="text-4xl font-bold text-white">4,112</h3>
              <p className="text-gray-500 text-xs mt-2">Bins placed in the field</p>
            </div>
            <Trash2 className="w-6 h-6 text-cyan-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search province name, postal codes, street names, etc"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-gray-400 text-sm">
              Sort by
            </label>
            <div className="relative">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="appearance-none bg-gray-800 text-gray-300 rounded-lg pl-3 pr-9 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Status">Status</option>
                <option value="Location">Location</option>
                <option value="Weight">Weight</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-gray-400 text-sm">
              Show
            </label>
            <div className="relative">
              <select
                id="status-filter"
                value={show}
                onChange={(event) => setShow(event.target.value as StatusFilter)}
                className="appearance-none bg-gray-800 text-gray-300 rounded-lg pl-3 pr-9 py-2 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">All</option>
                <option value="Filled">Filled</option>
                <option value="Almost filled">Almost filled</option>
                <option value="Emptied">Emptied</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Province/Area</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">IoT Report</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Est. Weight</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Truck Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-300">{item.address}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                    <span className="text-gray-300">{item.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{item.weight}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{item.truck}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-gray-400 text-sm">Showing {sortedData.length} entries</p>
        <div className="flex gap-2">
          <button className="bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-sm hover:bg-gray-700 transition-colors">
            Previous
          </button>
          <button className="bg-gray-800 text-gray-400 rounded-lg px-3 py-2 text-sm hover:bg-gray-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
