import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./CartPage.css";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCartItems() {
            const response = await fetch("/api/carts/items");
            const data = await response.json();
            setCartItems(data);
        }

        fetchCartItems();
    }, []);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`/api/carts/items/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error removing item from cart:", errorData);
                throw new Error("Failed to remove item from cart.");
            }

            setCartItems(cartItems.filter((item) => item.id !== itemId));
        } catch (err) {
            console.error(err);
            alert("Failed to remove item from cart.");
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={item.MenuItem.imageUrl || "https://via.placeholder.com/150"}
                                alt={item.MenuItem.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-info">
                                <h3>{item.MenuItem.name}</h3>
                                <p>{item.MenuItem.description}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${(item.MenuItem.price * item.quantity).toFixed(2)}</p>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {cartItems.length > 0 && (
                <button className="checkout-button" onClick={handleCheckout}>
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
}

export default CartPage;
