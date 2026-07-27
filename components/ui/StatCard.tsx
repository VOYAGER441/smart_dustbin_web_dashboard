"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  color = "text-cyan-400",
}: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
        </div>
        {icon && <div className={`${color}`}>{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold text-white">{value}</span>
        {unit && <span className="text-gray-400 text-sm">{unit}</span>}
      </div>
      {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
    </div>
  );
}
