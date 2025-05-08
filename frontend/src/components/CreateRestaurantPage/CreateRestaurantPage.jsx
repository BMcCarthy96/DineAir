import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRestaurantPage.css";

function CreateRestaurantPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [terminal, setTerminal] = useState("");
    const [gate, setGate] = useState("");
    const [cuisineType, setCuisineType] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [airportId, setAirportId] = useState(1);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newRestaurant = {
            name,
            description,
            terminal,
            gate,
            cuisineType,
            imageUrl,
            airportId,
        };

        const response = await fetch("/api/restaurants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(newRestaurant),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Restaurant created successfully!");
            navigate(`/restaurants/${data.id}`);
        } else {
            const errorData = await response.json();
            alert(`Failed to create restaurant: ${errorData.error || "Unknown error"}`);
        }
    };

    return (
        <div className="create-restaurant-page">
            <h1>Create a New Restaurant</h1>
            <form onSubmit={handleSubmit} className="create-restaurant-form">
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
                    Create Restaurant
                </button>
            </form>
        </div>
    );
}

export default CreateRestaurantPage;
