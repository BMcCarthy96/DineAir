import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";
import EmptyState from "../ui/EmptyState";
import PageHeader from "../ui/PageHeader";
import Modal from "../ui/Modal";
import ManagementRestaurantCard from "../ui/ManagementRestaurantCard";
import { FaShieldHalved } from "react-icons/fa6";
import { Skeleton } from "../ui/Skeleton";

function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingDelete, setPendingDelete] = useState(null);
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

    const handleDelete = async () => {
        const restaurantId = pendingDelete.id;
        setPendingDelete(null);
        try {
            const response = await apiFetch(
                `/api/admin/restaurants/${restaurantId}`,
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
                eyebrow="Admin"
                title="Restaurant directory"
                description="Full directory management across every terminal."
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

export default AdminRestaurantsPage;
