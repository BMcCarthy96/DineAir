import { forwardRef } from "react";
import { Link } from "react-router-dom";

const VARIANTS = {
    primary: "da-btn-primary",
    secondary: "da-btn-secondary",
    danger: "da-btn-danger",
    link: "font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300",
};

const SIZES = {
    sm: "!px-4 !py-2 !text-sm",
    md: "",
    lg: "!px-8 !py-3.5 !text-base",
};

/** Shared button: pass `to` for a router Link, omit for a native <button>. */
const Button = forwardRef(function Button(
    { variant = "primary", size = "md", to, className = "", children, ...rest },
    ref
) {
    const classes = `${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || ""} ${className}`.trim();

    if (to) {
        return (
            <Link ref={ref} to={to} className={classes} {...rest}>
                {children}
            </Link>
        );
    }

    return (
        <button ref={ref} type={rest.type || "button"} className={classes} {...rest}>
            {children}
        </button>
    );
});

export default Button;
