// import { useState, useEffect } from "react";
import "./OrderTracking.css";

function OrderTracking({ orderStatus }) {
    const statuses = ["Order Received", "Preparing", "On the Way", "Delivered"];
    const currentStep = statuses.indexOf(orderStatus);

    return (
        <div className="order-tracking">
            {statuses.map((status, index) => (
                <div
                    key={index}
                    className={`step ${index <= currentStep ? "active" : ""}`}
                >
                    <div className="circle">{index + 1}</div>
                    <p>{status}</p>
                </div>
            ))}
        </div>
    );
}

export default OrderTracking;
