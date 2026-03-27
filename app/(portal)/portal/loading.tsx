import { Skeleton } from "@/components/ui/skeleton";

export default function PortalLoading() {
  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Skeleton className="hidden h-[calc(100vh-2rem)] rounded-[2rem] lg:block" />
        <div className="space-y-6">
          <Skeleton className="h-24 rounded-[2rem]" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-[2rem]" />
            ))}
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <Skeleton className="h-[420px] rounded-[2rem]" />
            <Skeleton className="h-[420px] rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}

