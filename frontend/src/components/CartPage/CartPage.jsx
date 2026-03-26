import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";
import EmptyState from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { apiFetch } from "../../utils/apiFetch";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    async function fetchCartItems() {
        setLoadError(null);
        try {
            const response = await apiFetch("/api/carts/items", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                setLoadError("Could not load your cart.");
            }
        } catch {
            setLoadError("Could not load your cart.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (location.state?.cartItems) {
            setCartItems(location.state.cartItems);
            setLoading(false);
        } else {
            fetchCartItems();
        }
    }, [location.state]);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await apiFetch(`/api/carts/items/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
            });

            if (response.ok) {
                setCartItems(cartItems.filter((item) => item.id !== itemId));
            }
        } catch {
            setLoadError("Could not update cart.");
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await apiFetch(`/api/carts/items/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                const updatedItem = await response.json();
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === itemId
                            ? { ...item, quantity: updatedItem.quantity }
                            : item
                    )
                );
            }
        } catch {
            setLoadError("Could not update quantity.");
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.quantity * Number(item.MenuItem?.price || 0),
        0
    );

    const taxEstimate = subtotal * 0.0825;
    const serviceFee = cartItems.length ? 2.49 : 0;
    const total = subtotal + taxEstimate + serviceFee;

    const formatMoney = (n) =>
        !Number.isNaN(n) ? n.toFixed(2) : "0.00";

    return (
        <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Your cart
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Review items before checkout. Quantities sync with your account.
            </p>

            {loadError && (
                <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                    {loadError}
                </p>
            )}

            {loading ? (
                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="da-card flex gap-4 p-4">
                                <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Skeleton className="hidden h-64 rounded-2xl lg:block" />
                </div>
            ) : cartItems.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        icon={FaShoppingBag}
                        title="Your cart is empty"
                        description="Add something delicious from a terminal restaurant—we’ll bring it to your gate."
                        action={
                            <Link to="/restaurants" className="da-btn-primary">
                                Browse restaurants
                            </Link>
                        }
                    />
                </div>
            ) : (
                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
                    <ul className="space-y-4" aria-label="Cart items">
                        {cartItems.map((item) => (
                            <motion.li
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="da-card flex flex-col gap-4 p-4 sm:flex-row"
                            >
                                <img
                                    src={
                                        item.MenuItem.imageUrl ||
                                        "https://via.placeholder.com/150"
                                    }
                                    alt=""
                                    className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-24 sm:shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {item.MenuItem.name}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                                        {item.MenuItem.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700">
                                            <button
                                                type="button"
                                                className="px-3 py-2 text-lg font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="min-w-[2rem] text-center text-sm font-semibold">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                className="px-3 py-2 text-lg font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                            $
                                            {formatMoney(
                                                Number(item.MenuItem.price) *
                                                    item.quantity
                                            )}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                                            onClick={() =>
                                                handleRemoveItem(item.id)
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </ul>

                    <aside className="lg:sticky lg:top-24">
                        <div className="da-card space-y-4 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Order summary
                            </h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <dt>Subtotal</dt>
                                    <dd className="font-medium text-slate-900 dark:text-white">
                                        ${formatMoney(subtotal)}
                                    </dd>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <dt>Est. tax</dt>
                                    <dd className="font-medium text-slate-900 dark:text-white">
                                        ${formatMoney(taxEstimate)}
                                    </dd>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <dt>Service fee</dt>
                                    <dd className="font-medium text-slate-900 dark:text-white">
                                        ${formatMoney(serviceFee)}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold dark:border-slate-700">
                                    <dt className="text-slate-900 dark:text-white">
                                        Total
                                    </dt>
                                    <dd className="text-slate-900 dark:text-white">
                                        ${formatMoney(total)}
                                    </dd>
                                </div>
                            </dl>
                            <button
                                type="button"
                                className="da-btn-primary w-full !py-3.5"
                                onClick={handleCheckout}
                            >
                                Proceed to checkout
                            </button>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-500">
                                Taxes and fees are estimates for demo purposes.
                            </p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default CartPage;
