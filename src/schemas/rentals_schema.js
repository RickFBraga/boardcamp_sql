import Joi from 'joi';

export const rentalSchema = Joi.object({
  customerId: Joi.number().required(),
  gameId: Joi.number().required(),
  daysRented: Joi.number().integer().min(1).required(), 
  rentDate: Joi.date().optional(),
  originalPrice: Joi.number().optional(),
  returnDate: Joi.date().optional().allow(null),
  delayFee: Joi.number().optional().allow(null)
});
