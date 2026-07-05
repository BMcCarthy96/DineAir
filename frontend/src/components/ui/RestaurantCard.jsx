import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { formatRating } from "../../utils/restaurantDisplay";
import SmartImage from "./SmartImage";

function RestaurantCard({ restaurant, onSelect, favoriteControl }) {
    const rating = formatRating(restaurant.avgRating, restaurant.reviewCount);

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
            <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                    src={restaurant.imageUrl}
                    alt=""
                    className="h-full w-full"
                    imgClassName="transition duration-500 group-hover:scale-105"
                />
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
                    <h3 className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                        {restaurant.name}
                    </h3>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-sm font-medium text-amber-800 dark:bg-brand-500/15 dark:text-brand-300">
                        <FaStar className="text-amber-500 dark:text-brand-400" aria-hidden />
                        {rating}
                    </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                    {restaurant.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="da-chip">{restaurant.cuisineType}</span>
                    <span className="da-chip-mono">
                        <FaMapMarkerAlt aria-hidden />
                        T{restaurant.terminal} · Gate {restaurant.gate}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default RestaurantCard;
