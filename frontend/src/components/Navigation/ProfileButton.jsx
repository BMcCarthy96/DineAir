import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { HiBars3 } from "react-icons/hi2";
import { PiReceiptFill } from "react-icons/pi";
import { IoIosHeart } from "react-icons/io";
import { RiRestaurantLine } from "react-icons/ri";
import { FaRunning } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

function ProfileButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    const [showSideBar, setSideBar] = useState(false);
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation();
        setSideBar(!showSideBar);
    };

    useEffect(() => {
        if (!showSideBar) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setSideBar(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showSideBar]);

    const closeMenu = () => setSideBar(false);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        closeMenu();
        navigate("/");
    };

    const getRestaurantsLink = () => {
        if (!sessionUser) return null;
        if (sessionUser.userType === "admin") {
            return "/restaurants/admin";
        }
        if (sessionUser.userType === "restaurantOwner") {
            return "/restaurants/owner";
        }
        return null;
    };

    const restaurantsLink = sessionUser ? getRestaurantsLink() : null;

    const dropdownClass = [
        "absolute left-0 top-full z-[1100] mt-2 min-w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-soft-lg dark:border-slate-700 dark:bg-slate-900",
        showSideBar ? "block" : "hidden",
    ].join(" ");

    return (
        <div className="relative" ref={ulRef}>
            <button
                type="button"
                onClick={toggleMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-800 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-expanded={showSideBar}
                aria-haspopup="true"
                aria-label="Open menu"
            >
                <HiBars3 className="h-6 w-6" />
            </button>

            <ul className={dropdownClass}>
                {sessionUser ? (
                    <>
                        <li className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                Hello, {sessionUser.firstName}
                            </div>
                            <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {sessionUser.email}
                            </div>
                        </li>
                        <li>
                            <Link
                                to="/account"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={closeMenu}
                            >
                                <MdAccountCircle className="h-5 w-5 shrink-0 text-brand-500" />
                                Account
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/orders"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={closeMenu}
                            >
                                <PiReceiptFill className="h-5 w-5 shrink-0 text-brand-500" />
                                Orders
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/favorites"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                onClick={closeMenu}
                            >
                                <IoIosHeart className="h-5 w-5 shrink-0 text-brand-500" />
                                Favorites
                            </Link>
                        </li>
                        {restaurantsLink && (
                            <li>
                                <Link
                                    to={restaurantsLink}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                    onClick={closeMenu}
                                >
                                    <RiRestaurantLine className="h-5 w-5 shrink-0 text-brand-500" />
                                    Restaurants
                                </Link>
                            </li>
                        )}
                        {sessionUser.userType === "runner" && (
                            <li>
                                <Link
                                    to="/runner-dashboard"
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                                    onClick={closeMenu}
                                >
                                    <FaRunning className="h-5 w-5 shrink-0 text-brand-500" />
                                    Runner dashboard
                                </Link>
                            </li>
                        )}
                        <li className="border-t border-slate-100 p-2 dark:border-slate-800">
                            <button
                                type="button"
                                className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/50"
                                onClick={logout}
                            >
                                Log out
                            </button>
                        </li>
                    </>
                ) : (
                    <li className="flex flex-col gap-1 p-2">
                        <Link
                            to="/login"
                            className="rounded-xl px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                            onClick={closeMenu}
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-xl bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700"
                            onClick={closeMenu}
                        >
                            Sign up
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default ProfileButton;
