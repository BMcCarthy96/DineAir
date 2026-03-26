import { ToastContainer } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

/**
 * Toast host that follows app light/dark theme.
 */
function ThemedToastContainer() {
    const { theme } = useTheme();

    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === "dark" ? "dark" : "light"}
            toastClassName="!rounded-xl !font-sans !shadow-soft"
        />
    );
}

export default ThemedToastContainer;
