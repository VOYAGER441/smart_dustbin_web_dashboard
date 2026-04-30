"use client";

import { User, Plus } from "lucide-react";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  status: "empty" | "filled";
  name?: string;
}

const mockMarkers: MapMarker[] = [
  { id: "1", lat: 40.35, lng: -105.27, status: "empty", name: "Eastwood" },
  { id: "2", lat: 40.32, lng: -105.24, status: "filled", name: "Downtown" },
  { id: "3", lat: 40.36, lng: -105.21, status: "empty", name: "North Park" },
  { id: "4", lat: 40.33, lng: -105.28, status: "filled", name: "West Side" },
  { id: "5", lat: 40.34, lng: -105.25, status: "empty", name: "Central" },
  { id: "6", lat: 40.31, lng: -105.26, status: "empty", name: "South End" },
  { id: "7", lat: 40.35, lng: -105.29, status: "filled", name: "East Hill" },
];

export default function Map() {
  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-yellow-100 to-green-50 rounded-lg overflow-hidden border border-gray-300">
      {/* Mock Map Container */}
      <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 800 400">
        {/* Roads */}
        <line x1="150" y1="0" x2="150" y2="400" stroke="#ddd" strokeWidth="4" />
        <line x1="350" y1="0" x2="350" y2="400" stroke="#ddd" strokeWidth="4" />
        <line x1="550" y1="0" x2="550" y2="400" stroke="#ddd" strokeWidth="4" />
        <line x1="0" y1="100" x2="800" y2="100" stroke="#ddd" strokeWidth="4" />
        <line x1="0" y1="200" x2="800" y2="200" stroke="#ddd" strokeWidth="4" />
        <line x1="0" y1="300" x2="800" y2="300" stroke="#ddd" strokeWidth="4" />

        {/* Areas */}
        <rect x="50" y="50" width="200" height="150" fill="#e8f4f8" opacity="0.5" stroke="#b0d4e3" strokeWidth="1" />
        <rect x="250" y="50" width="200" height="150" fill="#e8f4f8" opacity="0.5" stroke="#b0d4e3" strokeWidth="1" />
        <rect x="450" y="50" width="200" height="150" fill="#e8f4f8" opacity="0.5" stroke="#b0d4e3" strokeWidth="1" />
        <rect x="50" y="200" width="200" height="150" fill="#e8f4f8" opacity="0.5" stroke="#b0d4e3" strokeWidth="1" />
        <rect x="250" y="200" width="200" height="150" fill="#e8f4f8" opacity="0.5" stroke="#b0d4e3" strokeWidth="1" />
        <rect x="450" y="200" width="200" height="150" fill="#e8f4f8" opacity="0.5" stroke="#b0d4e3" strokeWidth="1" />

        {/* Markers */}
        {mockMarkers.map((marker) => (
          <g key={marker.id}>
            <circle
              cx={marker.lat * 20}
              cy={marker.lng * 2}
              r="8"
              fill={marker.status === "filled" ? "#eab308" : "#22c55e"}
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx={marker.lat * 20}
              cy={marker.lng * 2}
              r="5"
              fill={marker.status === "filled" ? "#ca8a04" : "#16a34a"}
            />
          </g>
        ))}

        {/* Labels */}
        <text x="150" y="30" fontSize="12" fill="#666" textAnchor="middle">
          Woodlane Ave
        </text>
        <text x="350" y="30" fontSize="12" fill="#666" textAnchor="middle">
          Main St
        </text>
        <text x="30" y="105" fontSize="12" fill="#666">
          Dublin Blvd
        </text>
        <text x="30" y="205" fontSize="12" fill="#666">
          Victoria Dr
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 space-y-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-700 text-xs font-medium">Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-700 text-xs font-medium">Filled</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <button className="bg-white text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
          <User className="w-4 h-4" />
        </button>
        <button className="bg-white text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
