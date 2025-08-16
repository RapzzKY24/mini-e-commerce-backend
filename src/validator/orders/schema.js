const Joi = require("joi");

const postOrderItemsSchema = Joi.object({
  userId: Joi.string().required(),
  shippingAddress: Joi.string().required(),
});

const putOrderItemSchema = Joi.object({
  status: Joi.string().required(),
});

module.exports = { postOrderItemsSchema, putOrderItemSchema };
