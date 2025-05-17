import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function MenuItemPage() {
    const { restaurantId, menuItemId } = useParams();
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        async function fetchMenuItem() {
            const response = await fetch(
                `/api/restaurants/${restaurantId}/menu-items/${menuItemId}`
            );
            if (response.ok) {
                const data = await response.json();
                setMenuItem(data);
            } else {
                console.error("Failed to fetch menu item");
            }
        }

        fetchMenuItem();
    }, [restaurantId, menuItemId]);

    if (!menuItem) return <p>Loading...</p>;

    return (
        <div className="menu-item-page">
            <h1>{menuItem.name}</h1>
            <p>{menuItem.description}</p>
            <p>
                Price: $
                {!isNaN(Number(menuItem.price))
                    ? Number(menuItem.price).toFixed(2)
                    : "0.00"}
            </p>
            <img
                src={menuItem.imageUrl || "https://via.placeholder.com/150"}
                alt={menuItem.name}
            />
        </div>
    );
}

export default MenuItemPage;
