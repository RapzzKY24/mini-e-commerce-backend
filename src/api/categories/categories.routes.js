const routes = (handler) => [
  {
    method: "POST",
    path: "/categories",
    handler: handler.postCategoryHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/categories",
    handler: handler.getCategoriesHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "GET",
    path: "/categories/{id}",
    handler: handler.getCategoryByIdHandler,
  },
  {
    method: "PUT",
    path: "/categories/{id}",
    handler: handler.putCategoryByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/categories/{id}",
    handler: handler.deleteCategoryByIdHandler,
    options: {
      auth: "miniEcommerce_jwt",
    },
  },
];

module.exports = routes;
