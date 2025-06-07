import "./config/config.js";
import express from "express";
import mongoose from "mongoose";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./modules/auth/authRoutes.js";
import moviesRouter from "./modules/movies/movieRoutes.js";
import reviewsRouter from "./modules/reviews/reviewRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware för att tolka inkommande JSON-data
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

// Försök ansluta till databasen
mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Ansluten till MongoDB"))
  .catch((err) => console.error("❌ Fel vid anslutning till MongoDB:", err));

// Routes för olika delar av API:et
app.use("/auth", authRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);

// Fångar upp förfrågningar till icke-existerande endpoints
app.use((req, res, next) => {
  next(new AppError(`Sidan ${req.originalUrl} hittades inte.`, 404));
}); 

// Global felhantering
app.use(errorHandler);

// Startar servern
app.listen(port, () => console.log(`🚀 Servern är igång på http://localhost:${port}`));
