import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function LoginFormPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [selectedRole, setSelectedRole] = useState("Customer");

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
                navigate("/");
            })
            .catch(async (err) => {
                try {
                    if (err && typeof err.json === "function") {
                        const data = await err.json();
                        if (data?.errors?.credential) {
                            setErrors({ credential: data.errors.credential });
                            return;
                        }
                    }
                } catch {
                    /* ignore parse errors */
                }
                setErrors({
                    credential: "The provided credentials were invalid.",
                });
            });
    };

    const handleDemoLogin = () => {
        let demoCredentials;
        if (selectedRole === "Customer") {
            demoCredentials = {
                credential: "JustinTyme@dineair.com",
                password: "password",
            };
        } else if (selectedRole === "Admin") {
            demoCredentials = {
                credential: "admin@dineair.com",
                password: "adminpassword",
            };
        } else if (selectedRole === "Restaurant Owner") {
            demoCredentials = {
                credential: "owner1@dineair.com",
                password: "ownerpassword",
            };
        } else if (selectedRole === "Runner") {
            demoCredentials = {
                credential: "carrie.on@dineair.com",
                password: "password4",
            };
        }

        dispatch(sessionActions.login(demoCredentials))
            .then(() => navigate("/"))
            .catch(async (err) => {
                try {
                    if (err && typeof err.json === "function") {
                        const data = await err.json();
                        if (data?.errors?.credential) {
                            setErrors({ credential: data.errors.credential });
                            return;
                        }
                    }
                } catch {
                    /* ignore */
                }
                setErrors({ credential: "Demo login failed." });
            });
    };

    useEffect(() => {
        return () => resetForm();
    }, []);

    const roles = [
        "Customer",
        "Admin",
        "Restaurant Owner",
        "Runner",
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="da-card p-8 shadow-soft-lg sm:p-10">
                    <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Log in to order and track deliveries to your gate.
                    </p>

                    {errors.credential && (
                        <p
                            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                            role="alert"
                        >
                            {errors.credential}
                        </p>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-4"
                        noValidate
                    >
                        <div>
                            <label htmlFor="login-credential" className="da-label">
                                Email or username
                            </label>
                            <input
                                id="login-credential"
                                type="text"
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                className="da-input"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="da-label">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="da-input"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button type="submit" className="da-btn-primary w-full !py-3.5">
                            Log in
                        </button>
                    </form>

                    <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700">
                        <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                            Demo: pick a role
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {roles.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                        selectedRole === role
                                            ? "bg-brand-600 text-white shadow-soft"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="da-btn-secondary mt-4 w-full !py-3"
                            onClick={handleDemoLogin}
                        >
                            Log in as{" "}
                            {selectedRole === "Customer"
                                ? "Customer"
                                : selectedRole}
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginFormPage;
