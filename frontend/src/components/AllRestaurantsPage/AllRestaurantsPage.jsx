import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaSearch } from "react-icons/fa";
import "./AllRestaurantsPage.css";

function AllRestaurantsPage() {
    const [restaurants, setRestaurants] = useState([]);
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRestaurants() {
            const response = await fetch("/api/restaurants");
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
                setFiltered(data);
            }
        }
        fetchRestaurants();
    }, []);

    useEffect(() => {
        setFiltered(
            restaurants.filter(
                (r) =>
                    r.name.toLowerCase().includes(query.toLowerCase()) ||
                    r.cuisineType.toLowerCase().includes(query.toLowerCase()) ||
                    r.terminal.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, restaurants]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCardClick = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    };

    return (
        <main className="all-restaurants-page" aria-label="All Restaurants">
            <header>
                <h1 className="all-restaurants-title">All Restaurants</h1>
                <div className="search-bar-container" ref={searchRef}>
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name, cuisine, or terminal..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowDropdown(e.target.value.length > 0);
                            }}
                            onFocus={() => setShowDropdown(query.length > 0)}
                            aria-label="Search restaurants"
                        />
                    </div>
                    {showDropdown && (
                        <div className="search-dropdown">
                            {filtered.length > 0 ? (
                                <ul>
                                    {filtered.slice(0, 8).map((r) => (
                                        <li
                                            key={r.id}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                handleCardClick(r.id);
                                            }}
                                            tabIndex={0}
                                            aria-label={`Go to ${r.name}`}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    setShowDropdown(false);
                                                    handleCardClick(r.id);
                                                }
                                            }}
                                        >
                                            {r.name}{" "}
                                            <span className="search-dropdown-cuisine">
                                                {r.cuisineType}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="no-results">
                                    No results found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>
            <div className="restaurant-list" role="list">
                {filtered.map((restaurant) => (
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
                                <strong>Terminal:</strong> {restaurant.terminal}{" "}
                                | <strong>Gate:</strong> {restaurant.gate}
                            </p>
                            <FaStar className="favorite-icon" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default AllRestaurantsPage;
