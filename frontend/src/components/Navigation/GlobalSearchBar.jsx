import { FaSearch } from "react-icons/fa";

function GlobalSearchBar({
    query,
    onQueryChange,
    showDropdown,
    onFocus,
    searchResults,
    onSelectRestaurant,
    onSelectMenuItem,
    className = "",
}) {
    return (
        <div className={`relative ${className}`}>
            <form onSubmit={(e) => e.preventDefault()} className="relative">
                <FaSearch
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                />
                <input
                    type="search"
                    placeholder="Search restaurants & menu…"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onFocus={onFocus}
                    className="da-input !py-2.5 !pl-10"
                    aria-label="Search"
                />
            </form>
            {showDropdown && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-soft-lg dark:border-slate-700 dark:bg-slate-900">
                    {searchResults.restaurants.length > 0 && (
                        <div className="px-3 pb-2">
                            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Restaurants
                            </p>
                            <ul>
                                {searchResults.restaurants.map((restaurant) => (
                                    <li key={restaurant.id}>
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                                            onClick={() =>
                                                onSelectRestaurant(
                                                    restaurant.id
                                                )
                                            }
                                        >
                                            {restaurant.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {searchResults.menuItems.length > 0 && (
                        <div className="px-3 pb-2">
                            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Menu items
                            </p>
                            <ul>
                                {searchResults.menuItems.map((menuItem) => (
                                    <li key={menuItem.id}>
                                        <button
                                            type="button"
                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-800 transition hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                                            onClick={() =>
                                                onSelectMenuItem(
                                                    menuItem.id,
                                                    menuItem.restaurantId
                                                )
                                            }
                                        >
                                            {menuItem.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {searchResults.restaurants.length === 0 &&
                        searchResults.menuItems.length === 0 && (
                            <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                No results found
                            </p>
                        )}
                </div>
            )}
        </div>
    );
}

export default GlobalSearchBar;
