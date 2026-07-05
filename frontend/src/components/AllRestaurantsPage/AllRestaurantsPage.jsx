import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { favoriteRestaurant, unfavoriteRestaurant } from "../../store/favorites";
import RestaurantCard from "../ui/RestaurantCard";
import EmptyState from "../ui/EmptyState";
import PageHeader from "../ui/PageHeader";
import { RestaurantCardSkeleton } from "../ui/Skeleton";
import { FaUtensils } from "react-icons/fa6";

function AllRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [query, setQuery] = useState("");
    const [cuisineFilter, setCuisineFilter] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        let cancelled = false;
        async function fetchRestaurants() {
            try {
                const response = await fetch("/api/restaurants");
                if (!response.ok) throw new Error("Failed");
                const data = await response.json();
                if (!cancelled) setRestaurants(data);
            } catch {
                if (!cancelled) setLoadError("Could not load restaurants.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchRestaurants();
        return () => {
            cancelled = true;
        };
    }, []);

    const cuisines = useMemo(() => {
        const set = new Set(
            restaurants.map((r) => r.cuisineType).filter(Boolean)
        );
        return [...set].sort();
    }, [restaurants]);

    const filtered = useMemo(() => {
        return restaurants.filter((r) => {
            const q = query.trim().toLowerCase();
            const matchesQuery =
                !q ||
                r.name.toLowerCase().includes(q) ||
                (r.cuisineType || "").toLowerCase().includes(q) ||
                (r.terminal || "").toLowerCase().includes(q);
            const matchesCuisine =
                !cuisineFilter || r.cuisineType === cuisineFilter;
            const matchesRating =
                !ratingFilter || Number(r.avgRating) >= Number(ratingFilter);
            return matchesQuery && matchesCuisine && matchesRating;
        });
    }, [restaurants, query, cuisineFilter, ratingFilter]);

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

    return (
        <main
            className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
            aria-label="All restaurants"
        >
            <header className="mb-10">
                <PageHeader
                    eyebrow="Every terminal"
                    title="Restaurants"
                    description="Browse by cuisine, rating, or terminal."
                />

                <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="flex-1">
                        <label htmlFor="rest-search" className="da-label">
                            Search
                        </label>
                        <input
                            id="rest-search"
                            type="search"
                            className="da-input"
                            placeholder="Name, cuisine, or terminal…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search restaurants"
                        />
                    </div>
                    <div className="grid flex-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="cuisine-filter" className="da-label">
                                Cuisine
                            </label>
                            <select
                                id="cuisine-filter"
                                className="da-input cursor-pointer"
                                value={cuisineFilter}
                                onChange={(e) =>
                                    setCuisineFilter(e.target.value)
                                }
                            >
                                <option value="">All cuisines</option>
                                {cuisines.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rating-filter" className="da-label">
                                Min rating
                            </label>
                            <select
                                id="rating-filter"
                                className="da-input cursor-pointer"
                                value={ratingFilter}
                                onChange={(e) =>
                                    setRatingFilter(e.target.value)
                                }
                            >
                                <option value="">Any</option>
                                <option value="4.5">4.5+</option>
                                <option value="4.3">4.3+</option>
                                <option value="4.0">4.0+</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {loadError && (
                <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                    {loadError}
                </p>
            )}

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((k) => (
                        <RestaurantCardSkeleton key={k} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={FaUtensils}
                    title="No restaurants match"
                    description="Try clearing filters or searching with a different keyword."
                    action={
                        <button
                            type="button"
                            className="da-btn-secondary !py-2 !text-sm"
                            onClick={() => {
                                setQuery("");
                                setCuisineFilter("");
                                setRatingFilter("");
                            }}
                        >
                            Reset filters
                        </button>
                    }
                />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((restaurant) => (
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
                                                (f) => f.id === restaurant.id
                                            )
                                                ? "Remove from favorites"
                                                : "Add to favorites"
                                        }
                                        onClick={(e) =>
                                            toggleFavorite(restaurant, e)
                                        }
                                    >
                                        <FaStar
                                            className={`h-5 w-5 ${
                                                favorites.some(
                                                    (f) =>
                                                        f.id === restaurant.id
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
            )}
        </main>
    );
}

export default AllRestaurantsPage;
