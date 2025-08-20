const registerPayloadSchema = require("./schema");
const InvariantError = require("../../execptions/InvariantError");

const ValidatorRegister = {
  validateRegisterPayloadSchema: (payload) => {
    const result = registerPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ValidatorRegister;
