import { getAllBoards, getFullBoard, saveBoard, deleteBoard } from "../models/boardModel.js";

export const getAllBoardsHandler = async (req, res) => {
  try {
    const boards = await getAllBoards();
    res.json(boards);
  } catch (err) {
    console.error("Error fetching boards:", err.message);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};

export const getFullBoardHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const boards = await getFullBoard(id);
    res.json(boards);
  } catch (err) {
    console.error("Error fetching boards:", err.message);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};

export const saveBoardHandler = async (req, res) => {
  try {
    const board = await saveBoard(req.body);
    res.json(board);
  } catch (err) {
    console.error("Error saving board:", err);
    res.status(500).json({ error: "Failed to save board" });
  }
};

export const deleteBoardHandler = async (req, res) => {
  try {
    await deleteBoard(req.params.id);
    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error("Error deleting board:", err);
    res.status(500).json({ error: "Failed to delete board" });
  }
};

