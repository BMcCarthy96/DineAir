import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
        <nav className="navbar">
            <div className="nav-left">
                <NavLink to="/" className="logo">
                    DineAir
                </NavLink>
            </div>
            <div className="nav-center">
                <NavLink to="/" className="nav-button">
                    Home
                </NavLink>
                <NavLink to="/cart" className="nav-button">
                    Cart
                </NavLink>
                <NavLink to="/orders" className="nav-button">
                    Orders
                </NavLink>
                <NavLink to="/restaurants" className="nav-button">
                    Restaurants
                </NavLink>
            </div>
            <div className="nav-right">
                {isLoaded && <ProfileButton user={sessionUser} />}
            </div>
        </nav>
    );
}

export default Navigation;
