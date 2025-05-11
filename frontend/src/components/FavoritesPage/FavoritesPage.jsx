import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./FavoritesPage.css";

function FavoritesPage() {
    // Fetch favorites from Redux store
    const favorites = useSelector((state) => state.favorites || []);

    return (
        <div className="favorites-page">
            <h1>Favorite Restaurants</h1>
            {favorites.length === 0 ? (
                <p>No favorite restaurants yet.</p>
            ) : (
                <ul className="favorites-list">
                    {favorites.map((restaurant) => (
                        <li key={restaurant.id} className="favorite-card">
                            <h2>{restaurant.name}</h2>
                            <p>{restaurant.description}</p>
                            <Link to={`/restaurants/${restaurant.id}`} className="view-details">
                                View Details
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FavoritesPage;
