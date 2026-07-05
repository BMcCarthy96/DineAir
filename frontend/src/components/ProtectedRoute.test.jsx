import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createStore } from "redux";
import { describe, expect, it } from "vitest";
import { RequireAuth, RequireRole } from "./ProtectedRoute";

function renderWithSession(user, element) {
    const store = createStore(() => ({ session: { user } }));
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route path="/protected" element={element} />
                    <Route path="/login" element={<div>Login page</div>} />
                    <Route path="/" element={<div>Home page</div>} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
}

describe("RequireAuth", () => {
    it("redirects to /login when there is no session user", () => {
        renderWithSession(
            null,
            <RequireAuth>
                <div>Secret content</div>
            </RequireAuth>
        );
        expect(screen.getByText("Login page")).toBeInTheDocument();
        expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
    });

    it("renders the protected children when a session user exists", () => {
        renderWithSession(
            { id: 1, userType: "customer" },
            <RequireAuth>
                <div>Secret content</div>
            </RequireAuth>
        );
        expect(screen.getByText("Secret content")).toBeInTheDocument();
    });
});

describe("RequireRole", () => {
    it("redirects to /login when there is no session user", () => {
        renderWithSession(
            null,
            <RequireRole roles={["admin"]}>
                <div>Admin panel</div>
            </RequireRole>
        );
        expect(screen.getByText("Login page")).toBeInTheDocument();
    });

    it("redirects home when the session user's role is not allowed", () => {
        renderWithSession(
            { id: 1, userType: "customer" },
            <RequireRole roles={["admin"]}>
                <div>Admin panel</div>
            </RequireRole>
        );
        expect(screen.getByText("Home page")).toBeInTheDocument();
        expect(screen.queryByText("Admin panel")).not.toBeInTheDocument();
    });

    it("renders the children when the session user's role is allowed", () => {
        renderWithSession(
            { id: 1, userType: "admin" },
            <RequireRole roles={["admin"]}>
                <div>Admin panel</div>
            </RequireRole>
        );
        expect(screen.getByText("Admin panel")).toBeInTheDocument();
    });
});
