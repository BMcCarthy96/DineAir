import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { gateCoordinates } from "../../utils/gateCoordinates";
import "./CheckoutPage.css";

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [gate, setGate] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get sorted gate options
    const gateOptions = Object.keys(gateCoordinates).sort((a, b) => {
        // Sort by terminal letter, then by number
        const [aLetter, aNum] = [a[0], parseInt(a.slice(1), 10)];
        const [bLetter, bNum] = [b[0], parseInt(b.slice(1), 10)];
        if (aLetter === bLetter) return aNum - bNum;
        return aLetter.localeCompare(bLetter);
    });

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
        const gateCoord = gateCoordinates[gate];
        if (!gateCoord) {
            alert("Please select a valid gate.");
            return;
        }
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({
                    gate,
                    gateLat: gateCoord.lat,
                    gateLng: gateCoord.lng,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Failed to place order.");
                return;
            }

            alert("Order placed successfully!");
            navigate("/delivery-tracking");
        } catch (err) {
            console.error(err);
            setError("Failed to place order.");
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
                        <select
                            value={gate}
                            onChange={(e) => setGate(e.target.value)}
                            required
                        >
                            <option value="">Select your gate</option>
                            {gateOptions.map((gateOption) => (
                                <option key={gateOption} value={gateOption}>
                                    {gateOption}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="place-order-button"
                        onClick={handlePlaceOrder}
                        disabled={!gate}
                    >
                        Place Order
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
