import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import "./OrderHistoryPage.css";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch("/api/orders", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        }
        fetchOrders();
    }, []);

    const handleReorder = async (orderId) => {
        try {
            const csrfToken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];

            const response = await fetch(`/api/orders/${orderId}/reorder`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
            });

            if (response.ok) {
                const cartItems = await response.json();
                alert("Order has been reordered!");
                navigate("/cart", { state: { cartItems } });
            } else {
                const errorData = await response.json();
                alert(
                    errorData.error || "Failed to reorder. Please try again."
                );
            }
        } catch (err) {
            console.error("Error reordering:", err);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <Box
            className="order-history-page"
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(120deg, #ff6f61 0%, #ff9a85 100%)",
            }}
        >
            <Typography
                variant="h2"
                align="center"
                sx={{
                    color: "#fff",
                    mb: 4,
                    fontWeight: "bold",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.15)",
                }}
            >
                Order History
            </Typography>
            {orders.length === 0 ? (
                <Typography variant="h5" align="center" sx={{ color: "#fff" }}>
                    You have no past orders.
                </Typography>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {orders.map((order, idx) => (
                        <Grid item xs={12} sm={8} md={6} lg={4} key={order.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow:
                                        "0 8px 32px rgba(255,111,97,0.25)",
                                }}
                            >
                                <Card
                                    className="order-card"
                                    sx={{
                                        borderRadius: 4,
                                        boxShadow:
                                            "0 4px 24px rgba(0,0,0,0.12)",
                                        background: "rgba(255,255,255,0.95)",
                                        backdropFilter: "blur(2px)",
                                        transition: "box-shadow 0.3s",
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "#ff6f61",
                                                mb: 2,
                                            }}
                                        >
                                            Order #{order.id}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            <strong>Status:</strong>{" "}
                                            {order.status}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            <strong>Total Price:</strong> $
                                            {!isNaN(Number(order.totalPrice))
                                                ? Number(
                                                      order.totalPrice
                                                  ).toFixed(2)
                                                : "0.00"}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            <strong>Restaurant:</strong>{" "}
                                            {order.Restaurant?.name ||
                                                "Unknown"}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            <strong>Gate:</strong>{" "}
                                            {order.gate || "Not specified"}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                mt: 2,
                                                background:
                                                    "linear-gradient(90deg, #ff6f61 0%, #ff9a85 100%)",
                                                color: "#fff",
                                                fontWeight: "bold",
                                                borderRadius: 2,
                                                boxShadow:
                                                    "0 2px 8px rgba(255,111,97,0.18)",
                                                transition: "background 0.3s",
                                                "&:hover": {
                                                    background:
                                                        "linear-gradient(90deg, #f84d3e 0%, #ff9a85 100%)",
                                                },
                                            }}
                                            onClick={() =>
                                                handleReorder(order.id)
                                            }
                                        >
                                            Reorder
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}

export default OrderHistoryPage;
