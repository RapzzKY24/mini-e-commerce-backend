const AuthenticationsHandler = require("./authentications.handler");
const routes = require("./authentications.routes");

module.exports = {
  name: "authentications",
  version: "1.0.0",
  register: async (
    server,
    { authenticationsService, usersService, tokenManager, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
