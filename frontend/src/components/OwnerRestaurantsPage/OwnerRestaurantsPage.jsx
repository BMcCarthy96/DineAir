import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            await fetch(`/api/restaurants/${restaurantId}`, { method: "DELETE" });
            setRestaurants(restaurants.filter((restaurant) => restaurant.id !== restaurantId));
        }
    };

    return (
        <div className="owner-restaurants-page">
            <h1>My Restaurants</h1>
            <button onClick={handleCreate} className="create-button">
                Create New Restaurant
            </button>
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="restaurant-card">
                        <h2>{restaurant.name}</h2>
                        <p>{restaurant.description}</p>
                        <button onClick={() => handleEdit(restaurant.id)} className="edit-button">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(restaurant.id)} className="delete-button">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OwnerRestaurantsPage;
