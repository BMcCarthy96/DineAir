import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchReviewsByRestaurant,
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
} from "../../store/reviews";

function RestaurantReviews({ restaurantId }) {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews);
    const sessionUser = useSelector((state) => state.session.user);
    const userId = sessionUser?.id ?? null;

    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [newReview, setNewReview] = useState({ rating: "", comment: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const handleFetchReviews = async () => {
            try {
                setError(null);
                await dispatch(fetchReviewsByRestaurant(restaurantId));
            } catch {
                setError("Could not load reviews.");
            }
        };
        handleFetchReviews();
    }, [dispatch, restaurantId]);

    const handleToggleLike = (review) => {
        if (!userId) return;
        const isLiked = review.likes?.includes(userId);
        dispatch(toggleLike(review.id, isLiked));
    };

    const handleAddReview = async () => {
        if (!sessionUser) return;
        if (!newReview.comment?.trim() || !newReview.rating) {
            setError("Add a rating and comment.");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await dispatch(createReview(restaurantId, newReview));
            setNewReview({ rating: "", comment: "" });
        } catch {
            setError("Could not post review.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditReview = async (review) => {
        setSubmitting(true);
        setError(null);
        try {
            await dispatch(
                updateReview(restaurantId, { ...review, ...editingReview })
            );
            setEditingReview(null);
        } catch {
            setError("Could not update review.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await dispatch(deleteReview(restaurantId, reviewId));
        } catch {
            setError("Could not delete review.");
        }
    };

    const reviewList = reviews ? Object.values(reviews) : [];

    return (
        <section
            className="da-card w-full max-w-3xl p-6 sm:p-8"
            aria-labelledby="reviews-heading"
        >
            <h2
                id="reviews-heading"
                className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
                Customer reviews
            </h2>

            {error && (
                <p
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {sessionUser ? (
                <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                    <label htmlFor="new-review-text" className="da-label">
                        Write a review
                    </label>
                    <textarea
                        id="new-review-text"
                        placeholder="How was your meal?"
                        value={newReview.comment}
                        onChange={(e) =>
                            setNewReview({
                                ...newReview,
                                comment: e.target.value,
                            })
                        }
                        className="da-input min-h-[100px] resize-y"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label
                                htmlFor="new-review-rating"
                                className="da-label"
                            >
                                Rating (1–5)
                            </label>
                            <input
                                id="new-review-rating"
                                type="number"
                                min="1"
                                max="5"
                                value={newReview.rating}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        rating: e.target.value,
                                    })
                                }
                                className="da-input"
                            />
                        </div>
                        <button
                            type="button"
                            className="da-btn-primary !py-3 sm:shrink-0"
                            disabled={submitting}
                            onClick={handleAddReview}
                        >
                            Post review
                        </button>
                    </div>
                </div>
            ) : (
                <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
                    Log in to leave a review.
                </p>
            )}

            {reviewList.length === 0 ? (
                <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
                    No reviews yet—be the first.
                </p>
            ) : (
                <ul className="mt-8 space-y-4">
                    {reviewList.map((review) => {
                        const isLiked =
                            userId && review.likes?.includes(userId);
                        const isOwner =
                            sessionUser && review.userId === sessionUser.id;

                        return (
                            <li
                                key={review.id}
                                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        {review.User?.username ||
                                            "Traveler"}
                                    </h3>
                                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                        {review.rating} / 5
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    {review.comment}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                    <span className="text-xs text-slate-500">
                                        {review.likes?.length || 0} likes
                                    </span>
                                    <button
                                        type="button"
                                        disabled={!userId}
                                        onClick={() => handleToggleLike(review)}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                                            isLiked
                                                ? "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200"
                                                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600"
                                        } ${!userId ? "cursor-not-allowed opacity-50" : ""}`}
                                    >
                                        {isLiked ? "Liked" : "Like"}
                                    </button>
                                </div>

                                {editingReview?.id === review.id ? (
                                    <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                                        <textarea
                                            value={
                                                editingReview?.comment || ""
                                            }
                                            onChange={(e) =>
                                                setEditingReview({
                                                    ...editingReview,
                                                    comment: e.target.value,
                                                })
                                            }
                                            className="da-input min-h-[80px]"
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={editingReview?.rating || ""}
                                            onChange={(e) =>
                                                setEditingReview({
                                                    ...editingReview,
                                                    rating: e.target.value,
                                                })
                                            }
                                            className="da-input"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                className="da-btn-primary !py-2 !text-sm"
                                                disabled={submitting}
                                                onClick={() =>
                                                    handleEditReview(review)
                                                }
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="da-btn-secondary !py-2 !text-sm"
                                                onClick={() =>
                                                    setEditingReview(null)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    isOwner && (
                                        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                                            <button
                                                type="button"
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                                                onClick={() =>
                                                    setEditingReview({
                                                        id: review.id,
                                                        comment:
                                                            review.comment ||
                                                            "",
                                                        rating:
                                                            review.rating || 1,
                                                    })
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                                                onClick={() =>
                                                    handleDeleteReview(
                                                        review.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}

export default RestaurantReviews;
