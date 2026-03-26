/**
 * Lightweight route transition placeholder (lazy-loaded chunks).
 */
function PageLoader() {
    return (
        <div
            className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4"
            role="status"
            aria-live="polite"
            aria-label="Loading page"
        >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Loading…
            </p>
        </div>
    );
}

export default PageLoader;
