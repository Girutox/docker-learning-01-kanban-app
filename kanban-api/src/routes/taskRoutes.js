import express from "express";
import { saveTaskHandler } from "../controllers/taskController.js";

const router = express.Router();

router.post("/save", saveTaskHandler);

export default router;
