import { db } from "../../database/database.js";
import dayjs from "dayjs";

export default async function returnRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if (rental.rowCount === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const rentalData = rental.rows[0];

    if (rentalData.returnDate) {
      return res.status(422).json({ message: "Rental already returned" });
    }

    const returnDate = dayjs();
    const rentDate = dayjs(rentalData.rentDate);
    const originalDays = rentalData.daysRented;

    const dueDate = rentDate.add(originalDays, "day");
    const daysLate = returnDate.diff(dueDate, "day");

    let delayFee = 0;
    if (daysLate > 0) {
      const game = await db.query(
        `SELECT "pricePerDay" FROM games WHERE id = $1`,
        [rentalData.gameId]
      );
      const pricePerDay = game.rows[0].pricePerDay;
      delayFee = daysLate * pricePerDay;
    }

    await db.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [returnDate.format("YYYY-MM-DD"), delayFee, id]
    );

    res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
