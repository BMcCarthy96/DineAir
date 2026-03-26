import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaMoon, FaSun } from "react-icons/fa";
import ProfileButton from "./ProfileButton";
import GlobalSearchBar from "./GlobalSearchBar";
import { searchRestaurantsAndMenuItems } from "../../store/search";
import { useTheme } from "../../context/ThemeContext";

function Navigation() {
    const sessionUser = useSelector((state) => state.session.user);
    const searchResults = useSelector((state) => state.search);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const isAuthPage =
        location.pathname === "/login" || location.pathname === "/signup";

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                dispatch(searchRestaurantsAndMenuItems(query));
                setShowDropdown(true);
            } else {
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, dispatch]);

    const handleResultClick = (type, id, restaurantId = null) => {
        setShowDropdown(false);
        if (type === "restaurant") {
            navigate(`/restaurants/${id}`);
        } else if (type === "menuItem" && restaurantId) {
            navigate(`/restaurants/${restaurantId}/menu-items/${id}`);
        }
    };

    const navShell =
        "sticky top-0 z-[1000] border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80";

    const searchFocus = () => {
        if (
            searchResults.restaurants.length ||
            searchResults.menuItems.length
        ) {
            setShowDropdown(true);
        }
    };

    return (
        <nav className={navShell} aria-label="Main">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                    <ProfileButton />
                    <NavLink
                        to="/"
                        className="truncate text-lg font-bold tracking-tight text-slate-900 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
                    >
                        DineAir
                    </NavLink>
                </div>

                {!isAuthPage && (
                    <div className="relative mx-auto hidden min-w-0 max-w-xl flex-1 md:block">
                        <GlobalSearchBar
                            query={query}
                            onQueryChange={setQuery}
                            showDropdown={showDropdown}
                            onFocus={searchFocus}
                            searchResults={searchResults}
                            onSelectRestaurant={(id) =>
                                handleResultClick("restaurant", id)
                            }
                            onSelectMenuItem={(id, restaurantId) =>
                                handleResultClick(
                                    "menuItem",
                                    id,
                                    restaurantId
                                )
                            }
                        />
                    </div>
                )}

                <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
                    {!isAuthPage && sessionUser && (
                        <NavLink
                            to="/cart"
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            aria-label="Cart"
                        >
                            <FaShoppingCart className="h-5 w-5" />
                        </NavLink>
                    )}
                    {!isAuthPage && !sessionUser && (
                        <>
                            <NavLink
                                to="/login"
                                className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex"
                            >
                                Log in
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="da-btn-primary hidden !py-2 !text-sm sm:inline-flex"
                            >
                                Sign up
                            </NavLink>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600"
                        aria-label={
                            theme === "light"
                                ? "Switch to dark mode"
                                : "Switch to light mode"
                        }
                    >
                        {theme === "light" ? (
                            <FaMoon className="h-4 w-4" />
                        ) : (
                            <FaSun className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {!isAuthPage && (
                <div className="border-t border-slate-100 px-4 pb-3 pt-2 dark:border-slate-800 md:hidden">
                    <GlobalSearchBar
                        query={query}
                        onQueryChange={setQuery}
                        showDropdown={showDropdown}
                        onFocus={searchFocus}
                        searchResults={searchResults}
                        onSelectRestaurant={(id) =>
                            handleResultClick("restaurant", id)
                        }
                        onSelectMenuItem={(id, restaurantId) =>
                            handleResultClick("menuItem", id, restaurantId)
                        }
                    />
                </div>
            )}
        </nav>
    );
}

export default Navigation;
