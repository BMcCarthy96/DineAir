import { Component } from "react";

/**
 * Catches render errors so a single bad view does not white-screen the app.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                        Something went wrong
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        We couldn&apos;t render this screen
                    </h1>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        Try reloading. If you&apos;re developing, check the
                        browser console for details.
                    </p>
                    <button
                        type="button"
                        className="da-btn-primary mt-8"
                        onClick={() => window.location.reload()}
                    >
                        Reload page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
