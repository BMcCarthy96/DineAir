import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";
import EmptyState from "../ui/EmptyState";
import { FaShieldHalved } from "react-icons/fa6";
import { Skeleton } from "../ui/Skeleton";

function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function fetchRestaurants() {
            try {
                const response = await apiFetch("/api/admin/restaurants");
                if (response.ok) {
                    const data = await response.json();
                    if (!cancelled) setRestaurants(data);
                } else {
                    toast.error("Could not load restaurants.");
                }
            } catch {
                toast.error("Could not load restaurants.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchRestaurants();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleDelete = async (restaurantId) => {
        if (!window.confirm("Delete this restaurant?")) return;
        try {
            const response = await apiFetch(
                `/api/admin/restaurants/${restaurantId}`,
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
                        Admin · Restaurants
                    </h1>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                        Full directory management.
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
                        <Skeleton key={i} className="h-72 rounded-2xl" />
                    ))}
                </div>
            ) : restaurants.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        icon={FaShieldHalved}
                        title="No restaurants"
                        description="Seed the database or create a new venue."
                    />
                </div>
            ) : (
                <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {restaurants.map((restaurant) => (
                        <li key={restaurant.id}>
                            <article className="da-card overflow-hidden">
                                <img
                                    src={
                                        restaurant.imageUrl ||
                                        "https://via.placeholder.com/400x240"
                                    }
                                    alt=""
                                    className="h-40 w-full object-cover"
                                />
                                <div className="p-5">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {restaurant.name}
                                    </h2>
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                                        {restaurant.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="da-btn-secondary !py-2 !text-sm"
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
                                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                                            onClick={() =>
                                                handleDelete(restaurant.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminRestaurantsPage;
