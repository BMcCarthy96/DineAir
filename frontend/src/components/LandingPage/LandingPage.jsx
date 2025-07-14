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

    useEffect(() => {
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
        <main
            className="landing-page"
            aria-label="DineAir Restaurant Selection"
        >
            <header className="hero-section" role="banner">
                <div className="hero-content">
                    <h1 className="hero-title">DineAir</h1>
                    <p className="hero-subtitle">
                        <span className="highlight">Order airport food</span>{" "}
                        and get it delivered{" "}
                        <span className="highlight">right to your gate</span>
                        —fast, fresh, and easy.
                    </p>
                    <button
                        className="cta-button"
                        onClick={() => navigate("/restaurants")}
                        aria-label="Browse all restaurants"
                    >
                        Browse Restaurants
                    </button>
                </div>
            </header>

            {fastPrepRestaurants.length > 0 && (
                <section
                    className="fast-prep-section"
                    aria-label="Fast Prep Restaurants"
                >
                    <h2 className="section-title">
                        Fast Prep Restaurants{" "}
                        <span className="badge">15-min prep guaranteed</span>
                    </h2>
                    <div className="restaurant-list" role="list">
                        {fastPrepRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="restaurant-card"
                                role="listitem"
                                tabIndex={0}
                                aria-label={`View details for ${restaurant.name}`}
                                onClick={() => handleCardClick(restaurant.id)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter")
                                        handleCardClick(restaurant.id);
                                }}
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
                                    <h3>{restaurant.name}</h3>
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
                                        aria-label={
                                            favorites.some(
                                                (fav) =>
                                                    fav.id === restaurant.id
                                            )
                                                ? "Remove from favorites"
                                                : "Add to favorites"
                                        }
                                        tabIndex={0}
                                        onClick={(event) =>
                                            toggleFavorite(restaurant, event)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter")
                                                toggleFavorite(restaurant, e);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

export default LandingPage;
