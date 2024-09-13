import { db } from "../../database/database.js";

export default async function listRental(req, res) {
  try {
    const rentalsList = await db.query(`
      SELECT 
        rentals.*,
        customers.id AS "customerId", customers.name AS "customerName",
        games.id AS "gameId", games.name AS "gameName"
      FROM rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
    `);

    const formattedRentals = rentalsList.rows.map((rental) => ({
      id: rental.id,
      customerId: rental.customerId,
      gameId: rental.gameId,
      rentDate: rental.rentDate,
      daysRented: rental.daysRented,
      returnDate: rental.returnDate,
      originalPrice: rental.originalPrice,
      delayFee: rental.delayFee,
      customer: {
        id: rental.customerId,
        name: rental.customerName,
      },
      game: {
        id: rental.gameId,
        name: rental.gameName,
      },
    }));

    return res.status(200).send(formattedRentals);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
