import { Router } from "express";
import boardRoutes from "./boardRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

router.use("/boards", boardRoutes);
router.use("/tasks", taskRoutes);

export default router;