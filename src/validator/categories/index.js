const InvariantError = require("../../execptions/InvariantError");
const categoriesPayloadSchema = require("./schema");

const CategoriesValidator = {
  validateCategoriesPayloadSchema: (payload) => {
    const result = categoriesPayloadSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = CategoriesValidator;
