import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";
import EmptyState from "../ui/EmptyState";
import PageHeader from "../ui/PageHeader";
import Modal from "../ui/Modal";
import ManagementRestaurantCard from "../ui/ManagementRestaurantCard";
import { FaStore } from "react-icons/fa";
import { Skeleton } from "../ui/Skeleton";

function OwnerRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null);
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

    const handleDelete = async () => {
        const restaurantId = pendingDelete.id;
        setPendingDelete(null);
        try {
            const response = await apiFetch(
                `/api/restaurants/${restaurantId}`,
                { method: "DELETE" }
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
            <PageHeader
                eyebrow="Owner"
                title="My restaurants"
                description="Manage menus and details for your locations."
                actions={
                    <button
                        type="button"
                        className="da-btn-primary shrink-0"
                        onClick={() => navigate("/restaurants/new")}
                    >
                        New restaurant
                    </button>
                }
            />

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
                            <ManagementRestaurantCard
                                restaurant={restaurant}
                                onManageMenu={() =>
                                    navigate(
                                        `/restaurants/${restaurant.id}/menu-items`
                                    )
                                }
                                onEdit={() =>
                                    navigate(
                                        `/restaurants/${restaurant.id}/edit`
                                    )
                                }
                                onDelete={() => setPendingDelete(restaurant)}
                            />
                        </li>
                    ))}
                </ul>
            )}

            <Modal
                open={Boolean(pendingDelete)}
                onClose={() => setPendingDelete(null)}
                title="Delete this restaurant?"
                footer={
                    <>
                        <button
                            type="button"
                            className="da-btn-danger flex-1"
                            onClick={handleDelete}
                        >
                            Yes, delete
                        </button>
                        <button
                            type="button"
                            className="da-btn-secondary flex-1"
                            onClick={() => setPendingDelete(null)}
                        >
                            Cancel
                        </button>
                    </>
                }
            >
                {pendingDelete?.name} and its full menu will be permanently
                removed.
            </Modal>
        </div>
    );
}

export default OwnerRestaurantsPage;
