import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";

function CreateRestaurantPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [terminal, setTerminal] = useState("");
    const [gate, setGate] = useState("");
    const [cuisineType, setCuisineType] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [airportId, setAirportId] = useState(1);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
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
            latitude: latitude === "" ? null : Number(latitude),
            longitude: longitude === "" ? null : Number(longitude),
        };

        try {
            const response = await apiFetch("/api/restaurants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
                body: JSON.stringify(newRestaurant),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Restaurant created");
                navigate(`/restaurants/${data.id}`);
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(
                    errorData.error || errorData.message || "Create failed"
                );
            }
        } catch {
            toast.error("Could not create restaurant.");
        }
    };

    return (
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                to="/restaurants"
                className="text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
                ← Back
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                New restaurant
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Airport location and coordinates are required for maps and
                delivery.
            </p>

            <form
                onSubmit={handleSubmit}
                className="da-card mt-8 space-y-4 p-6 sm:p-8"
            >
                <FormField label="Name" id="cr-name" required>
                    <input
                        id="cr-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="da-input"
                        required
                    />
                </FormField>
                <FormField label="Description" id="cr-desc" required>
                    <textarea
                        id="cr-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="da-input min-h-[100px] resize-y"
                        required
                    />
                </FormField>
                <FormField label="Terminal" id="cr-term">
                    <input
                        id="cr-term"
                        type="text"
                        value={terminal}
                        onChange={(e) => setTerminal(e.target.value)}
                        className="da-input"
                    />
                </FormField>
                <FormField label="Gate" id="cr-gate">
                    <input
                        id="cr-gate"
                        type="text"
                        value={gate}
                        onChange={(e) => setGate(e.target.value)}
                        className="da-input"
                    />
                </FormField>
                <FormField label="Cuisine" id="cr-cuisine">
                    <input
                        id="cr-cuisine"
                        type="text"
                        value={cuisineType}
                        onChange={(e) => setCuisineType(e.target.value)}
                        className="da-input"
                    />
                </FormField>
                <FormField label="Image URL" id="cr-img">
                    <input
                        id="cr-img"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="da-input"
                    />
                </FormField>
                <FormField label="Airport ID" id="cr-airport" required>
                    <input
                        id="cr-airport"
                        type="number"
                        value={airportId}
                        onChange={(e) =>
                            setAirportId(Number(e.target.value) || 1)
                        }
                        className="da-input"
                        required
                    />
                </FormField>
                <FormField label="Latitude" id="cr-lat" required>
                    <input
                        id="cr-lat"
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        className="da-input"
                        required
                    />
                </FormField>
                <FormField label="Longitude" id="cr-lng" required>
                    <input
                        id="cr-lng"
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        className="da-input"
                        required
                    />
                </FormField>
                <button type="submit" className="da-btn-primary w-full !py-3.5">
                    Create restaurant
                </button>
            </form>
        </div>
    );
}

function FormField({ label, id, required, children }) {
    return (
        <div>
            <label htmlFor={id} className="da-label">
                {label}
                {required ? " *" : ""}
            </label>
            {children}
        </div>
    );
}

export default CreateRestaurantPage;
