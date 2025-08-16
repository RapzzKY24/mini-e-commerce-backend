const routes = (handler) => [
  {
    method: "POST",
    path: "/orders",
    handler: handler.postOrderItemsHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/orders/{id}",
    handler: handler.getOrderItemDetailsHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "PUT",
    path: "/orders/{id}",
    handler: handler.putOrderStatusHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
];

module.exports = routes;
