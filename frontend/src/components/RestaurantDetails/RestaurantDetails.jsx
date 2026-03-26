import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    useParams,
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import AddMenuItemForm from "../AddMenuItemForm/AddMenuItemForm";
import { apiFetch } from "../../utils/apiFetch";
import { Skeleton } from "../ui/Skeleton";

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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
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
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                        "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                    },
                }
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

    return (
        <div className="space-y-10">
            <header className="overflow-hidden rounded-2xl shadow-soft-lg">
                <div
                    className="relative min-h-[280px] bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.88), rgba(15,23,42,0.35)), url(${
                            restaurant.imageUrl ||
                            "https://via.placeholder.com/1200x400"
                        })`,
                    }}
                >
                    <div className="flex min-h-[280px] flex-col justify-end px-6 py-10 sm:px-10">
                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {restaurant.name}
                        </h1>
                        <p className="mt-3 max-w-2xl text-lg text-white/90">
                            {restaurant.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-white/85">
                            <span className="rounded-lg bg-white/15 px-3 py-1 backdrop-blur-sm">
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
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                        No menu items yet.
                    </p>
                ) : (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <article className="da-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5">
                                    <Link
                                        to={`/restaurants/${restaurantId}/menu-items/${item.id}`}
                                        className="block flex flex-1 flex-col text-inherit no-underline"
                                    >
                                        <img
                                            src={
                                                item.imageUrl ||
                                                "https://via.placeholder.com/400x240"
                                            }
                                            alt=""
                                            className="h-48 w-full object-cover"
                                        />
                                        <div className="flex flex-1 flex-col p-5">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {item.name}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                                                {item.description}
                                            </p>
                                            <p className="mt-3 text-lg font-bold text-brand-600 dark:text-brand-400">
                                                $
                                                {!Number.isNaN(
                                                    Number(item.price)
                                                )
                                                    ? Number(
                                                          item.price
                                                      ).toFixed(2)
                                                    : "0.00"}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex flex-wrap gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
                                        <button
                                            type="button"
                                            className="da-btn-primary flex-1 !py-2.5 !text-sm"
                                            onClick={(e) =>
                                                handleAddToCart(item.id, e)
                                            }
                                        >
                                            Add to cart
                                        </button>
                                        {canManageMenu && (
                                            <button
                                                type="button"
                                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
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
                                </article>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default RestaurantDetails;
