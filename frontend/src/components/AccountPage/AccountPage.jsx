import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import * as sessionActions from "../../store/session";
import { apiFetch } from "../../utils/apiFetch";

function AccountPage() {
    const { sessionUser } = useOutletContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sessionUser) return;
        setFirstName(sessionUser.firstName || "");
        setLastName(sessionUser.lastName || "");
        setEmail(sessionUser.email || "");
        setUsername(sessionUser.username || "");
        setPhone(sessionUser.phone || "");
    }, [sessionUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sessionUser) return;

        const updatedProfile = {
            firstName,
            lastName,
            email,
            username,
            phone,
            password: password || undefined,
        };

        try {
            const response = await apiFetch(`/api/users/${sessionUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
                body: JSON.stringify(updatedProfile),
            });

            if (response.ok) {
                const body = await response.json();
                dispatch(sessionActions.updateUser(body.user));
                toast.success("Profile updated");
                navigate("/");
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(
                    errorData.error || errorData.message || "Update failed"
                );
            }
        } catch {
            toast.error("Something went wrong. Try again.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!sessionUser) return;
        try {
            const response = await apiFetch(`/api/users/${sessionUser.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN") || "",
                },
            });
            if (response.ok) {
                toast.success("Account deleted");
                await dispatch(sessionActions.logout());
                navigate("/");
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || "Could not delete account");
            }
        } catch {
            toast.error("Could not delete account");
        }
    };

    if (!sessionUser) {
        return (
            <div className="mx-auto max-w-md px-4 py-20 text-center">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Sign in required
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Log in to manage your DineAir profile.
                </p>
                <Link
                    to="/login"
                    className="da-btn-primary mt-6 inline-flex"
                >
                    Log in
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Account
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Update your details or remove your account.
            </p>

            <form
                onSubmit={handleSubmit}
                className="da-card mt-8 space-y-4 p-6 sm:p-8"
            >
                <div>
                    <label htmlFor="acct-first" className="da-label">
                        First name
                    </label>
                    <input
                        id="acct-first"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="da-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="acct-last" className="da-label">
                        Last name
                    </label>
                    <input
                        id="acct-last"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="da-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="acct-email" className="da-label">
                        Email
                    </label>
                    <input
                        id="acct-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="da-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="acct-user" className="da-label">
                        Username
                    </label>
                    <input
                        id="acct-user"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="da-input"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="acct-phone" className="da-label">
                        Phone
                    </label>
                    <input
                        id="acct-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="da-input"
                    />
                </div>
                <div>
                    <label htmlFor="acct-pass" className="da-label">
                        New password (optional)
                    </label>
                    <input
                        id="acct-pass"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="da-input"
                        autoComplete="new-password"
                    />
                </div>
                <button type="submit" className="da-btn-primary w-full !py-3.5">
                    Save changes
                </button>
                <button
                    type="button"
                    className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Delete account
                </button>
            </form>

            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-title"
                >
                    <div className="da-card max-w-md p-6 shadow-soft-lg">
                        <h3
                            id="delete-title"
                            className="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                            Delete your account?
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            This cannot be undone.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="da-btn-primary flex-1 !bg-red-600 hover:!bg-red-700"
                                onClick={handleDeleteAccount}
                            >
                                Yes, delete
                            </button>
                            <button
                                type="button"
                                className="da-btn-secondary flex-1"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountPage;
