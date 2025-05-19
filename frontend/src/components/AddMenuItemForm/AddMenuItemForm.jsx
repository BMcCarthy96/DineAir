import { useState } from "react";
import Cookies from "js-cookie";
import "./AddMenuItemForm.css";

function AddMenuItemForm({ restaurantId, onMenuItemAdded }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [available, setAvailable] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const newItem = {
            name,
            description,
            price: Number(price),
            imageUrl,
            available,
        };

        const response = await fetch(
            `/api/restaurants/${restaurantId}/menu-items`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify(newItem),
            }
        );

        if (response.ok) {
            const data = await response.json();
            onMenuItemAdded && onMenuItemAdded(data);
            setName("");
            setDescription("");
            setPrice("");
            setImageUrl("");
            setAvailable(true);
        } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to add menu item.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-menu-item-form">
            <h3>Add Menu Item</h3>
            {error && <p className="error-message">{error}</p>}
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
                />
            </label>
            <label>
                Price:
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
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
                Available:
                <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                />
            </label>
            <button type="submit">Add Item</button>
        </form>
    );
}

export default AddMenuItemForm;
