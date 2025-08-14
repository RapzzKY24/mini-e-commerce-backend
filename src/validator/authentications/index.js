const InvariantError = require("../../execptions/InvariantError");
const {
  postAuthenticationsPayloadSchema,
  putAuthenticationsPayloadSchema,
  deleteAuthenticationsPayloadSchema,
} = require("./schema");

const ValidatorAuthentications = {
  validatePostAuthenticationPayloadSchema: (payload) => {
    const result = postAuthenticationsPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validatePutAuthenticationPayloadSchema: (payload) => {
    const result = putAuthenticationsPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateDeleteAuthenticationPayloadSchema: (payload) => {
    const result = deleteAuthenticationsPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ValidatorAuthentications;
