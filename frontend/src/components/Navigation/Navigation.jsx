import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { FaShoppingCart } from "react-icons/fa";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const location = useLocation();

  // Check if the current route is the login or signup page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <ProfileButton user={sessionUser} />
        <NavLink to="/" className="logo">
          DineAir
        </NavLink>
      </div>
      {!isAuthPage && sessionUser && (
        <div className="nav-center">
          <NavLink to="/cart" className="cart-icon">
            <FaShoppingCart size={24} />
          </NavLink>
          {/* Conditionally render the Restaurants button */}
          {(sessionUser.userType === "admin" || sessionUser.userType === "restaurantOwner") && (
            <NavLink
              to={sessionUser.userType === "admin" ? "/restaurants/admin" : "/restaurants/owner"}
              className="nav-button"
            >
              Restaurants
            </NavLink>
          )}
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
