const Joi = require("joi");

const postAuthenticationsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required().min(8),
});

const putAuthenticationsPayloadSchema = Joi.object({
  refreshToken: Joi.string().required,
});

const deleteAuthenticationsPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  postAuthenticationsPayloadSchema,
  putAuthenticationsPayloadSchema,
  deleteAuthenticationsPayloadSchema,
};
