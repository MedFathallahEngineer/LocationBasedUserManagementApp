import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

// Add dotenv configuration
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes part
app.use("/api/users", userRoutes);

// Add Error Handler
app.use(errorHandler);

// Connect to the database
connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
