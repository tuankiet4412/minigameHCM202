import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} aria-hidden />;
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12">
      <Skeleton className="mx-auto h-12 w-2/3" />
      <Skeleton className="mx-auto h-6 w-1/2" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-glass" />
        ))}
      </div>
    </div>
  );
}
