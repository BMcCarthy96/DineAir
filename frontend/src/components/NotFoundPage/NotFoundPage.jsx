import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                404
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                This gate doesn&apos;t exist
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
                The page you&apos;re looking for isn&apos;t on this concourse.
                Head back to browse restaurants or your orders.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link to="/" className="da-btn-primary">
                    Home
                </Link>
                <Link to="/restaurants" className="da-btn-secondary">
                    Restaurants
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
