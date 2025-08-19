const routes = (handler) => [
  {
    method: "GET",
    path: "/dashboard/data",
    handler: handler.getDashboardDataHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/dashboard/products-sold",
    handler: handler.getProductsSoldHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/dashboard/total-profit",
    handler: handler.getTotalProfitHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/dashboard/daily-sales",
    handler: handler.getDailySalesHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/dashboard/revenue-by-product",
    handler: handler.getRevenueByProductHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
  {
    method: "GET",
    path: "/dashboard/summary",
    handler: handler.getDashboardSummaryHandler,
    options: {
      auth: "miniEcommerce_jwt",
      pre: [{ method: handler.checkAdminRole, assign: "checkAdmin" }],
    },
  },
];

module.exports = routes;
