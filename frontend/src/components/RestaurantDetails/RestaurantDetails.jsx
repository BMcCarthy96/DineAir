import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./RestaurantDetails.css";

function RestaurantDetails() {
    const { restaurantId } = useParams();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        async function fetchMenuItems() {
            const response = await fetch(`/api/restaurants/${restaurantId}/menu-items`);
            const data = await response.json();
            setMenuItems(data.items);
        }

        fetchMenuItems();
    }, [restaurantId]);

    const handleAddToCart = async (menuItemId) => {
        const response = await fetch("/api/carts/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ menuItemId, quantity: 1 }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Added ${data.quantity} item(s) to your cart!`);
        } else {
            alert("Failed to add item to cart.");
        }
    };

    return (
        <div className="restaurant-details">
            <h1>Menu</h1>
            <div className="menu-items">
                {menuItems.map((item) => (
                    <div key={item.id} className="menu-item-card">
                        <img
                            src={item.imageUrl || "https://via.placeholder.com/150"}
                            alt={item.name}
                            className="menu-item-image"
                        />
                        <div className="menu-item-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p className="price">${item.price.toFixed(2)}</p>
                            <button
                                className="add-to-cart-button"
                                onClick={() => handleAddToCart(item.id)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RestaurantDetails;
