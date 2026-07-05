import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-night-700 dark:bg-night-950">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
                <div>
                    <div className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        DineAir
                    </div>
                    <p className="mt-2 max-w-xs text-sm text-slate-600 dark:text-slate-400">
                        Food at the airport, without the sprint.
                    </p>
                </div>
                <div className="flex flex-wrap gap-8 text-sm">
                    <div className="space-y-2">
                        <div className="font-semibold text-slate-900 dark:text-white">
                            Product
                        </div>
                        <Link
                            to="/restaurants"
                            className="block text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                        >
                            Restaurants
                        </Link>
                        <Link
                            to="/orders"
                            className="block text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                        >
                            Orders
                        </Link>
                    </div>
                    <div className="space-y-2">
                        <div className="font-semibold text-slate-900 dark:text-white">
                            Account
                        </div>
                        <Link
                            to="/login"
                            className="block text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="block text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-10 max-w-6xl border-t border-slate-200 px-4 pt-8 text-center text-xs text-slate-500 dark:border-night-700 dark:text-slate-500 sm:px-6 lg:px-8">
                © {new Date().getFullYear()} DineAir. Capstone demo.
            </div>
        </footer>
    );
}

export default Footer;
