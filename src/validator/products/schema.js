const Joi = require("joi");

const productsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category_id: Joi.string().required(),
  stock: Joi.number().required(),
  image_url: Joi.string(),
});

module.exports = productsPayloadSchema;
