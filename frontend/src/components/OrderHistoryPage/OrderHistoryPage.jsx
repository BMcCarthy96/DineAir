import { useEffect, useState } from "react";
import "./OrderHistoryPage.css";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            const response = await fetch("/api/orders");
            const data = await response.json();
            setOrders(data);
        }

        fetchOrders();
    }, []);

    return (
        <div className="order-history-page">
            <h1>Your Order History</h1>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <div className="orders">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <h3>Order #{order.id}</h3>
                            <p>Status: {order.status}</p>
                            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
                            <p>Restaurant: {order.restaurantId}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;
