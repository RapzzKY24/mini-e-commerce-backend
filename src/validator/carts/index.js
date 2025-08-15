const InvariantError = require("../../execptions/InvariantError");
const cartsPayloadSchema = require("./schema");

const CartsValidator = {
  validateCartsPayloadSchema: (payload) => {
    const result = cartsPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = CartsValidator;
