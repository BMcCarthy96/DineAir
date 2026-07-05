const TAX_RATE = 0.0825;
const SERVICE_FEE = 2.49;

/** Subtotal/tax/fee/total for a cart-items array shaped like [{ quantity, MenuItem: { price } }]. */
export function computeCartTotals(cartItems) {
    const subtotal = cartItems.reduce(
        (total, item) => total + item.quantity * Number(item.MenuItem?.price || 0),
        0
    );
    const taxEstimate = subtotal * TAX_RATE;
    const serviceFee = cartItems.length ? SERVICE_FEE : 0;
    const total = subtotal + taxEstimate + serviceFee;

    return { subtotal, taxEstimate, serviceFee, total };
}

export function formatMoney(n) {
    return !Number.isNaN(n) ? n.toFixed(2) : "0.00";
}
