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

  const handleManageMenu = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  return (
    <div className="owner-restaurants-page">
      <h1>My Restaurants</h1>
      <div className="restaurant-list">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>
            <button onClick={() => handleManageMenu(restaurant.id)} className="manage-menu-button">
              Manage Menu
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerRestaurantsPage;
