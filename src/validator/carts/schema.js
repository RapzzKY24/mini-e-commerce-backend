const Joi = require("joi");

const cartsPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
});

const cartsItemPayloadSchema = Joi.object({
  productId: Joi.string().required(),
  cartId: Joi.string().required(),
  quantity: Joi.number().required(),
});

module.exports = { cartsPayloadSchema, cartsItemPayloadSchema };
