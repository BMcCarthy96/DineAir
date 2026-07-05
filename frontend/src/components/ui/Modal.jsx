import { useEffect } from "react";
import { createPortal } from "react-dom";

/** Portal-based confirm/dialog modal. Closes on Escape or backdrop click. */
function Modal({ open, onClose, title, children, footer }) {
    useEffect(() => {
        if (!open) return undefined;
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-night-950/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "da-modal-title" : undefined}
            onClick={onClose}
        >
            <div
                className="da-card w-full max-w-md p-6 shadow-soft-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h3
                        id="da-modal-title"
                        className="text-lg font-semibold text-slate-900 dark:text-white"
                    >
                        {title}
                    </h3>
                )}
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {children}
                </div>
                {footer && <div className="mt-6 flex flex-wrap gap-3">{footer}</div>}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
