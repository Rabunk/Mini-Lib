import express from "express";
import { getDashboardSummary } from "../controllers/dashboard.controller.js";
import { authentication, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/summary', getDashboardSummary);

export default router;
