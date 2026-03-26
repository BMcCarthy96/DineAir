import { useParams } from "react-router-dom";
import RestaurantDetails from "../RestaurantDetails/RestaurantDetails";
import RestaurantReviews from "../RestaurantReviews/RestaurantReviews";

function RestaurantPage() {
    const { restaurantId } = useParams();

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10">
                <div className="w-full">
                    <RestaurantDetails restaurantId={restaurantId} />
                </div>
                <RestaurantReviews restaurantId={restaurantId} />
            </div>
        </div>
    );
}

export default RestaurantPage;
