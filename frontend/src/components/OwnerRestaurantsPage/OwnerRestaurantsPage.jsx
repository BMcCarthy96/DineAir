import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";
import EmptyState from "../ui/EmptyState";
import { FaStore } from "react-icons/fa";
import { Skeleton } from "../ui/Skeleton";

function OwnerRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function fetchOwnedRestaurants() {
            try {
                const response = await apiFetch(
                    "/api/restaurant-owners/restaurants"
                );
                if (response.ok) {
                    const data = await response.json();
                    if (!cancelled) setRestaurants(data);
                } else {
                    toast.error("Could not load your restaurants.");
                }
            } catch {
                toast.error("Could not load your restaurants.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchOwnedRestaurants();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleDelete = async (restaurantId) => {
        if (!window.confirm("Delete this restaurant?")) return;
        try {
            const response = await apiFetch(
                `/api/restaurants/${restaurantId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                    },
                }
            );
            if (response.ok) {
                setRestaurants((prev) =>
                    prev.filter((r) => r.id !== restaurantId)
                );
                toast.success("Restaurant removed");
            } else {
                toast.error("Delete failed");
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        My restaurants
                    </h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Manage menus and details for your locations.
                    </p>
                </div>
                <button
                    type="button"
                    className="da-btn-primary shrink-0"
                    onClick={() => navigate("/restaurants/new")}
                >
                    New restaurant
                </button>
            </div>

            {loading ? (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-80 rounded-2xl" />
                    ))}
                </div>
            ) : restaurants.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        icon={FaStore}
                        title="No restaurants yet"
                        description="Create a venue to start adding menu items."
                        action={
                            <button
                                type="button"
                                className="da-btn-primary"
                                onClick={() => navigate("/restaurants/new")}
                            >
                                Create restaurant
                            </button>
                        }
                    />
                </div>
            ) : (
                <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id}>
                            <article className="da-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5">
                                <button
                                    type="button"
                                    className="block flex-1 text-left"
                                    onClick={() =>
                                        navigate(
                                            `/restaurants/${restaurant.id}/menu-items`
                                        )
                                    }
                                >
                                    <img
                                        src={
                                            restaurant.imageUrl ||
                                            "https://via.placeholder.com/400x240"
                                        }
                                        alt=""
                                        className="h-44 w-full object-cover"
                                    />
                                    <div className="p-5">
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {restaurant.name}
                                        </h2>
                                        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                                            {restaurant.description}
                                        </p>
                                    </div>
                                </button>
                                <div className="flex gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
                                    <button
                                        type="button"
                                        className="da-btn-secondary flex-1 !py-2 !text-sm"
                                        onClick={() =>
                                            navigate(
                                                `/restaurants/${restaurant.id}/edit`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                                        onClick={() =>
                                            handleDelete(restaurant.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OwnerRestaurantsPage;
