import pool from "../db.js";

export const saveTask = async (task) => {
  const result = await pool.query(
    "SELECT public.save_task($1, $2, $3, $4, $5, $6) AS task",
    [
      task.id || null,
      task.title,
      task.description,
      task.status,
      task.columnId,
      JSON.stringify(task.subtasks || []),
    ]
  );
  return result.rows[0].task;
};
