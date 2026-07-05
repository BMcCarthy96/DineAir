import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    useParams,
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import AddMenuItemForm from "../AddMenuItemForm/AddMenuItemForm";
import { apiFetch } from "../../utils/apiFetch";
import { Skeleton } from "../ui/Skeleton";
import SmartImage from "../ui/SmartImage";
import MenuItemCard from "../ui/MenuItemCard";
import { formatRating } from "../../utils/restaurantDisplay";

function RestaurantDetails() {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isMenuItemsRoute = pathname.includes("/menu-items");
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoadError(null);
            try {
                const [resR, resM] = await Promise.all([
                    apiFetch(`/api/restaurants/${restaurantId}`),
                    apiFetch(
                        `/api/restaurants/${restaurantId}/menu-items`
                    ),
                ]);
                if (!resR.ok) throw new Error("Restaurant not found");
                const dataR = await resR.json();
                const dataM = resM.ok ? await resM.json() : { items: [] };
                if (!cancelled) {
                    setRestaurant(dataR);
                    setMenuItems(dataM.items || []);
                }
            } catch {
                if (!cancelled) setLoadError("Could not load this restaurant.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, [restaurantId]);

    const handleAddToCart = async (menuItemId, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!sessionUser) {
            toast.error("Log in to add items to your cart.");
            navigate("/login", {
                state: { from: `/restaurants/${restaurantId}` },
            });
            return;
        }
        try {
            const response = await apiFetch("/api/carts/items", {
                method: "POST",
                body: JSON.stringify({ menuItemId, quantity: 1 }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error || "Failed to add item to cart."
                );
            }

            toast.success("Added to cart");
        } catch (err) {
            toast.error(err.message || "Could not add to cart.");
        }
    };

    const handleMenuItemAdded = (newItem) => {
        setMenuItems((prev) => [...prev, newItem]);
        toast.success("Menu item created");
    };

    const handleDeleteMenuItem = async (menuItemId) => {
        if (!window.confirm("Delete this menu item?")) return;
        try {
            const response = await apiFetch(
                `/api/restaurants/${restaurantId}/menu-items/${menuItemId}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                setMenuItems((prev) =>
                    prev.filter((item) => item.id !== menuItemId)
                );
                toast.success("Menu item removed");
            } else {
                toast.error("Failed to delete menu item.");
            }
        } catch {
            toast.error("Error deleting menu item.");
        }
    };

    const canManageMenu =
        sessionUser &&
        restaurant &&
        (sessionUser.userType === "admin" ||
            sessionUser.id === restaurant.ownerId);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="mx-auto h-10 w-48" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-72 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (loadError || !restaurant) {
        return (
            <div className="da-card p-10 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                    {loadError || "Restaurant unavailable."}
                </p>
                <Link
                    to="/restaurants"
                    className="da-btn-primary mt-6 inline-flex"
                >
                    Back to restaurants
                </Link>
            </div>
        );
    }

    const rating = formatRating(restaurant.avgRating, restaurant.reviewCount);

    return (
        <div className="space-y-10">
            <header className="relative overflow-hidden rounded-2xl shadow-soft-lg">
                <SmartImage
                    src={restaurant.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full"
                />
                <div
                    className="relative min-h-[280px]"
                    style={{
                        background:
                            "linear-gradient(to top, rgba(6,9,19,0.9), rgba(6,9,19,0.25))",
                    }}
                >
                    <div className="flex min-h-[280px] flex-col justify-end px-6 py-10 sm:px-10">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                {restaurant.name}
                            </h1>
                            <span className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                                <FaStar className="text-brand-400" aria-hidden />
                                {rating}
                            </span>
                        </div>
                        <p className="mt-3 max-w-2xl text-lg text-white/90">
                            {restaurant.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-white/85">
                            <span className="rounded-md border border-white/20 bg-black/20 px-3 py-1 font-mono text-xs uppercase tracking-widest backdrop-blur-sm">
                                Terminal {restaurant.terminal} · Gate{" "}
                                {restaurant.gate}
                            </span>
                            <span className="rounded-lg bg-white/15 px-3 py-1 backdrop-blur-sm">
                                {restaurant.cuisineType}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <section aria-labelledby="menu-heading">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <h2
                        id="menu-heading"
                        className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
                    >
                        Menu
                    </h2>
                    {isMenuItemsRoute && (
                        <Link
                            to={`/restaurants/${restaurantId}`}
                            className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            ← Reviews &amp; overview
                        </Link>
                    )}
                </div>

                {canManageMenu && (
                    <AddMenuItemForm
                        restaurantId={restaurantId}
                        onMenuItemAdded={handleMenuItemAdded}
                    />
                )}

                {menuItems.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600 dark:border-night-700 dark:bg-night-900/40 dark:text-slate-400">
                        No menu items yet.
                    </p>
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <MenuItemCard
                                    item={item}
                                    onClick={() =>
                                        navigate(
                                            `/restaurants/${restaurantId}/menu-items/${item.id}`
                                        )
                                    }
                                    actions={
                                        <div className="flex flex-1 flex-wrap justify-end gap-2">
                                            <button
                                                type="button"
                                                className="da-btn-primary !py-2 !text-xs"
                                                onClick={(e) =>
                                                    handleAddToCart(item.id, e)
                                                }
                                            >
                                                Add to cart
                                            </button>
                                            {canManageMenu && (
                                                <button
                                                    type="button"
                                                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                                                    onClick={() =>
                                                        handleDeleteMenuItem(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default RestaurantDetails;
