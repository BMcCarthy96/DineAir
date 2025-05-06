import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";
import "./SignupFormPage.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      await dispatch(sessionActions.signup(formData));
      navigate("/");
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h1>Create Your Account</h1>
        <p className="signup-subtitle">Join DineAir and start exploring today</p>
        {Object.values(errors).map((error, idx) => (
          <p key={idx} className="error-message">{error}</p>
        ))}
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
}

export default SignupFormPage;
