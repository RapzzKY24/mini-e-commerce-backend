const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
    handler: handler.postUserHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getUsersHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/users/{name}",
    handler: handler.getUserByNameHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "PUT",
    path: "/users/{id}",
    handler: handler.putUserByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
];

module.exports = routes;
