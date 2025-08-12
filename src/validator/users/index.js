const usersPayloadSchema = require("./schema");
const InvariantError = require("../../execptions/InvariantError");

const ValidatorUsers = {
  validateUsersPayloadSchema: (payload) => {
    const result = usersPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ValidatorUsers;
