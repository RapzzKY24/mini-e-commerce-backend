const { Pool } = require("pg");

class DashboardService {
  constructor() {
    this._pool = new Pool();
  }

  async getProductsSold() {
    const query = {
      text: `SELECT
                    oi.product_name,
                    SUM(oi.quantity) as total_sold,
                    COUNT(DISTINCT oi.order_id) as total_orders
                   FROM order_items oi
                   INNER JOIN orders o ON oi.order_id = o.id
                   WHERE o.status = 'DELIVERED'
                   GROUP BY oi.product_name
                   ORDER BY total_sold DESC`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getTotalProfit() {
    const query = {
      text: `SELECT COALESCE(SUM(total_amount), 0) AS total_profit
                   FROM orders
                   WHERE status = 'DELIVERED'`,
    };
    const result = await this._pool.query(query);
    return parseFloat(result.rows[0].total_profit || 0);
  }

  async getDailySales() {
    const query = {
      text: `SELECT
                    SUBSTRING(created_at, 1, 10) as sale_date,
                    SUBSTRING(created_at, 1, 10) as date_formatted,
                    COALESCE(SUM(total_amount), 0) as daily_sales,
                    COUNT(*) as total_orders
                   FROM orders
                   WHERE status = 'DELIVERED'
                   AND SUBSTRING(created_at, 1, 7) = TO_CHAR(NOW(), 'YYYY-MM')
                   GROUP BY SUBSTRING(created_at, 1, 10)
                   ORDER BY sale_date ASC`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getRevenueByProduct() {
    const query = {
      text: `SELECT
                    oi.product_name,
                    oi.product_id,
                    COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue,
                    SUM(oi.quantity) as total_quantity,
                    COUNT(DISTINCT oi.order_id) as total_orders,
                    AVG(oi.price) as avg_price
                   FROM order_items oi
                   INNER JOIN orders o ON oi.order_id = o.id
                   WHERE o.status = 'DELIVERED'
                   GROUP BY oi.product_name, oi.product_id
                   ORDER BY total_revenue DESC
                   LIMIT 10`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getDashboardSummary() {
    const query = {
      text: `SELECT
                    COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as total_delivered_orders,
                    COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_orders,
                    COUNT(CASE WHEN status = 'PROCESSING' THEN 1 END) as processing_orders,
                    COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelled_orders,
                    COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN total_amount END), 0) as total_revenue,
                    COALESCE(AVG(CASE WHEN status = 'DELIVERED' THEN total_amount END), 0) as avg_order_value,
                    COUNT(DISTINCT user_id) as total_customers,
                    COUNT(*) as total_orders
                   FROM orders
                   WHERE created_at >= TO_CHAR(NOW() - INTERVAL '30 days', 'YYYY-MM-DD')`,
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getDashboardData() {
    const [summary, productsSold, dailySales, revenueProduct, totalProfit] =
      await Promise.all([
        this.getDashboardSummary(),
        this.getProductsSold(),
        this.getDailySales(),
        this.getRevenueByProduct(),
        this.getTotalProfit(),
      ]);

    return {
      summary,
      productsSold,
      dailySales,
      revenueProduct,
      totalProfit,
    };
  }

  // Method untuk close connection pool
  async close() {
    await this._pool.end();
  }
}

module.exports = DashboardService;
