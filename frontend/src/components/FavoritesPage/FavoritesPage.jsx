import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoHeartOutline } from "react-icons/io5";
import { unfavoriteRestaurant } from "../../store/favorites";
import RestaurantCard from "../ui/RestaurantCard";
import EmptyState from "../ui/EmptyState";
import PageHeader from "../ui/PageHeader";

function FavoritesPage() {
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleFavorite = (restaurant, event) => {
        event.stopPropagation();
        dispatch(unfavoriteRestaurant(restaurant.id));
    };

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <PageHeader
                eyebrow="Saved"
                title="Favorites"
                description="Saved restaurants for quick reordering at the airport."
            />

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
                            favoriteControl={
                                <button
                                    type="button"
                                    className="rounded-full bg-white/95 p-2.5 shadow-soft backdrop-blur-sm transition hover:scale-105 dark:bg-night-900/95"
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
