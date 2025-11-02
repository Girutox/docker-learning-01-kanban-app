import pool from "../db.js";

export const getAllBoards = async () => {
  const result = await pool.query("SELECT public.get_all_boards() AS boards");
  return result.rows[0].boards;
};

export const getFullBoard = async (id) => {
  const result = await pool.query("SELECT * FROM public.get_full_board($1)", [id]);
  return result.rows;
};

export const saveBoard = async (board) => {
  const result = await pool.query(
    "SELECT public.save_board($1, $2, $3) AS board",
    [
      board.id || null,
      board.name,
      JSON.stringify(board.columns || []),
    ]
  );
  return result.rows[0].board;
};

export const deleteBoard = async (id) => {
  await pool.query("CALL public.delete_board($1)", [id]);
  return { success: true };
};