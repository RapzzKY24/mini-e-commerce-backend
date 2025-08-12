const Joi = require("joi");

const usersPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  role: Joi.string().valid("customer", "admin").default("customer"),
});

module.exports = usersPayloadSchema;
