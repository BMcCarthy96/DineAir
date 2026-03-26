export function Skeleton({ className = "" }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/80 ${className}`}
            aria-hidden
        />
    );
}

export function RestaurantCardSkeleton() {
    return (
        <div className="da-card overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full rounded-none rounded-t-2xl" />
            <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </div>
        </div>
    );
}

export default Skeleton;
