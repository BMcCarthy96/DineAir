import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { apiFetch } from "../../utils/apiFetch";
import { Skeleton } from "../ui/Skeleton";

function MenuItemPage() {
    const { restaurantId, menuItemId } = useParams();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    const [menuItem, setMenuItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchMenuItem() {
            try {
                const response = await apiFetch(
                    `/api/restaurants/${restaurantId}/menu-items/${menuItemId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (!cancelled) setMenuItem(data);
                } else {
                    if (!cancelled) setNotFound(true);
                }
            } catch {
                if (!cancelled) setNotFound(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchMenuItem();
        return () => {
            cancelled = true;
        };
    }, [restaurantId, menuItemId]);

    const handleAddToCart = async () => {
        if (!sessionUser) {
            toast.error("Log in to add to cart.");
            navigate("/login");
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
                body: JSON.stringify({
                    menuItemId: Number(menuItemId),
                    quantity: 1,
                }),
            });
            if (response.ok) {
                toast.success("Added to cart");
            } else {
                const err = await response.json().catch(() => ({}));
                toast.error(err.error || "Could not add to cart");
            }
        } catch {
            toast.error("Could not add to cart");
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (notFound || !menuItem) {
        return (
            <div className="mx-auto max-w-md px-4 py-20 text-center">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Item not found
                </h1>
                <Link
                    to={`/restaurants/${restaurantId}`}
                    className="da-btn-primary mt-6 inline-flex"
                >
                    Back to restaurant
                </Link>
            </div>
        );
    }

    const price = !Number.isNaN(Number(menuItem.price))
        ? Number(menuItem.price).toFixed(2)
        : "0.00";

    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                to={`/restaurants/${restaurantId}`}
                className="text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
                ← Back to restaurant
            </Link>

            <motion.article
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="da-card mt-8 overflow-hidden"
            >
                <img
                    src={
                        menuItem.imageUrl ||
                        "https://via.placeholder.com/800x480"
                    }
                    alt=""
                    className="aspect-video w-full object-cover"
                />
                <div className="p-6 sm:p-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {menuItem.name}
                    </h1>
                    <p className="mt-2 text-2xl font-bold text-brand-600 dark:text-brand-400">
                        ${price}
                    </p>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        {menuItem.description}
                    </p>
                    <button
                        type="button"
                        className="da-btn-primary mt-8 w-full sm:w-auto"
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </button>
                </div>
            </motion.article>
        </div>
    );
}

export default MenuItemPage;
