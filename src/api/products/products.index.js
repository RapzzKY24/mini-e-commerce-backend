const ProductsHandler = require("./products.handler");
const routes = require("./products.routes");

module.exports = {
  name: "products",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const productsHandler = new ProductsHandler(service, validator);
    server.route(routes(productsHandler));
  },
};
