const InvariantError = require("../../execptions/InvariantError");
const { cartsItemPayloadSchema, cartsPayloadSchema } = require("./schema");

const CartsValidator = {
  validateCartsPayloadSchema: (payload) => {
    const result = cartsPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validateCartItemsPayloadSchema: (payload) => {
    const result = cartsItemPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = CartsValidator;
