import { Router } from "express";
import { getAllBoardsHandler, getFullBoardHandler, saveBoardHandler, deleteBoardHandler } from "../controllers/boardController.js";

const router = Router();

router.get("/", getAllBoardsHandler);
router.get("/:id", getFullBoardHandler);
router.post("/save", saveBoardHandler);
router.delete("/delete/:id", deleteBoardHandler);

export default router;