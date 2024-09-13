import { db } from "../../database/database.js";

export default async function listGames(req, res) {
  try {
    const list_games = await db.query(`SELECT * FROM games`);
    return res.status(200).send(list_games.rows);
  } catch (err) {
    return res.send(err.message);
  }
}
