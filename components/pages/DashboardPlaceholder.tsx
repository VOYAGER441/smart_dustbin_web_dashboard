"use client";

interface DashboardPlaceholderProps {
  title: string;
  description: string;
}

export default function DashboardPlaceholder({ title, description }: DashboardPlaceholderProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-3 text-gray-400">{description}</p>
      </div>
    </div>
  );
}
