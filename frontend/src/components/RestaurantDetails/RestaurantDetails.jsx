import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import AddMenuItemForm from "../AddMenuItemForm/AddMenuItemForm";
import "./RestaurantDetails.css";

function RestaurantDetails() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        async function fetchRestaurantDetails() {
            const response = await fetch(`/api/restaurants/${restaurantId}`);
            const data = await response.json();
            setRestaurant(data);
        }

        async function fetchMenuItems() {
            const response = await fetch(
                `/api/restaurants/${restaurantId}/menu-items`
            );
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

    const handleMenuItemAdded = (newItem) => {
        setMenuItems((prev) => [...prev, newItem]);
    };

    const handleDeleteMenuItem = async (menuItemId) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            try {
                const response = await fetch(
                    `/api/restaurants/${restaurantId}/menu-items/${menuItemId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                            "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                        },
                    }
                );
                if (response.ok) {
                    setMenuItems((prev) =>
                        prev.filter((item) => item.id !== menuItemId)
                    );
                } else {
                    alert("Failed to delete menu item.");
                }
            } catch (err) {
                alert("Error deleting menu item.");
            }
        }
    };

    const canAddMenuItem =
        sessionUser &&
        (sessionUser.userType === "admin" ||
            (restaurant && sessionUser.id === restaurant.ownerId));

    const canDeleteMenuItem =
        sessionUser &&
        (sessionUser.userType === "admin" ||
            (restaurant && sessionUser.id === restaurant.ownerId));

    return (
        <div className="restaurant-details">
            {restaurant && (
                <div className="restaurant-header">
                    <div
                        className="restaurant-banner"
                        style={{
                            backgroundImage: `url(${
                                restaurant.imageUrl ||
                                "https://via.placeholder.com/1200x400"
                            })`,
                        }}
                    >
                        <div className="restaurant-banner-overlay">
                            <h1 className="restaurant-name">
                                {restaurant.name}
                            </h1>
                            <p className="restaurant-description">
                                {restaurant.description}
                            </p>
                            <p className="restaurant-info">
                                <strong>Terminal:</strong> {restaurant.terminal}{" "}
                                | <strong>Gate:</strong> {restaurant.gate}
                            </p>
                            <p className="restaurant-info">
                                <strong>Cuisine:</strong>{" "}
                                {restaurant.cuisineType}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="menu-title">Menu</h2>
            {canAddMenuItem && (
                <AddMenuItemForm
                    restaurantId={restaurantId}
                    onMenuItemAdded={handleMenuItemAdded}
                />
            )}
            <div className="menu-items">
                {menuItems && menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <div key={item.id} className="menu-item-card">
                            <Link
                                to={`/restaurants/${restaurantId}/menu-items/${item.id}`}
                                className="menu-item-link"
                            >
                                <img
                                    src={
                                        item.imageUrl ||
                                        "https://via.placeholder.com/150"
                                    }
                                    alt={item.name}
                                    className="menu-item-image"
                                />
                                <div className="menu-item-info">
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p className="price">
                                        $
                                        {!isNaN(Number(item.price))
                                            ? Number(item.price).toFixed(2)
                                            : "0.00"}
                                    </p>
                                </div>
                            </Link>
                            <button
                                className="add-to-cart-button"
                                onClick={(e) => handleAddToCart(item.id, e)}
                            >
                                Add to Cart
                            </button>
                            {canDeleteMenuItem && (
                                <button
                                    className="delete-menu-item-button"
                                    onClick={() =>
                                        handleDeleteMenuItem(item.id)
                                    }
                                >
                                    Delete
                                </button>
                            )}
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
