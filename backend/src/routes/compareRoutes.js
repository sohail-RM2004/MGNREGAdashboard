import express from "express";
import { compareDistricts } from "../controllers/compareController.js";
const router = express.Router();
router.get("/", compareDistricts);
export default router;
