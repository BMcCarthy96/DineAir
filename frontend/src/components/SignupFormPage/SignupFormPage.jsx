import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

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
        userType: "customer",
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
            try {
                if (res && typeof res.json === "function") {
                    const data = await res.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                        return;
                    }
                }
            } catch {
                /* ignore */
            }
            setErrors({ form: "Something went wrong. Please try again." });
        }
    };

    const errorList = Object.entries(errors);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="da-card p-8 shadow-soft-lg sm:p-10">
                    <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Create your account
                    </h1>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Join DineAir and get airport food at your gate.
                    </p>

                    {errorList.length > 0 && (
                        <ul
                            className="mt-6 space-y-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                            role="alert"
                        >
                            {errorList.map(([key, message]) => (
                                <li key={key}>{message}</li>
                            ))}
                        </ul>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 max-h-[60vh] space-y-4 overflow-y-auto pr-1 sm:max-h-none"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="da-label">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="da-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="da-label">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="da-input"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="da-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="da-input"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="da-label">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="da-input"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="da-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="da-input"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="da-label"
                            >
                                Confirm password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="da-input"
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="userType" className="da-label">
                                Account type
                            </label>
                            <select
                                id="userType"
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                className="da-input cursor-pointer"
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="runner">Runner</option>
                                <option value="restaurantOwner">
                                    Restaurant owner
                                </option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="da-btn-primary w-full !py-3.5"
                        >
                            Sign up
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupFormPage;
