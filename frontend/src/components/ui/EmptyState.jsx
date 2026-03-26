function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-8 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30"
            role="status"
        >
            {Icon && (
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft dark:bg-slate-800">
                    <Icon className="h-7 w-7 text-brand-500" aria-hidden />
                </div>
            )}
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
            </h2>
            {description && (
                <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

export default EmptyState;
