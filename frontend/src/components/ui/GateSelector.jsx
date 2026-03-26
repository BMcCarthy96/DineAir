import { FaPlane } from "react-icons/fa";

function GateSelector({
    value,
    onChange,
    gateOptions,
    id = "gate-select",
    variant = "default",
}) {
    const isOnBrand = variant === "onBrand";

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className={
                    isOnBrand
                        ? "mb-1.5 flex items-center gap-2 text-sm font-medium text-white/90"
                        : "da-label flex items-center gap-2 text-base"
                }
            >
                <span
                    className={
                        isOnBrand
                            ? "flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white"
                            : "flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    }
                >
                    <FaPlane className="h-4 w-4" aria-hidden />
                </span>
                Delivery gate
            </label>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className={
                    isOnBrand
                        ? "w-full cursor-pointer rounded-xl border border-white/20 bg-white/95 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-white/40 dark:bg-slate-900/95 dark:text-slate-100 dark:focus:ring-white/20"
                        : "da-input cursor-pointer"
                }
            >
                <option value="">Choose your gate</option>
                {gateOptions.map((g) => (
                    <option key={g} value={g}>
                        Gate {g}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default GateSelector;
