import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import ProfileButton from "./ProfileButton";
import { searchRestaurantsAndMenuItems } from "../../store/search";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const searchResults = useSelector((state) => state.search); // Access search results from Redux store
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        await dispatch(searchRestaurantsAndMenuItems(query));
        setShowDropdown(true); // Show dropdown when results are fetched
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  };

  const handleResultClick = (type, id, restaurantId = null) => {
    setShowDropdown(false); // Hide dropdown when navigating
    if (type === "restaurant") {
      navigate(`/restaurants/${id}`);
    } else if (type === "menuItem" && restaurantId) {
      navigate(`/restaurants/${restaurantId}/menu-items/${id}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <ProfileButton user={sessionUser} />
        <NavLink to="/" className="logo">
          DineAir
        </NavLink>
      </div>
      {!isAuthPage && (
        <div className="nav-center">
          <form onSubmit={handleSearch} className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search DineAir"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) {
                  setShowDropdown(false); // Hide dropdown if query is empty
                }
              }}
              onFocus={() => {
                if (searchResults.restaurants.length || searchResults.menuItems.length) {
                  setShowDropdown(true); // Show dropdown when input is focused
                }
              }}
            />
          </form>
          {showDropdown && (
            <div className="search-dropdown">
              {searchResults.restaurants.length > 0 && (
                <div className="dropdown-section">
                  <h4>Restaurants</h4>
                  <ul>
                    {searchResults.restaurants.map((restaurant) => (
                      <li
                        key={restaurant.id}
                        onClick={() => handleResultClick("restaurant", restaurant.id)}
                      >
                        {restaurant.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.menuItems.length > 0 && (
                <div className="dropdown-section">
                  <h4>Menu Items</h4>
                  <ul>
                    {searchResults.menuItems.map((menuItem) => (
                      <li
                        key={menuItem.id}
                        onClick={() => handleResultClick("menuItem", menuItem.id, menuItem.restaurantId)}
                      >
                        {menuItem.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.restaurants.length === 0 &&
                searchResults.menuItems.length === 0 && (
                  <div className="no-results">No results found</div>
                )}
            </div>
          )}
        </div>
      )}
      {!isAuthPage && sessionUser && (
        <div className="nav-right">
          <NavLink to="/cart" className="cart-icon">
            <FaShoppingCart size={24} />
          </NavLink>
        </div>
      )}
      {!isAuthPage && !sessionUser && (
        <div className="nav-right">
          <NavLink to="/login" className="nav-button">
            Log In
          </NavLink>
          <NavLink to="/signup" className="nav-button">
            Sign Up
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
