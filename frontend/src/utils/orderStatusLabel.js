const STATUS_LABELS = {
    pending: "Order Received",
    preparing: "Preparing",
    picked_up: "On the Way",
    on_the_way: "On the Way",
    delivered: "Delivered",
};

/** Human-readable label for a DB order status (falls back for unknown/missing values). */
export function orderStatusLabel(status) {
    return STATUS_LABELS[status] ?? "Order Received";
}
