import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between space-x-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
