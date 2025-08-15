const routes = (handler) => [
  {
    method: "POST",
    path: "/carts",
    handler: handler.postCartHandler,
  },
  {
    method: "GET",
    path: "/carts/{id}",
    handler: handler.getCartByIdHandler,
  },
  {
    method: "GET",
    path: "/users/{user_id}/carts",
    handler: handler.getCartsByUserIdHandler,
  },
  {
    method: "DELETE",
    path: "/carts/{id}",
    handler: handler.deleteCartByIdHandler,
  },
];

module.exports = routes;
