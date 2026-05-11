import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  count?: number;
  className?: string;
}

export default function SkeletonCard({ count = 4, className }: SkeletonCardProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-[#E7D7C9] rounded-[24px] skeleton" />
          <div className="pt-4 space-y-3">
            <div className="h-2 bg-[#E7D7C9] rounded w-1/3 skeleton" />
            <div className="h-4 bg-[#E7D7C9] rounded w-3/4 skeleton" />
            <div className="h-4 bg-[#E7D7C9] rounded w-1/4 skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-4 bg-[#E7D7C9] rounded skeleton", className)} />;
}

export function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn("bg-[#E7D7C9] rounded skeleton", className)} />;
}
