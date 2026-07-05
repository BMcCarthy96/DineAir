import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PiReceipt } from "react-icons/pi";
import EmptyState from "../ui/EmptyState";
import PageHeader from "../ui/PageHeader";
import StatusChip from "../ui/StatusChip";
import { Skeleton } from "../ui/Skeleton";
import { apiFetch } from "../../utils/apiFetch";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function fetchOrders() {
            try {
                const response = await apiFetch("/api/orders");
                if (response.ok) {
                    const data = await response.json();
                    if (!cancelled) setOrders(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchOrders();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleReorder = async (orderId) => {
        try {
            const response = await apiFetch(`/api/orders/${orderId}/reorder`, {
                method: "POST",
            });

            if (response.ok) {
                const cartItems = await response.json();
                toast.success("Items added to your cart.");
                navigate("/cart", { state: { cartItems } });
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(
                    errorData.error || "Failed to reorder. Please try again."
                );
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <PageHeader
                eyebrow="History"
                title="Order history"
                description="Reorder past meals or review gate delivery details."
            />

            {loading ? (
                <div className="mt-10 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        icon={PiReceipt}
                        title="No orders yet"
                        description="When you checkout, your trips show up here with status and gate info."
                        action={
                            <Link
                                to="/restaurants"
                                className="da-btn-primary"
                            >
                                Browse restaurants
                            </Link>
                        }
                    />
                </div>
            ) : (
                <ul className="mt-10 space-y-4" aria-label="Past orders">
                    {orders.map((order) => (
                        <li key={order.id}>
                            <article className="da-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-semibold text-slate-900 dark:text-white">
                                        Order #{order.id}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {order.Restaurant?.name || "Restaurant"}{" "}
                                        · Gate {order.gate || "—"}
                                    </p>
                                    <div className="mt-2">
                                        <StatusChip status={order.status} />
                                    </div>
                                    <p className="mt-2 font-mono text-lg font-bold text-slate-900 dark:text-white">
                                        $
                                        {!Number.isNaN(Number(order.totalPrice))
                                            ? Number(order.totalPrice).toFixed(2)
                                            : "0.00"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="da-btn-secondary shrink-0 self-start sm:self-center"
                                    onClick={() => handleReorder(order.id)}
                                >
                                    Reorder
                                </button>
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OrderHistoryPage;
