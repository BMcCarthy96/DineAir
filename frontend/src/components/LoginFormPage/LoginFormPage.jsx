import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import './LoginFormPage.css';

function LoginFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState("Customer"); // Default role

  const resetForm = () => {
    setCredential("");
    setPassword("");
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        resetForm();
        navigate("/"); // Navigate to the home page after login
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors?.credential) {
          setErrors({ credential: data.errors.credential });
        } else {
          setErrors({ credential: "The provided credentials were invalid." });
        }
      });
  };

  const handleDemoLogin = () => {
    let demoCredentials;

    // Set credentials based on the selected role
    if (selectedRole === "Customer") {
      demoCredentials = { credential: "JustinTyme@dineair.com", password: "password" };
    } else if (selectedRole === "Admin") {
      demoCredentials = { credential: "admin@dineair.com", password: "adminpassword" };
    } else if (selectedRole === "Restaurant Owner") {
      demoCredentials = { credential: "owner1@dineair.com", password: "ownerpassword" };
    } else if (selectedRole === "Runner") {
      demoCredentials = { credential: "carrie.on@dineair.com", password: "password4" };
    }

    dispatch(sessionActions.login(demoCredentials)).then(() => navigate("/"));
  };

  // Reset the form on unmount
  useEffect(() => {
    return () => resetForm();
  }, []);

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Log in to continue exploring DineAir</p>
        {errors.credential && <p className="error-message">{errors.credential}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={credential}
            placeholder="Email or Username"
            onChange={(e) => setCredential(e.target.value)}
            title="Enter your email or username"
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            title="Password must be at least 6 characters"
            required
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <div className="role-toggle-container">
          <p>Select a role to log in as:</p>
          <div className="role-toggle-buttons">
            <button
              className={`role-button ${selectedRole === "Customer" ? "active" : ""}`}
              onClick={() => setSelectedRole("Customer")}
            >
              Customer
            </button>
            <button
              className={`role-button ${selectedRole === "Admin" ? "active" : ""}`}
              onClick={() => setSelectedRole("Admin")}
            >
              Admin
            </button>
            <button
              className={`role-button ${selectedRole === "Restaurant Owner" ? "active" : ""}`}
              onClick={() => setSelectedRole("Restaurant Owner")}
            >
              Restaurant Owner
            </button>
            <button
              className={`role-button ${selectedRole === "Runner" ? "active" : ""}`}
              onClick={() => setSelectedRole("Runner")}
            >
              Runner
            </button>
          </div>
          <button className="demo-user-button" onClick={handleDemoLogin}>
            Log in as {selectedRole === "Customer" ? "Customer" : selectedRole}
          </button>
        </div>

        <p className="signup-link">
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginFormPage;
