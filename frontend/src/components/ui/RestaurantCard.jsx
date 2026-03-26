import { FaStar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import {
    displayRating,
    estimatedDeliveryRange,
    isFastPrepRestaurant,
} from "../../utils/restaurantDisplay";

function RestaurantCard({
    restaurant,
    onSelect,
    favoriteControl,
    fastPrepIds,
}) {
    const rating = displayRating(restaurant.id);
    const eta = estimatedDeliveryRange(restaurant.id);
    const fast = isFastPrepRestaurant(restaurant.id, fastPrepIds);

    return (
        <article
            role="listitem"
            tabIndex={0}
            onClick={() => onSelect(restaurant.id)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(restaurant.id);
                }
            }}
            className="da-card group cursor-pointer overflow-hidden outline-none ring-brand-500/0 transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Open ${restaurant.name}`}
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src={
                        restaurant.imageUrl ||
                        "https://via.placeholder.com/640x400?text=DineAir"
                    }
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {fast && (
                    <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-soft">
                        Fast prep
                    </span>
                )}
                {favoriteControl && (
                    <div
                        className="absolute right-3 top-3"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                    >
                        {favoriteControl}
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                        {restaurant.name}
                    </h3>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                        <FaStar className="text-amber-500" aria-hidden />
                        {rating}
                    </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {restaurant.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                        {restaurant.cuisineType}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaClock className="text-brand-500" aria-hidden />
                        {eta}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-brand-500" aria-hidden />
                        T{restaurant.terminal} · Gate {restaurant.gate}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default RestaurantCard;
