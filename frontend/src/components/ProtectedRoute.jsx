import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/** Redirects to /login if not authenticated, preserving the intended destination. */
export function RequireAuth({ children }) {
    const sessionUser = useSelector((state) => state.session.user);
    const location = useLocation();

    if (!sessionUser) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
}

/** Redirects home if authenticated but not one of the allowed roles. */
export function RequireRole({ roles, children }) {
    const sessionUser = useSelector((state) => state.session.user);
    const location = useLocation();

    if (!sessionUser) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    if (!roles.includes(sessionUser.userType)) {
        return <Navigate to="/" replace />;
    }
    return children;
}
