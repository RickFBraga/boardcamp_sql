import express from "express";
import dotenv from "dotenv";
import routes from "./router/routes.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use(routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
