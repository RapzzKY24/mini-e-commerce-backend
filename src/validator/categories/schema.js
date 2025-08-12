const Joi = require("joi");

const categoriesPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = categoriesPayloadSchema;
