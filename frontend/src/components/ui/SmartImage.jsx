import { useState } from "react";
import { FaUtensils } from "react-icons/fa";

/**
 * Image with a shimmer placeholder while loading and a branded fallback on error —
 * replaces bare <img> tags and dead via.placeholder.com URLs.
 */
function SmartImage({
    src,
    alt = "",
    className = "",
    imgClassName = "",
    fallbackIcon: FallbackIcon = FaUtensils,
}) {
    const [status, setStatus] = useState(src ? "loading" : "error");

    return (
        <div
            className={`relative overflow-hidden bg-slate-100 dark:bg-night-800 ${className}`}
        >
            {status === "loading" && (
                <div
                    className="absolute inset-0 animate-pulse bg-slate-200/80 dark:bg-night-700/80"
                    aria-hidden
                />
            )}
            {status !== "error" && src && (
                <img
                    src={src}
                    alt={alt}
                    className={`h-full w-full object-cover transition duration-300 ${
                        status === "loading" ? "opacity-0" : "opacity-100"
                    } ${imgClassName}`}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                />
            )}
            {status === "error" && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
                    <FallbackIcon className="h-8 w-8" aria-hidden />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                        DineAir
                    </span>
                </div>
            )}
        </div>
    );
}

export default SmartImage;
