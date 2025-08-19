const routes = (handler) => [
  {
    method: "GET",
    path: "/dashboard/data",
    handler: handler.getDashboardDataHandler,
  },
  {
    method: "GET",
    path: "/dashboard/products-sold",
    handler: handler.getProductsSoldHandler,
  },
  {
    method: "GET",
    path: "/dashboard/total-profit",
    handler: handler.getTotalProfitHandler,
  },
  {
    method: "GET",
    path: "/dashboard/daily-sales",
    handler: handler.getDailySalesHandler,
  },
  {
    method: "GET",
    path: "/dashboard/revenue-by-product",
    handler: handler.getRevenueByProductHandler,
  },
  {
    method: "GET",
    path: "/dashboard/summary",
    handler: handler.getDashboardSummaryHandler,
  },
];

module.exports = routes;
