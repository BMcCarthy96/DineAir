import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoHeartOutline } from "react-icons/io5";
import { removeFavorite } from "../../store/favorites";
import RestaurantCard from "../ui/RestaurantCard";
import EmptyState from "../ui/EmptyState";

const fastPrepIds = [4, 5, 9, 10];

function FavoritesPage() {
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleFavorite = (restaurant, event) => {
        event.stopPropagation();
        dispatch(removeFavorite(restaurant.id));
    };

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Favorites
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Saved restaurants for quick reordering at the airport.
            </p>

            {favorites.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        icon={IoHeartOutline}
                        title="No favorites yet"
                        description="Tap the star on any restaurant card to save it here."
                        action={
                            <button
                                type="button"
                                className="da-btn-primary"
                                onClick={() => navigate("/restaurants")}
                            >
                                Explore restaurants
                            </button>
                        }
                    />
                </div>
            ) : (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {favorites.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onSelect={(id) => navigate(`/restaurants/${id}`)}
                            fastPrepIds={fastPrepIds}
                            favoriteControl={
                                <button
                                    type="button"
                                    className="rounded-full bg-white/95 p-2.5 shadow-soft backdrop-blur-sm transition hover:scale-105 dark:bg-slate-900/95"
                                    aria-label="Remove from favorites"
                                    onClick={(e) =>
                                        toggleFavorite(restaurant, e)
                                    }
                                >
                                    <FaStar className="h-5 w-5 text-amber-400" />
                                </button>
                            }
                        />
                    ))}
                </div>
            )}
        </main>
    );
}

export default FavoritesPage;
