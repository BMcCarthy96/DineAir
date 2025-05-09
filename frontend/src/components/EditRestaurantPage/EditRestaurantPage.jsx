import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./EditRestaurantPage.css";

function EditRestaurantPage() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [terminal, setTerminal] = useState("");
    const [gate, setGate] = useState("");
    const [cuisineType, setCuisineType] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [airportId, setAirportId] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRestaurant() {
            const response = await fetch(`/api/restaurants/${restaurantId}`);
            if (response.ok) {
                const data = await response.json();
                setRestaurant(data);
                setName(data.name);
                setDescription(data.description);
                setTerminal(data.terminal);
                setGate(data.gate);
                setCuisineType(data.cuisineType);
                setImageUrl(data.imageUrl);
                setAirportId(data.airportId);
            } else {
                alert("Failed to fetch restaurant details.");
            }
        }

        fetchRestaurant();
    }, [restaurantId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedRestaurant = {
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
            airportId,
        };

        const response = await fetch(`/api/restaurants/${restaurantId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "XSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify(updatedRestaurant),
        });

        if (response.ok) {
            alert("Restaurant updated successfully!");
            navigate(`/restaurants/${restaurantId}`);
        } else {
            const errorData = await response.json();
            alert(`Failed to update restaurant: ${errorData.error || "Unknown error"}`);
        }
    };

    if (!restaurant) return <p>Loading...</p>;

    return (
        <div className="edit-restaurant-page">
            <h1>Edit Restaurant</h1>
            <form onSubmit={handleSubmit} className="edit-restaurant-form">
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Terminal:
                    <input
                        type="text"
                        value={terminal}
                        onChange={(e) => setTerminal(e.target.value)}
                    />
                </label>
                <label>
                    Gate:
                    <input
                        type="text"
                        value={gate}
                        onChange={(e) => setGate(e.target.value)}
                    />
                </label>
                <label>
                    Cuisine Type:
                    <input
                        type="text"
                        value={cuisineType}
                        onChange={(e) => setCuisineType(e.target.value)}
                    />
                </label>
                <label>
                    Image URL:
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </label>
                <label>
                    Airport ID:
                    <input
                        type="number"
                        value={airportId}
                        onChange={(e) => setAirportId(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className="submit-button">
                    Update Restaurant
                </button>
            </form>
        </div>
    );
}

export default EditRestaurantPage;
