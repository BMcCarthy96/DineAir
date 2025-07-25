import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { HiBars3 } from "react-icons/hi2";
import { PiReceiptFill } from "react-icons/pi";
import { IoIosHeart } from "react-icons/io";
import { RiRestaurantLine } from "react-icons/ri";
import { FaRunning } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import "./ProfileButton.css";

function ProfileButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user); // Get the updated user
    const [showSideBar, setSideBar] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Prevent bubbling up to document and triggering closeMenu
        setSideBar(!showSideBar);
    };

    useEffect(() => {
        if (!showSideBar) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setSideBar(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showSideBar]);

    const closeMenu = () => setSideBar(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        navigate("/"); // Navigate to home page after logging out
    };

    const getRestaurantsLink = () => {
        if (sessionUser.userType === "admin") {
            return "/restaurants/admin"; // AdminRestaurantsPage link
        } else if (sessionUser.userType === "restaurantOwner") {
            return "/restaurants/owner"; // OwnerRestaurantsPage link
        }
        return null;
    };

    const ulClassName = "profile-dropdown" + (showSideBar ? "" : " hidden");

    return (
        <>
            <button onClick={toggleMenu} className="profile-button">
                <HiBars3 size={30} />
            </button>

            <ul className={ulClassName} ref={ulRef}>
                {sessionUser ? (
                    <>
                        <div className="options">
                            <div>Hello, {sessionUser.firstName}</div>
                            <div>{sessionUser.email}</div>
                        </div>
                        <hr />
                        <div className="manage-div">
                            <div>
                                <Link
                                    to="/account"
                                    className="manage-link"
                                    onClick={closeMenu}
                                >
                                    <MdAccountCircle
                                        size={20}
                                        className="icon-padding"
                                    />
                                    Account
                                </Link>
                            </div>
                            <div>
                                <Link to="/orders" className="manage-link">
                                    <PiReceiptFill
                                        size={20}
                                        className="icon-padding"
                                    />
                                    Orders
                                </Link>
                            </div>
                            <div>
                                <Link to="/favorites" className="manage-link">
                                    <IoIosHeart
                                        size={20}
                                        className="icon-padding"
                                    />
                                    Favorites
                                </Link>
                            </div>
                            {(sessionUser.userType === "admin" ||
                                sessionUser.userType === "restaurantOwner") && (
                                <div>
                                    <Link
                                        to={getRestaurantsLink()}
                                        className="manage-link"
                                        onClick={closeMenu}
                                    >
                                        <RiRestaurantLine
                                            size={20}
                                            className="icon-padding"
                                        />
                                        Restaurants
                                    </Link>
                                </div>
                            )}
                            {sessionUser.userType === "runner" && (
                                <div>
                                    <Link
                                        to="/runner-dashboard"
                                        className="manage-link"
                                        onClick={closeMenu}
                                    >
                                        <FaRunning
                                            size={20}
                                            className="icon-padding"
                                        />
                                        Runner Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="logout-button-div">
                            <button className="logout-button" onClick={logout}>
                                Log Out
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="sidebar-content">
                        <Link to="/login" className="sidebar-link">
                            Log In
                        </Link>
                        <Link to="/signup" className="sidebar-link">
                            Sign Up
                        </Link>
                    </div>
                )}
            </ul>
        </>
    );
}

export default ProfileButton;
