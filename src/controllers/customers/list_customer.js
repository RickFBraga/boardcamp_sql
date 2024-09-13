import { db } from "../../database/database.js";

export default async function listCustomer(req, res) {
  try {
    const list_customer = await db.query(`SELECT * FROM customers`);
    return res.status(200).send(list_customer.rows);
  } catch (err) {
    return res.send(err.message);
  }
}
