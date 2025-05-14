import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistoryPage.css";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch("/api/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        }

        fetchOrders();
    }, []);

    const handleReorder = async (orderId) => {
        try {
            const csrfToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            const response = await fetch(`/api/orders/${orderId}/reorder`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure this token is valid
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });

            if (response.ok) {
                alert("Order has been reordered!");
                navigate("/cart");
            } else {
                const errorData = await response.json();
                alert(
                    errorData.error || "Failed to reorder. Please try again."
                );
            }
        } catch (err) {
            console.error("Error reordering:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="order-history-page">
            <h1>Order History</h1>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <div className="orders">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <h3>Order #{order.id}</h3>
                            <p>Status: {order.status}</p>
                            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                            <p>
                                Restaurant:{" "}
                                {order.Restaurant?.name || "Unknown"}
                            </p>
                            <p>Gate: {order.gate || "Not specified"}</p>
                            <button
                                className="reorder-button"
                                onClick={() => handleReorder(order.id)}
                            >
                                Reorder
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;
