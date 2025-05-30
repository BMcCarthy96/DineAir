import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./OwnerRestaurantsPage.css";

function OwnerRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOwnedRestaurants() {
            const response = await fetch("/api/restaurant-owners/restaurants");
            const data = await response.json();
            setRestaurants(data);
        }
        fetchOwnedRestaurants();
    }, []);

    const handleCreate = () => {
        navigate("/restaurants/new");
    };

    const handleEdit = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}/edit`);
    };

    const handleDelete = async (restaurantId) => {
        if (
            window.confirm("Are you sure you want to delete this restaurant?")
        ) {
            await fetch(`/api/restaurants/${restaurantId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                credentials: "include",
            });
            setRestaurants(
                restaurants.filter(
                    (restaurant) => restaurant.id !== restaurantId
                )
            );
        }
    };

    const handleCardClick = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}/menu-items`);
    };

    return (
        <div className="owner-restaurants-page">
            <h1>My Restaurants</h1>
            <button onClick={handleCreate} className="create-button">
                Create New Restaurant
            </button>
            <div className="restaurant-carousel">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="restaurant-card"
                        onClick={() => handleCardClick(restaurant.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <img
                            src={
                                restaurant.imageUrl ||
                                "https://via.placeholder.com/300x200"
                            }
                            alt={restaurant.name}
                            className="restaurant-card-image"
                        />
                        <h2>{restaurant.name}</h2>
                        <p>{restaurant.description}</p>
                        <div className="restaurant-card-actions">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(restaurant.id);
                                }}
                                className="edit-button"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(restaurant.id);
                                }}
                                className="delete-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OwnerRestaurantsPage;
