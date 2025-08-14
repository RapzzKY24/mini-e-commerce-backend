const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getUsersHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/users/{name}",
    handler: handler.getUserByNameHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "PUT",
    path: "/users/{id}",
    handler: handler.putUserByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
];

module.exports = routes;
