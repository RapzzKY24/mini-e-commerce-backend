const { postUsersPayloadSchema, putUserPayloadSchema } = require("./schema");
const InvariantError = require("../../execptions/InvariantError");

const ValidatorUsers = {
  validatePostPayloadSchema: (payload) => {
    const result = postUsersPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validatePutPayloadSchema: (payload) => {
    const result = putUserPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ValidatorUsers;
