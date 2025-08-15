const routes = (handler) => [
  {
    method: "POST",
    path: "/carts",
    handler: handler.postCartHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "POST",
    path: "/cart-items",
    handler: handler.postCartItemsHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/carts/{id}",
    handler: handler.getCartDetailsHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/users/{user_id}/carts",
    handler: handler.getCartByUserIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/carts/{id}",
    handler: handler.deleteCartByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/cart-items/{id}",
    handler: handler.deleteProductFromCartHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
];

module.exports = routes;
