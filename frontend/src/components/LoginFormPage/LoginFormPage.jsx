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
    dispatch(sessionActions.login({ credential: "JustinTyme@dineair.com", password: "password" }))
      .then(() => navigate("/")); // Automatically log in as the first customer
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
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <button className="demo-user-button" onClick={handleDemoLogin}>
          Log In as Demo User
        </button>
        <p className="signup-link">
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginFormPage;
