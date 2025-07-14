import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
} from "@mui/material";
import { motion } from "framer-motion";
import "./FavoritesPage.css";

function FavoritesPage() {
    const favorites = useSelector((state) => state.favorites);
    const navigate = useNavigate();

    return (
        <Box
            className="favorites-page"
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
                Your Favorites
            </Typography>
            {favorites.length === 0 ? (
                <Typography variant="h5" align="center" sx={{ color: "#fff" }}>
                    You have no favorites yet.
                </Typography>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {favorites.map((restaurant, idx) => (
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            md={6}
                            lg={4}
                            key={restaurant.id}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{
                                    scale: 1.04,
                                    boxShadow:
                                        "0 8px 32px rgba(255,111,97,0.25)",
                                }}
                            >
                                <Card
                                    className="favorite-card"
                                    sx={{
                                        borderRadius: 4,
                                        boxShadow:
                                            "0 4px 24px rgba(0,0,0,0.12)",
                                        background: "rgba(255,255,255,0.95)",
                                        backdropFilter: "blur(2px)",
                                        transition: "box-shadow 0.3s",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/restaurants/${restaurant.id}`
                                        )
                                    }
                                >
                                    <img
                                        src={
                                            restaurant.imageUrl ||
                                            "https://via.placeholder.com/300x200"
                                        }
                                        alt={restaurant.name}
                                        className="favorite-image"
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "12px",
                                        }}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "#ff6f61",
                                                mb: 2,
                                            }}
                                        >
                                            {restaurant.name}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            {restaurant.description}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            <strong>Cuisine:</strong>{" "}
                                            {restaurant.cuisineType}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#333", mb: 1 }}
                                        >
                                            <strong>Terminal:</strong>{" "}
                                            {restaurant.terminal} |{" "}
                                            <strong>Gate:</strong>{" "}
                                            {restaurant.gate}
                                        </Typography>
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

export default FavoritesPage;
