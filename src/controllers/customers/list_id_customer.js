import { db } from "../../database/database.js";

export default async function listCustomerId(req, res) {
  const { id } = req.params;

  try {
    const list_customer = await db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );
    if (list_customer.rows.length === 0) {
      return res.status(404).send("NOT FOUND");
    }
    res.status(200).send(list_customer.rows);
  } catch (err) {
    return res.send(err.message);
  }
}
