const Joi = require("joi");

const postUsersPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
  role: Joi.string().valid("customer", "admin").default("customer"),
});

const putUserPayloadSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  role: Joi.string().valid("customer", "admin"),
});

module.exports = {
  postUsersPayloadSchema,
  putUserPayloadSchema,
};
