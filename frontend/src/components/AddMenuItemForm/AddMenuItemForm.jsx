import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";

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

        try {
            const response = await apiFetch(
                `/api/restaurants/${restaurantId}/menu-items`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                    },
                    body: JSON.stringify(newItem),
                }
            );

            if (response.ok) {
                const data = await response.json();
                onMenuItemAdded?.(data);
                setName("");
                setDescription("");
                setPrice("");
                setImageUrl("");
                setAvailable(true);
            } else {
                const errorData = await response.json().catch(() => ({}));
                const msg =
                    errorData.error || "Failed to add menu item.";
                setError(msg);
                toast.error(msg);
            }
        } catch {
            const msg = "Failed to add menu item.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="da-card mb-8 space-y-4 p-6 sm:p-8"
        >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Add menu item
            </h3>
            {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                    {error}
                </p>
            )}
            <div>
                <label htmlFor="mi-name" className="da-label">
                    Name
                </label>
                <input
                    id="mi-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="da-input"
                    required
                />
            </div>
            <div>
                <label htmlFor="mi-desc" className="da-label">
                    Description
                </label>
                <textarea
                    id="mi-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="da-input min-h-[88px] resize-y"
                />
            </div>
            <div>
                <label htmlFor="mi-price" className="da-label">
                    Price
                </label>
                <input
                    id="mi-price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="da-input"
                    required
                />
            </div>
            <div>
                <label htmlFor="mi-img" className="da-label">
                    Image URL
                </label>
                <input
                    id="mi-img"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="da-input"
                />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600"
                />
                Available
            </label>
            <button type="submit" className="da-btn-primary w-full sm:w-auto">
                Add item
            </button>
        </form>
    );
}

export default AddMenuItemForm;
