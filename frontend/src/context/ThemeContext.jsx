import { useState, useContext, useEffect } from "react";
import ThemeContext from "./ThemeContextContext";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.body.className = theme;
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
