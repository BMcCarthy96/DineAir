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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RestaurantDetails;
