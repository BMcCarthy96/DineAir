import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        async function fetchRestaurants() {
            const response = await fetch("/api/restaurants");
            const data = await response.json();
            setRestaurants(data);
        }

        fetchRestaurants();
    }, []);

    return (
        <div className="landing-page">
            <h1>Explore Restaurants</h1>
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <Link
                        to={`/restaurants/${restaurant.id}`}
                        key={restaurant.id}
                        className="restaurant-card"
                    >
                        <img
                            src={restaurant.imageUrl || "https://via.placeholder.com/150"}
                            alt={restaurant.name}
                            className="restaurant-image"
                        />
                        <div className="restaurant-info">
                            <h2>{restaurant.name}</h2>
                            <p>{restaurant.description}</p>
                            <p>
                                <strong>Cuisine:</strong> {restaurant.cuisineType}
                            </p>
                            <p>
                                <strong>Terminal:</strong> {restaurant.terminal} |{" "}
                                <strong>Gate:</strong> {restaurant.gate}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;
