function FormField({ label, id, required, children, hint }) {
    return (
        <div>
            <label htmlFor={id} className="da-label">
                {label}
                {required ? " *" : ""}
            </label>
            {children}
            {hint && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {hint}
                </p>
            )}
        </div>
    );
}

export default FormField;
