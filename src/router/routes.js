import { Router } from "express";
import createGame from "../controllers/games/create_game.js";
import listGames from "../controllers/games/list_games.js";
import createCustomer from "../controllers/customers/create_customer.js";
import listCustomer from "../controllers/customers/list_customer.js";
import listCustomerId from "../controllers/customers/list_id_customer.js";
import createRentals from "../controllers/rentals/create_rentals.js";
import listRental from "../controllers/rentals/list_rentals.js";
import finishRentals from "../controllers/rentals/finish_rentals.js";
import deleteRental from "../controllers/rentals/delete_rentals.js";
import { validate } from "../middlewares/validate_middleware.js";
import { createGameSchema } from "../schemas/games_schema.js";
import { rentalSchema } from "../schemas/rentals_schema.js";
import { createCustomerSchema } from "../schemas/customer_schema.js";

const routes = Router();

routes.post("/games", validate(createGameSchema), createGame);
routes.get("/games", listGames);

routes.post("/rentals", validate(rentalSchema), createRentals);
routes.get("/rentals", listRental);
routes.post("/rentals/:id/return", finishRentals);
routes.delete("/rentals/:id", deleteRental);

routes.post("/customers", validate(createCustomerSchema), createCustomer);
routes.get("/customers", listCustomer);
routes.get("/customers/:id", listCustomerId);

export default routes;
