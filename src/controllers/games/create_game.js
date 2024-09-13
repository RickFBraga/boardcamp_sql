import { db } from "../../database/database.js";
import { createGameSchema } from "../../schemas/games_schema.js";

export default async function createGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  const gameData = { name, image, stockTotal, pricePerDay };

  const validation = createGameSchema.validate(gameData, {
    abortEarly: false,
  });

  if (validation.error) {
    return res.status(400).send("BAD REQUEST");
  }

  try {
    const existingGame = await db.query(`SELECT * FROM games WHERE name = $1`, [
      name,
    ]);
    if (existingGame.rowCount > 0) {
      return res.status(409).send("CONFLICT");
    }
    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,
      [name, image, stockTotal, pricePerDay]
    );
    res.status(201).send("Created");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
