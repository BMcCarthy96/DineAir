import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { gateCoordinates } from "../../utils/gateCoordinates";
import GateSelector from "../ui/GateSelector";
import { apiFetch } from "../../utils/apiFetch";

const PREVIEW_STEPS = [
    { key: "placed", label: "Order placed" },
    { key: "prep", label: "Preparing" },
    { key: "way", label: "On the way" },
    { key: "gate", label: "At your gate" },
];

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [gate, setGate] = useState("");
    const [error, setError] = useState(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const navigate = useNavigate();

    const gateOptions = useMemo(
        () =>
            Object.keys(gateCoordinates).sort((a, b) => {
                const [aLetter, aNum] = [a[0], parseInt(a.slice(1), 10)];
                const [bLetter, bNum] = [b[0], parseInt(b.slice(1), 10)];
                if (aLetter === bLetter) return aNum - bNum;
                return aLetter.localeCompare(bLetter);
            }),
        []
    );

    useEffect(() => {
        let cancelled = false;
        async function fetchCartItems() {
            try {
                const response = await apiFetch("/api/carts/items", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                });
                const data = await response.json();
                if (!cancelled && response.ok) setCartItems(data);
            } catch {
                if (!cancelled) setCartItems([]);
            } finally {
                if (!cancelled) setLoadingCart(false);
            }
        }
        fetchCartItems();
        return () => {
            cancelled = true;
        };
    }, []);

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.quantity * Number(item.MenuItem?.price || 0),
        0
    );
    const taxEstimate = subtotal * 0.0825;
    const serviceFee = cartItems.length ? 2.49 : 0;
    const total = subtotal + taxEstimate + serviceFee;
    const fmt = (n) => (!Number.isNaN(n) ? n.toFixed(2) : "0.00");

    const handlePlaceOrder = async () => {
        const gateCoord = gateCoordinates[gate];
        if (!gateCoord) {
            toast.error("Please select a valid gate.");
            return;
        }
        setError(null);
        try {
            const response = await apiFetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
                body: JSON.stringify({
                    gate,
                    gateLat: gateCoord.lat,
                    gateLng: gateCoord.lng,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const msg =
                    errorData.error || errorData.message || "Failed to place order.";
                setError(msg);
                toast.error(msg);
                return;
            }

            toast.success("Order placed! Track it live from the next screen.");
            navigate("/delivery-tracking");
        } catch {
            const msg = "Failed to place order.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Checkout
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Confirm your meal and where you&apos;re waiting—we
                        handle the concourse.
                    </p>
                </div>
                <Link
                    to="/cart"
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                    ← Back to cart
                </Link>
            </div>

            {loadingCart ? (
                <p className="text-slate-600 dark:text-slate-400">
                    Loading cart…
                </p>
            ) : cartItems.length === 0 ? (
                <div className="da-card p-10 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        Your cart is empty.
                    </p>
                    <Link
                        to="/restaurants"
                        className="da-btn-primary mt-6 inline-flex"
                    >
                        Find food
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
                    <div className="space-y-6">
                        <section
                            className="da-card overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-soft-lg"
                            aria-label="Delivery destination"
                        >
                            <p className="text-sm font-medium text-white/80">
                                Delivering to
                            </p>
                            <p className="mt-1 text-3xl font-bold tracking-tight">
                                {gate ? `Gate ${gate}` : "Select your gate"}
                            </p>
                            <p className="mt-2 max-w-md text-sm text-white/85">
                                Runners use this to find you at the correct pier.
                                You can change it until you place the order.
                            </p>
                            <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                                <GateSelector
                                    variant="onBrand"
                                    value={gate}
                                    onChange={setGate}
                                    gateOptions={gateOptions}
                                    id="checkout-gate"
                                />
                            </div>
                        </section>

                        <section
                            className="da-card p-6"
                            aria-label="After you order"
                        >
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                What happens next
                            </h2>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                Preview of the live tracker you&apos;ll see after
                                checkout.
                            </p>
                            <ol className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                {PREVIEW_STEPS.map((step, i) => (
                                    <li
                                        key={step.key}
                                        className="flex flex-1 flex-col items-center text-center"
                                    >
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                                                i === 0
                                                    ? "bg-brand-600 text-white"
                                                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                                            }`}
                                        >
                                            {i === 0 ? (
                                                <FaCheck className="h-4 w-4" />
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                        <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {step.label}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <section aria-label="Items">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                                Items
                            </h2>
                            <ul className="space-y-3">
                                {cartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                                    >
                                        <img
                                            src={
                                                item.MenuItem.imageUrl ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt=""
                                            className="h-16 w-16 rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {item.MenuItem.name}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Qty {item.quantity}
                                            </p>
                                        </div>
                                        <p className="shrink-0 font-semibold text-slate-900 dark:text-white">
                                            $
                                            {fmt(
                                                Number(item.MenuItem.price) *
                                                    item.quantity
                                            )}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-24">
                        <div className="da-card space-y-4 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Payment summary
                            </h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <dt>Subtotal</dt>
                                    <dd>${fmt(subtotal)}</dd>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <dt>Est. tax</dt>
                                    <dd>${fmt(taxEstimate)}</dd>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <dt>Service fee</dt>
                                    <dd>${fmt(serviceFee)}</dd>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold dark:border-slate-700">
                                    <dt className="text-slate-900 dark:text-white">
                                        Total
                                    </dt>
                                    <dd className="text-slate-900 dark:text-white">
                                        ${fmt(total)}
                                    </dd>
                                </div>
                            </dl>
                            <button
                                type="button"
                                className="da-btn-primary w-full !py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={handlePlaceOrder}
                                disabled={!gate}
                            >
                                Place order
                            </button>
                            {error && (
                                <p className="text-center text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </p>
                            )}
                            <p className="text-center text-xs text-slate-500">
                                Demo app—no real card charged.
                            </p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
