const routes = (handler) => [
  {
    method: "POST",
    path: "/register",
    handler: handler.registerNewUserHandler,
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
