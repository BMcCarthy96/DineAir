import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import "./CartPage.css";

function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    async function fetchCartItems() {
        try {
            const response = await fetch("/api/carts/items", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            } else {
                console.error("Failed to fetch cart items");
            }
        } catch (err) {
            console.error("Error fetching cart items:", err);
        }
    }

    useEffect(() => {
        if (location.state?.cartItems) {
            setCartItems(location.state.cartItems);
        } else {
            fetchCartItems();
        }
    }, [location.state]);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`/api/carts/items/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
            });

            if (response.ok) {
                setCartItems(cartItems.filter((item) => item.id !== itemId));
            } else {
                console.error("Failed to remove item from cart");
            }
        } catch (err) {
            console.error("Error removing item from cart:", err);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`/api/carts/items/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
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
            } else {
                console.error("Failed to update item quantity");
            }
        } catch (err) {
            console.error("Error updating item quantity:", err);
        }
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const subtotal = cartItems.reduce(
        (total, item) => total + item.quantity * item.MenuItem.price,
        0
    );

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            className="cart-item"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <img
                                src={
                                    item.MenuItem.imageUrl ||
                                    "https://via.placeholder.com/150"
                                }
                                alt={item.MenuItem.name}
                                className="cart-item-image"
                            />
                            <div className="cart-item-info">
                                <h3>{item.MenuItem.name}</h3>
                                <p>{item.MenuItem.description}</p>
                                <div className="quantity-controls">
                                    <button
                                        className="quantity-button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        className="quantity-button"
                                        onClick={() =>
                                            handleQuantityChange(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <p>
                                    Price: $
                                    {Number(
                                        item.MenuItem.price * item.quantity
                                    ).toFixed(2)}
                                </p>
                                <button
                                    className="remove-button"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <h3>Subtotal: ${Number(subtotal).toFixed(2)}</h3>
                    <button
                        className="checkout-button"
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
