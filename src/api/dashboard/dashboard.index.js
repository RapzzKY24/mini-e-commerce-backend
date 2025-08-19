const DashboardHandler = require("./dashboard.handler");
const routes = require("./dashboard.routes");

module.exports = {
  name: "dashboard",
  version: "1.0.0",
  register: async (server, { service }) => {
    const dashboardHandler = new DashboardHandler(service);

    server.route(routes(dashboardHandler));
  },
};
