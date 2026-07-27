"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  FileText,
  HardHat,
  Menu,
  Search,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { formatRelative, useLiveBin } from "@/lib/binLive";

interface DashboardShellProps {
  children: ReactNode;
}

const menuItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/bin-status", label: "Bin status", icon: Trash2 },
  { href: "/dashboard/trucks", label: "Trucks", icon: Truck },
  { href: "/dashboard/report", label: "Reports", icon: FileText },
] as const;

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { derived, now } = useLiveBin();

  return (
    <div className="flex h-screen bg-gray-950">
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } bg-gray-900 border-r border-gray-800 overflow-hidden transition-all duration-300 flex flex-col`}
      >
        <div className="h-20 border-b border-gray-800 flex items-center px-6 gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center font-bold text-gray-900">
            WD
          </div>
          <div>
            <div className="text-sm font-bold text-white">Waste delivery</div>
            <div className="text-xs text-gray-400">v1.0 · Admin</div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search all pages"
              className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-cyan-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="mt-4 border-t border-gray-800 pt-3">
            <p className="px-2 text-[10px] uppercase tracking-wider text-gray-500">
              Field roles
            </p>
            <Link
              href="/dashboardForCollector"
              className="mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <HardHat className="w-4 h-4" />
              <span>Collector view</span>
            </Link>
          </div>
        </nav>

        <div className="border-t border-gray-800 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 text-sm rounded-lg hover:text-white hover:bg-gray-800 transition-colors">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="h-20 border-b border-gray-800 flex items-center px-6 gap-4 bg-gray-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex-1" />
          <div className="text-gray-400 text-sm">
            {derived
              ? `Last reading: ${formatRelative(derived.receivedAt, now)}`
              : "Last updated: just now"}
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-950">{children}</main>
      </div>
    </div>
  );
}
