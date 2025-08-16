const InvariantError = require("../../execptions/InvariantError");
const { postOrderItemsSchema, putOrderItemSchema } = require("./schema");

const OrdersValidator = {
  validatePostOrderItemSchema: (payload) => {
    const result = postOrderItemsSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },

  validatePutOrderSchema: (payload) => {
    const result = putOrderItemSchema.validate(payload);

    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = OrdersValidator;
