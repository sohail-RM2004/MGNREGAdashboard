import express from "express";
import { getDistrictsByState } from "../controllers/districtController.js";
const router = express.Router();
router.get("/:stateCode", getDistrictsByState);
export default router;
