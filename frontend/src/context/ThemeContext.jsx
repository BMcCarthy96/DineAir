import { useState, useContext, useEffect } from "react";
import ThemeContext from "./ThemeContextContext";

const STORAGE_KEY = "dineair-theme";

function getInitialTheme() {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
        return "light";
    }
    return "dark";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.body.className = theme;
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/** @see https://github.com/ArnaudBarre/eslint-plugin-react-refresh */
// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useTheme() {
    return useContext(ThemeContext);
}
