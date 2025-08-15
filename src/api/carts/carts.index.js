const CartsHandler = require("./carts.handler");
const routes = require("./carts.routes");

module.exports = {
  name: "carts",
  version: "1.0,0",
  register: async (server, { service, validator }) => {
    const cartsHandler = new CartsHandler(service, validator);

    server.route(routes(cartsHandler));
  },
};
