import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import { HiBars3 } from "react-icons/hi2";
import { PiReceiptFill } from "react-icons/pi";
import { IoIosHeart } from "react-icons/io";
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSideBar, setSideBar] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setSideBar(!showSideBar);
  };

  useEffect(() => {
    if (!showSideBar) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setSideBar(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showSideBar]);

  const closeMenu = () => setSideBar(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/'); // Navigates to home page after logging out
  };

  const getRestaurantsLink = () => {
    if (user.userType === "admin") {
      return "/restaurants/admin"; // AdminRestaurantsPage
    } else if (user.userType === "restaurantOwner") {
      return "/restaurants/owner"; // OwnerRestaurantsPage
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
        {user ? (
          <>
            <div className="options">
              <div>Hello, {user.firstName}</div>
              <div>{user.email}</div>
            </div>
            <hr />
            <div className="manage-div">
              <div>
                <Link to="/orders" className="manage-link"> <PiReceiptFill size={20} className="icon-padding"/>
                  Orders
                </Link>
              </div>
              <div>
                <Link to="/favorites" className="manage-link"> <IoIosHeart size={20} className="icon-padding"/>
                  Favorites
                </Link>
              </div>
              {(user.userType === "admin" || user.userType === "restaurantOwner") && (
                <div>
                  <Link
                    to={getRestaurantsLink()}
                    className="manage-link"
                    onClick={closeMenu}
                  >
                    Restaurants
                  </Link>
                </div>
              )}
              {user.userType === "runner" && (
                <div>
                  <Link
                    to="/runner-dashboard"
                    className="manage-link"
                    onClick={closeMenu}
                  >
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
