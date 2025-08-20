const RegisterHandler = require("./register.handler");
const routes = require("./register.route");

module.exports = {
  name: "register",
  version: "1.0.0",
  register: async (server, { registerService, validator }) => {
    const registerHandler = new RegisterHandler(registerService, validator);

    server.route(routes(registerHandler));
  },
};
