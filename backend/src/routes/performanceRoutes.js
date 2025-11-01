import express from "express";
import {
  getDistrictPerformance,
  getDistrictTrend,
  getDistrictSummary,
  getStateStats
} from "../controllers/performanceController.js";
const router = express.Router();

router.get("/state/:stateCode", getStateStats);
router.get("/:districtCode", getDistrictPerformance);
router.get("/:districtCode/trend", getDistrictTrend);
router.get("/:districtCode/summary", getDistrictSummary);

export default router;
