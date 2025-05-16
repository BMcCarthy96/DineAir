import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { addFavorite, removeFavorite } from "../../store/favorites";
import "./LandingPage.css";

function LandingPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [fastPrepRestaurants, setFastPrepRestaurants] = useState([]);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch all restaurants
    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const response = await fetch("/api/restaurants");
                if (response.ok) {
                    const data = await response.json();
                    setRestaurants(data);
                } else {
                    console.error("Failed to fetch restaurants");
                }
            } catch (err) {
                console.error("Error fetching restaurants:", err);
            }
        }
        fetchRestaurants();
    }, []);

    // Filter for the select fast prep restaurants by ID
    useEffect(() => {
        // IDs for fast prep restaurants
        const fastPrepIds = [4, 5, 9, 10];
        setFastPrepRestaurants(
            restaurants.filter((r) => fastPrepIds.includes(r.id))
        );
    }, [restaurants]);

    const toggleFavorite = (restaurant, event) => {
        event.stopPropagation();
        if (favorites.some((fav) => fav.id === restaurant.id)) {
            dispatch(removeFavorite(restaurant.id));
        } else {
            dispatch(addFavorite(restaurant));
        }
    };

    const handleCardClick = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    return (
        <div className="landing-page">
            <div className="landing-header">
                <h1>Explore Restaurants</h1>
            </div>

            {/* Fast Prep Restaurants Section */}
            {fastPrepRestaurants.length > 0 && (
                <div className="fast-prep-section">
                    <h2>Fast Prep Restaurants (15-min prep guaranteed)</h2>
                    <div className="restaurant-list">
                        {fastPrepRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="restaurant-card"
                                onClick={() => handleCardClick(restaurant.id)}
                            >
                                <img
                                    src={
                                        restaurant.imageUrl ||
                                        "https://via.placeholder.com/300x200"
                                    }
                                    alt={restaurant.name}
                                    className="restaurant-image"
                                />
                                <div className="restaurant-info">
                                    <h2>{restaurant.name}</h2>
                                    <p>{restaurant.description}</p>
                                    <p>
                                        <strong>Cuisine:</strong>{" "}
                                        {restaurant.cuisineType}
                                    </p>
                                    <p>
                                        <strong>Terminal:</strong>{" "}
                                        {restaurant.terminal} |{" "}
                                        <strong>Gate:</strong> {restaurant.gate}
                                    </p>
                                    <FaStar
                                        className={`favorite-icon ${
                                            favorites.some(
                                                (fav) =>
                                                    fav.id === restaurant.id
                                            )
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={(event) =>
                                            toggleFavorite(restaurant, event)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Restaurants Section */}
            <h2>All Restaurants</h2>
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="restaurant-card"
                        onClick={() => handleCardClick(restaurant.id)}
                    >
                        <img
                            src={
                                restaurant.imageUrl ||
                                "https://via.placeholder.com/300x200"
                            }
                            alt={restaurant.name}
                            className="restaurant-image"
                        />
                        <div className="restaurant-info">
                            <h2>{restaurant.name}</h2>
                            <p>{restaurant.description}</p>
                            <p>
                                <strong>Cuisine:</strong>{" "}
                                {restaurant.cuisineType}
                            </p>
                            <p>
                                <strong>Terminal:</strong> {restaurant.terminal}{" "}
                                | <strong>Gate:</strong> {restaurant.gate}
                            </p>
                            <FaStar
                                className={`favorite-icon ${
                                    favorites.some(
                                        (fav) => fav.id === restaurant.id
                                    )
                                        ? "active"
                                        : ""
                                }`}
                                onClick={(event) =>
                                    toggleFavorite(restaurant, event)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;
