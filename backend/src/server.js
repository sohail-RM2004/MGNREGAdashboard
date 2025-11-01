import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import stateRoutes from "./routes/stateRoutes.js";
import districtRoutes from "./routes/districtRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import compareRoutes from "./routes/compareRoutes.js";
import cronJob from "./utils/cron.js";
import prisma from "./prismaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// CORS only needed for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/states", stateRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/compare", compareRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Catch all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

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
