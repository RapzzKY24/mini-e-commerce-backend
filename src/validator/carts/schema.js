const Joi = require("joi");

const cartsPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
});

module.exports = cartsPayloadSchema;
