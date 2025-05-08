import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
// import LoginFormPage from '../LoginFormPage';
// import SignupFormPage from '../SignupFormPage';
import { HiBars3 } from "react-icons/hi2";
import './ProfileButton.css'

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
    navigate('/') // Navigates to home page after logging out
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
                              <Link to="/orders" className="manage-link">
                                  My Orders
                              </Link>
                          </div>
                          <div>
                              <Link to="/favorites" className="manage-link">
                                  Favorites
                              </Link>
                          </div>
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
