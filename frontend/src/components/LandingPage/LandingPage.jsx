import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import {
    FaBolt,
    FaMapLocationDot,
    FaTowerBroadcast,
    FaUtensils,
} from "react-icons/fa6";
import { favoriteRestaurant, unfavoriteRestaurant } from "../../store/favorites";
import RestaurantCard from "../ui/RestaurantCard";
import { RestaurantCardSkeleton } from "../ui/Skeleton";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

function LandingPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const favorites = useSelector((state) => state.favorites);
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const topRatedRestaurants = [...restaurants]
        .filter((r) => Number(r.reviewCount) > 0)
        .sort((a, b) => Number(b.avgRating) - Number(a.avgRating))
        .slice(0, 4);

    const boardRows = restaurants.slice(0, 6);

    useEffect(() => {
        let cancelled = false;
        async function fetchRestaurants() {
            try {
                const response = await fetch("/api/restaurants");
                if (!response.ok) throw new Error("Failed to load");
                const data = await response.json();
                if (!cancelled) setRestaurants(data);
            } catch {
                if (!cancelled) setFetchError("We couldn’t load restaurants.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchRestaurants();
        return () => {
            cancelled = true;
        };
    }, []);

    const toggleFavorite = (restaurant, event) => {
        event.stopPropagation();
        if (favorites.some((fav) => fav.id === restaurant.id)) {
            dispatch(unfavoriteRestaurant(restaurant.id));
        } else {
            dispatch(favoriteRestaurant(restaurant));
        }
    };

    const handleCardClick = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    const features = [
        {
            icon: FaBolt,
            title: "Fast delivery",
            body: "Curated airport vendors with predictable prep times so you make your boarding window.",
        },
        {
            icon: FaMapLocationDot,
            title: "Gate tracking",
            body: "Tell us your gate once—we route runners and keep your drop-off accurate if gates change.",
        },
        {
            icon: FaTowerBroadcast,
            title: "Live status",
            body: "Real-time order updates from the kitchen to your concourse, without refreshing.",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-night-950">
            <section
                className="relative overflow-hidden border-b border-slate-200/80 bg-white dark:border-night-700 dark:bg-night-900"
                aria-label="Hero"
            >
                <div
                    className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/5"
                    aria-hidden
                />

                <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            show: {
                                transition: { staggerChildren: 0.1 },
                            },
                        }}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <motion.p
                            variants={fadeIn}
                            custom={0}
                            className="da-eyebrow mb-4 justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 dark:border-night-600 dark:bg-night-800"
                        >
                            <FaUtensils aria-hidden />
                            Airport dining, reimagined
                        </motion.p>
                        <motion.h1
                            variants={fadeIn}
                            custom={1}
                            className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
                        >
                            Skip the line.{" "}
                            <span className="text-brand-600 dark:text-brand-400">
                                Get food delivered to your gate.
                            </span>
                        </motion.h1>
                        <motion.p
                            variants={fadeIn}
                            custom={2}
                            className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400"
                        >
                            Order from terminal restaurants and concessions—we
                            bring it to you while you wait to board.
                        </motion.p>
                        <motion.div
                            variants={fadeIn}
                            custom={3}
                            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                to="/restaurants"
                                className="da-btn-primary min-w-[200px] px-8 py-3.5 text-base"
                            >
                                Browse restaurants
                            </Link>
                            <Link
                                to="/signup"
                                className="da-btn-secondary min-w-[200px] px-8 py-3.5 text-base"
                            >
                                Create account
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {!loading && boardRows.length > 0 && (
                <section
                    className="border-b border-night-700 bg-night-950 py-10"
                    aria-label="Departures"
                >
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-slate-500">
                            <span>Now serving</span>
                            <span className="flex items-center gap-2 text-brand-400">
                                <span className="h-1.5 w-1.5 animate-flicker rounded-full bg-brand-400" />
                                Live
                            </span>
                        </div>
                        <div className="divide-y divide-night-700 rounded-2xl border border-night-700 bg-black/20">
                            <div className="hidden grid-cols-[1fr_auto_auto] gap-4 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-slate-500 sm:grid">
                                <span>Restaurant</span>
                                <span>Terminal</span>
                                <span>Gate</span>
                            </div>
                            {boardRows.map((r) => (
                                <Link
                                    key={r.id}
                                    to={`/restaurants/${r.id}`}
                                    className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 font-mono text-sm text-slate-200 transition hover:bg-brand-500/5 sm:grid-cols-[1fr_auto_auto]"
                                >
                                    <span className="truncate">{r.name}</span>
                                    <span className="hidden text-slate-400 sm:inline">
                                        T{r.terminal}
                                    </span>
                                    <span className="text-brand-400">
                                        {r.gate}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section
                className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8"
                aria-labelledby="features-heading"
            >
                <h2
                    id="features-heading"
                    className="sr-only"
                >
                    Why DineAir
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {features.map(({ icon: Icon, title, body }, i) => (
                        <motion.article
                            key={title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                                delay: i * 0.08,
                                duration: 0.45,
                            }}
                            className="da-card p-6"
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                                <Icon className="h-6 w-6" aria-hidden />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {body}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </section>

            <section
                className="border-t border-slate-200/80 bg-white py-16 dark:border-night-700 dark:bg-night-900"
                aria-label="Top rated picks"
            >
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="da-eyebrow mb-2">Fan favorites</p>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Top rated
                            </h2>
                            <p className="mt-1 text-slate-600 dark:text-slate-400">
                                The best-reviewed vendors across every terminal.
                            </p>
                        </div>
                        <Link
                            to="/restaurants"
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            View all →
                        </Link>
                    </div>

                    {fetchError && (
                        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                            {fetchError}
                        </p>
                    )}

                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((k) => (
                                <RestaurantCardSkeleton key={k} />
                            ))}
                        </div>
                    ) : topRatedRestaurants.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {topRatedRestaurants.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    onSelect={handleCardClick}
                                    favoriteControl={
                                        sessionUser ? (
                                            <button
                                                type="button"
                                                className="rounded-full bg-white/95 p-2.5 shadow-soft backdrop-blur-sm transition hover:scale-105 dark:bg-night-900/95"
                                                aria-label={
                                                    favorites.some(
                                                        (f) =>
                                                            f.id ===
                                                            restaurant.id
                                                    )
                                                        ? "Remove from favorites"
                                                        : "Add to favorites"
                                                }
                                                onClick={(e) =>
                                                    toggleFavorite(
                                                        restaurant,
                                                        e
                                                    )
                                                }
                                            >
                                                <FaStar
                                                    className={`h-5 w-5 ${
                                                        favorites.some(
                                                            (f) =>
                                                                f.id ===
                                                                restaurant.id
                                                        )
                                                            ? "text-amber-400"
                                                            : "text-slate-300 dark:text-slate-600"
                                                    }`}
                                                />
                                            </button>
                                        ) : null
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-600 dark:text-slate-400">
                            No reviews yet—browse the full list.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
