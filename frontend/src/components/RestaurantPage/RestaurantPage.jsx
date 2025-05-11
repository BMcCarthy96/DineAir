import { useParams } from "react-router-dom";
import RestaurantDetails from "../RestaurantDetails/RestaurantDetails";
import RestaurantReviews from "../RestaurantReviews/RestaurantReviews";
import "./RestaurantPage.css";

function RestaurantPage() {
    const { restaurantId } = useParams();

    return (
        <div className="restaurant-page">
            <div className="restaurant-content">
                <RestaurantDetails restaurantId={restaurantId} />
                <RestaurantReviews restaurantId={restaurantId} />
            </div>
        </div>
    );
}

export default RestaurantPage;
