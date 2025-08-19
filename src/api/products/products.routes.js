const routes = (handler) => [
  {
    method: "POST",
    path: "/products",
    handler: handler.postProductHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/products",
    handler: handler.getProductsHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/products/{id}",
    handler: handler.getProductByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "PUT",
    path: "/products/{id}",
    handler: handler.putProductByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "DELETE",
    path: "/products/{id}",
    handler: handler.deleteProductByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
];

module.exports = routes;
