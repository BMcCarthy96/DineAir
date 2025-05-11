import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./RestaurantDetails.css";

function RestaurantDetails() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        async function fetchRestaurantDetails() {
            const response = await fetch(`/api/restaurants/${restaurantId}`);
            const data = await response.json();
            setRestaurant(data);
        }

        async function fetchMenuItems() {
            const response = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
            const data = await response.json();
            setMenuItems(data.items);
        }

        fetchRestaurantDetails();
        fetchMenuItems();
    }, [restaurantId]);

    const handleAddToCart = async (menuItemId, e) => {
        e.preventDefault(); // Prevent navigation when the button is clicked
        try {
            const response = await fetch("/api/carts/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({ menuItemId, quantity: 1 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error adding item to cart:", errorData);
                throw new Error("Failed to add item to cart.");
            }

            const data = await response.json();
            console.log("Cart updated:", data);
            alert("Item added to cart successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to add item to cart.");
        }
    };

    return (
        <div className="restaurant-details">
            {restaurant && (
                <div className="restaurant-header">
                    <div
                        className="restaurant-banner"
                        style={{
                            backgroundImage: `url(${restaurant.imageUrl || "https://via.placeholder.com/1200x400"})`,
                        }}
                    >
                        <div className="restaurant-overlay">
                            <h1 className="restaurant-name">{restaurant.name}</h1>
                            <p className="restaurant-description">{restaurant.description}</p>
                            <p className="restaurant-info">
                                <strong>Terminal:</strong> {restaurant.terminal} |{" "}
                                <strong>Gate:</strong> {restaurant.gate}
                            </p>
                            <p className="restaurant-info">
                                <strong>Cuisine:</strong> {restaurant.cuisineType}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="menu-title">Menu</h2>
            <div className="menu-items">
                {menuItems && menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <div key={item.id} className="menu-item-card">
                            <Link
                                to={`/restaurants/${restaurantId}/menu-items/${item.id}`}
                                className="menu-item-link"
                            >
                                <img
                                    src={item.imageUrl || "https://via.placeholder.com/150"}
                                    alt={item.name}
                                    className="menu-item-image"
                                />
                                <div className="menu-item-info">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p className="price">${item.price.toFixed(2)}</p>
                                </div>
                            </Link>
                            <button
                                className="add-to-cart-button"
                                onClick={(e) => handleAddToCart(item.id, e)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No menu items available for this restaurant.</p>
                )}
            </div>
        </div>
    );
}

export default RestaurantDetails;
