import { db } from "../../database/database.js";
import { rentalSchema } from "../../schemas/rentals_schema.js";
import dayjs from "dayjs";

export default async function createRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  if (!customerId || !gameId || daysRented <= 0) {
    return res.status(400).send("BAD REQUEST: Invalid input data.");
  }

  const rentDate = dayjs().format("YYYY-MM-DD");

  try {
    const customerResult = await db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [customerId]
    );
    if (customerResult.rows.length === 0) {
      return res.status(404).send("Customer not found");
    }

    const gameResult = await db.query(`SELECT * FROM games WHERE id = $1`, [
      gameId,
    ]);
    if (gameResult.rows.length === 0) {
      return res.status(404).send("Game not found");
    }

    const game = gameResult.rows[0];

    const rentalCountResult = await db.query(
      `SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`,
      [gameId]
    );

    const rentalsInProgress = rentalCountResult.rows[0].count;

    if (rentalsInProgress >= game.stockTotal) {
      return res.status(422).send("No stock available for this game");
    }

    const originalPrice = game.pricePerDay * daysRented;

    const rentalData = {
      customerId,
      gameId,
      rentDate,
      daysRented,
      originalPrice,
      returnDate: null,
      delayFee: null,
    };

    const validation = rentalSchema.validate(rentalData, { abortEarly: false });
    if (validation.error) {
      return res
        .status(400)
        .send(validation.error.details.map((detail) => detail.message));
    }

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee") 
      VALUES ($1, $2, $3, $4, $5, NULL, NULL)`,
      [customerId, gameId, rentDate, daysRented, originalPrice]
    );

    return res.status(201).send("Created");
  } catch (err) {
    console.error(err);
    return res.status(500).send("INTERNAL SERVER ERROR: " + err.message);
  }
}
