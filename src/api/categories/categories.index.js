const CategoriesHandler = require("./categories.handler");
const routes = require("./categories.routes");

module.exports = {
  name: "categories",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const categoriesHandler = new CategoriesHandler(service, validator);
    server.route(routes(categoriesHandler));
  },
};
