const STATUS_MAP = {
    pending: {
        label: "Pending",
        tone: "border-slate-200 bg-slate-50 text-slate-600 dark:border-night-600 dark:bg-night-800 dark:text-slate-300",
    },
    preparing: {
        label: "Preparing",
        tone: "border-amber-200 bg-amber-50 text-amber-800 dark:border-brand-500/30 dark:bg-black/30 dark:text-brand-300",
    },
    in_progress: {
        label: "In progress",
        tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-300",
    },
    picked_up: {
        label: "Picked up",
        tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-300",
    },
    on_the_way: {
        label: "On the way",
        tone: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-300",
    },
    delivered: {
        label: "Delivered",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-300",
    },
};

const FALLBACK_TONE =
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-night-600 dark:bg-night-800 dark:text-slate-300";

/** Mono, uppercase, letter-spaced status pill — the departure-board signature look. */
function StatusChip({ status, className = "" }) {
    const entry = STATUS_MAP[status] || {
        label: status ? status.replace(/_/g, " ") : "Unknown",
        tone: FALLBACK_TONE,
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs font-semibold uppercase tracking-widest ${entry.tone} ${className}`.trim()}
        >
            {entry.label}
        </span>
    );
}

export default StatusChip;
