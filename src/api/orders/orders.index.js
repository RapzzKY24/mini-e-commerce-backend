const OrdersHandler = require("./orders.handler");
const routes = require("./orders.routes");

module.exports = {
  name: "orders",
  version: "1.0.0",
  register: async (server, { ordersService, cartsService, validator }) => {
    const orderHandler = new OrdersHandler(
      ordersService,
      cartsService,
      validator
    );

    server.route(routes(orderHandler));
  },
};
