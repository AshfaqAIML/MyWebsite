import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export function StatsCard({ label, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span className="text-zinc-500 dark:text-zinc-400">{icon}</span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {value}
        </span>
        {trend && (
          <span className="text-xs text-green-500">{trend}</span>
        )}
      </div>
    </div>
  );
}
