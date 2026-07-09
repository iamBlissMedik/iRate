import { Skeleton } from "@irate/ui";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <Skeleton className="h-9 w-56" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
