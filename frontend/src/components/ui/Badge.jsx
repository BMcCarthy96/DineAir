const TONES = {
    neutral:
        "bg-slate-100 text-slate-600 dark:bg-night-800 dark:text-slate-300",
    amber: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
    red: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
};

/** Small rounded pill for tags like cuisine type. For order/delivery status, use StatusChip. */
function Badge({ children, tone = "neutral", className = "" }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                TONES[tone] || TONES.neutral
            } ${className}`.trim()}
        >
            {children}
        </span>
    );
}

export default Badge;
