import SmartImage from "./SmartImage";

/** Shared restaurant card for the Admin and Owner management dashboards. */
function ManagementRestaurantCard({ restaurant, onEdit, onDelete, onManageMenu }) {
    return (
        <article className="da-card flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5">
            <button
                type="button"
                className="block flex-1 text-left"
                onClick={onManageMenu}
            >
                <SmartImage src={restaurant.imageUrl} alt="" className="h-44 w-full" />
                <div className="p-5">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {restaurant.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                        {restaurant.description}
                    </p>
                </div>
            </button>
            <div className="flex gap-2 border-t border-slate-100 p-4 dark:border-night-700">
                <button
                    type="button"
                    className="da-btn-secondary flex-1 !py-2 !text-sm"
                    onClick={onEdit}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

export default ManagementRestaurantCard;
