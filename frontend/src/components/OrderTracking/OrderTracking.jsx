import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { trackingLog } from "../../utils/trackingLog";

const STEP_LABELS = [
    "Order Received",
    "Preparing",
    "On the Way",
    "Delivered",
];

/**
 * Map canonical order phase (API / demo merge) to timeline step index.
 * @param {string | null | undefined} status
 */
function effectiveStatusToStepIndex(status) {
    if (!status) return 0;
    if (status === "picked_up") return 2;
    const map = {
        pending: 0,
        preparing: 1,
        on_the_way: 2,
        delivered: 3,
    };
    const idx = map[status];
    return typeof idx === "number" ? idx : 0;
}

/**
 * @param {{ effectiveStatus: string | null }} props
 */
function OrderTracking({ effectiveStatus }) {
    const currentStep = effectiveStatusToStepIndex(effectiveStatus);

    useEffect(() => {
        if (!import.meta.env.DEV) return;
        trackingLog("OrderTracking render props", {
            effectiveStatus,
            currentStep,
            stepLabel: STEP_LABELS[currentStep],
        });
    }, [effectiveStatus]);

    return (
        <div
            className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            role="list"
            aria-label="Order progress"
        >
            {STEP_LABELS.map((label, index) => {
                const done = index <= currentStep;
                const active = index === currentStep;
                return (
                    <div
                        key={label}
                        className="flex flex-1 flex-col items-center text-center"
                        role="listitem"
                    >
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition ${
                                done
                                    ? "bg-brand-600 text-white shadow-soft"
                                    : "border-2 border-slate-200 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-900"
                            } ${active ? "ring-2 ring-brand-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950" : ""}`}
                        >
                            {done ? (
                                <FaCheck className="h-4 w-4" aria-hidden />
                            ) : (
                                index + 1
                            )}
                        </div>
                        <p
                            className={`mt-2 text-xs font-semibold sm:text-sm ${
                                done
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-400 dark:text-slate-500"
                            }`}
                        >
                            {label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default OrderTracking;
