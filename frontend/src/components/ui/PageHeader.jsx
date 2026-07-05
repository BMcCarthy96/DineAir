/** Consistent eyebrow + H1 + subtitle header used across every page. */
function PageHeader({ eyebrow, title, description, actions }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {eyebrow && <p className="da-eyebrow mb-2">{eyebrow}</p>}
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
            )}
        </div>
    );
}

export default PageHeader;
