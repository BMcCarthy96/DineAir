import { subscribeToNotifications } from "../../utils/PushNotifications";
import "./SubscribeButton.css";

function SubscribeButton() {
    return (
        <button className="subscribe-button" onClick={subscribeToNotifications}>
            Subscribe to Notifications
        </button>
    );
}

export default SubscribeButton;
