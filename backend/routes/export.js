import express from "express";
import { downloadProject, listFrameworks, exportStatus } from "../controllers/exportController.js";

const router = express.Router();

// POST /api/export - Download project in specified framework
router.post("/", downloadProject);

// GET /api/export/frameworks - List supported frameworks
router.get("/frameworks", listFrameworks);

// GET /api/export/status - Check export system status
router.get("/status", exportStatus);

export default router;
