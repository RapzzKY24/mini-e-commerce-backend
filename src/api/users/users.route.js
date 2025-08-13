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
  },
  {
    method: "GET",
    path: "/users/{name}",
    handler: handler.getUserByNameHandler,
  },
  {
    method: "PUT",
    path: "/users/{id}",
    handler: handler.putUserByIdHandler,
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: handler.deleteUserByIdHandler,
  },
];

module.exports = routes;
