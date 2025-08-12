const InvariantError = require("../../execptions/InvariantError");
const productsPayloadSchema = require("./schema");

const ProductsValidator = {
  validateProductsPayloadSchema: (payload) => {
    const result = productsPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = ProductsValidator;
