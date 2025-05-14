import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { updateUser } from "../../store/session";
import "./AccountPage.css";

function AccountPage() {
    const { sessionUser } = useOutletContext();
    const [firstName, setFirstName] = useState(sessionUser.firstName || "");
    const [lastName, setLastName] = useState(sessionUser.lastName || "");
    const [email, setEmail] = useState(sessionUser.email || "");
    const [username, setUsername] = useState(sessionUser.username || "");
    const [phone, setPhone] = useState(sessionUser.phone || "");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProfile = {
            firstName,
            lastName,
            email,
            username,
            phone,
            password: password || undefined,
        };

        try {
            const response = await fetch(`/api/users/${sessionUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "XSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify(updatedProfile),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                dispatch(updateUser(updatedUser.user));
                alert("Profile updated successfully!");
                navigate("/"); // Redirect to the homepage or another page
            } else {
                const errorData = await response.json();
                alert(
                    `Failed to update profile: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="account-page">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className="account-form">
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Phone Number:
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>
                <label>
                    Password (leave blank to keep current password):
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit" className="submit-button">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default AccountPage;
