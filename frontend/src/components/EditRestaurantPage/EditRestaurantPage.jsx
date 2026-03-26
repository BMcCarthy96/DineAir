import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiFetch } from "../../utils/apiFetch";
import { Skeleton } from "../ui/Skeleton";

function EditRestaurantPage() {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [terminal, setTerminal] = useState("");
    const [gate, setGate] = useState("");
    const [cuisineType, setCuisineType] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [airportId, setAirportId] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        async function fetchRestaurant() {
            try {
                const response = await apiFetch(
                    `/api/restaurants/${restaurantId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (!cancelled) {
                        setRestaurant(data);
                        setName(data.name);
                        setDescription(data.description);
                        setTerminal(data.terminal);
                        setGate(data.gate);
                        setCuisineType(data.cuisineType);
                        setImageUrl(data.imageUrl);
                        setAirportId(data.airportId);
                    }
                } else {
                    toast.error("Could not load restaurant.");
                }
            } catch {
                toast.error("Could not load restaurant.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchRestaurant();
        return () => {
            cancelled = true;
        };
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

        try {
            const response = await apiFetch(
                `/api/restaurants/${restaurantId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                    },
                    body: JSON.stringify(updatedRestaurant),
                }
            );

            if (response.ok) {
                toast.success("Restaurant updated");
                navigate(`/restaurants/${restaurantId}`);
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || "Update failed");
            }
        } catch {
            toast.error("Update failed");
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-xl space-y-4 px-4 py-10">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="px-4 py-16 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                    Restaurant not found.
                </p>
                <Link to="/restaurants" className="da-btn-primary mt-6 inline-flex">
                    All restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                to={`/restaurants/${restaurantId}`}
                className="text-sm font-semibold text-brand-600 dark:text-brand-400"
            >
                ← Back
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Edit restaurant
            </h1>

            <form
                onSubmit={handleSubmit}
                className="da-card mt-8 space-y-4 p-6 sm:p-8"
            >
                <Field label="Name" htmlFor="er-name">
                    <input
                        id="er-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="da-input"
                        required
                    />
                </Field>
                <Field label="Description" htmlFor="er-desc">
                    <textarea
                        id="er-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="da-input min-h-[100px] resize-y"
                        required
                    />
                </Field>
                <Field label="Terminal" htmlFor="er-term">
                    <input
                        id="er-term"
                        type="text"
                        value={terminal}
                        onChange={(e) => setTerminal(e.target.value)}
                        className="da-input"
                    />
                </Field>
                <Field label="Gate" htmlFor="er-gate">
                    <input
                        id="er-gate"
                        type="text"
                        value={gate}
                        onChange={(e) => setGate(e.target.value)}
                        className="da-input"
                    />
                </Field>
                <Field label="Cuisine" htmlFor="er-cuisine">
                    <input
                        id="er-cuisine"
                        type="text"
                        value={cuisineType}
                        onChange={(e) => setCuisineType(e.target.value)}
                        className="da-input"
                    />
                </Field>
                <Field label="Image URL" htmlFor="er-img">
                    <input
                        id="er-img"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="da-input"
                    />
                </Field>
                <Field label="Airport ID" htmlFor="er-airport">
                    <input
                        id="er-airport"
                        type="number"
                        value={airportId}
                        onChange={(e) =>
                            setAirportId(Number(e.target.value) || 1)
                        }
                        className="da-input"
                        required
                    />
                </Field>
                <button type="submit" className="da-btn-primary w-full !py-3.5">
                    Save changes
                </button>
            </form>
        </div>
    );
}

function Field({ label, htmlFor, children }) {
    return (
        <div>
            <label htmlFor={htmlFor} className="da-label">
                {label}
            </label>
            {children}
        </div>
    );
}

export default EditRestaurantPage;
