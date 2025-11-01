import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stateRoutes from "./routes/stateRoutes.js";
import districtRoutes from "./routes/districtRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import cronJob from "./utils/cron.js";
import prisma from "./prismaClient.js";

dotenv.config();
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.onrender\.com$/]
    : true,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use("/api/states", stateRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/compare", compareRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to DB");
    // Start cron (sync) only if not explicitly disabled
    cronJob(); 
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
}

start();
