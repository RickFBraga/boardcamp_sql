import { db } from "../../database/database.js";

export default async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if (rental.rowCount === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const rentalData = rental.rows[0];

    if (!rentalData.returnDate) {
      return res.status(400).json({ message: "Rental not returned yet" });
    }

    await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);

    res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
