import { useState } from "react";
import "./ThemeToggle.css";

function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode", !darkMode);
    };

    return (
        <button onClick={toggleTheme} className="theme-toggle">
            {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
    );
}

export default ThemeToggle;
