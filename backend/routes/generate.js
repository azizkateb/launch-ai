import express from "express";
import { generateLandingPage } from "../controllers/generateController.js";

const router = express.Router();

router.post("/", generateLandingPage);

export default router;