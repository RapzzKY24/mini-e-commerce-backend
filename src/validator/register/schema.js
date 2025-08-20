const Joi = require("joi");

const registerPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required().min(8),
});

module.exports = registerPayloadSchema;
