import { db } from "../../database/database.js";
import { createCustomerSchema } from "../../schemas/customer_schema.js";

export default async function createCustomer(req, res) {
  const { name, phone, cpf } = req.body;
  const costumerData = { name, phone, cpf };

  const validation = createCustomerSchema.validate(costumerData, {
    abortEarly: false,
  });

  if (validation.error) {
    return res.status(400).send("BAD REQUEST");
  }

  try {
    const existingCpf = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [
      cpf,
    ]);
    if (existingCpf.rowCount > 0) {
      return res.status(409).send("CONFLICT");
    }
    await db.query(
      `INSERT INTO customers (name, phone, cpf) VALUES ($1, $2, $3)`,
      [name, phone, cpf]
    );
    res.status(201).send("Created");
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
