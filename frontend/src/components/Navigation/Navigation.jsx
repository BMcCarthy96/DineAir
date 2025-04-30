import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <div className="profile-btn-wrapper">
            {isLoaded && <ProfileButton user={sessionUser} />}
          </div>
          <NavLink to="/" className="title">DineAir</NavLink>
        </div>
        <div className="nav-right">
          {sessionUser && (
            <div className="new-spot-link">
              <NavLink to="/api/spots" className="create-link">
                Create a New Spot
              </NavLink>
            </div>
          )}
          <NavLink to="/login">Log in</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
