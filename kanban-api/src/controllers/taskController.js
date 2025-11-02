import { saveTask } from "../models/taskModel.js";

export const saveTaskHandler = async (req, res) => {
  try {
    const task = await saveTask(req.body);
    res.json(task);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Failed to save task" });
  }
};
