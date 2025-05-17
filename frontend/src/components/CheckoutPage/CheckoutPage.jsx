import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./CheckoutPage.css";

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [gate, setGate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCartItems() {
            const response = await fetch("/api/carts/items", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setCartItems(data);
        }

        fetchCartItems();
    }, []);

    const handlePlaceOrder = async () => {
        try {
            console.log("Placing order with gate:", gate); // Debugging: Log the gate value

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({ gate }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error placing order:", errorData);
                throw new Error("Failed to place order.");
            }

            alert("Order placed successfully!");
            navigate("/delivery-tracking");
        } catch (err) {
            console.error(err);
            alert("Failed to place order.");
        }
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="checkout-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="checkout-item">
                            <img
                                src={
                                    item.MenuItem.imageUrl ||
                                    "https://via.placeholder.com/150"
                                }
                                alt={item.MenuItem.name}
                                className="checkout-item-image"
                            />
                            <div className="checkout-item-info">
                                <h3>{item.MenuItem.name}</h3>
                                <p>{item.MenuItem.description}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>
                                    Price: $
                                    {!isNaN(Number(item.MenuItem.price)) &&
                                    !isNaN(Number(item.quantity))
                                        ? (
                                              Number(item.MenuItem.price) *
                                              Number(item.quantity)
                                          ).toFixed(2)
                                        : "0.00"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {cartItems.length > 0 && (
                <div className="checkout-form">
                    <label>
                        Gate:
                        <input
                            type="text"
                            value={gate}
                            onChange={(e) => setGate(e.target.value)}
                            placeholder="Enter your gate"
                            required
                        />
                    </label>
                    <button
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
