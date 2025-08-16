const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");

class OrdersService {
  constructor(cartsService) {
    this._pool = new Pool();
    this._cartsService = cartsService;
  }

  async createOrders({ userId, shippingAddress }) {
    const id = `orders-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const status = "PENDING";

    const cartDetails = await this._cartsService.getCartDetailsByUserId(userId);

    if (!cartDetails || !cartDetails.items || cartDetails.items.length === 0) {
      throw new InvariantError("Keranjang belanja kosong");
    }

    const totalAmount = cartDetails.items.reduce(
      (sum, item) => sum + parseFloat(item.total_price),
      0
    );
    const query = {
      text: "INSERT INTO orders VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [
        id,
        userId,
        totalAmount,
        status,
        shippingAddress,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Gagal membuat order");
    }

    const orderId = result.rows[0].id;

    await this._addOrderItems(orderId, cartDetails.items);

    await this._cartsService.deleteCartById(cartDetails.id);

    return orderId;
  }

  async _addOrderItems(orderId, items) {
    for (const item of items) {
      const orderItemId = `orderitem-${nanoid(16)}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const query = {
        text: `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        values: [
          orderItemId,
          orderId,
          item.product_id,
          item.name,
          item.quantity,
          item.price,
          createdAt,
          updatedAt,
        ],
      };

      await this._pool.query(query);
    }
  }

  async getOrderDetails(orderId) {
    const orderQuery = {
      text: "SELECT id, total_amount, status, shipping_address FROM orders WHERE id = $1",
      values: [orderId],
    };

    const orderResult = await this._pool.query(orderQuery);

    if (orderResult.rows.length === 0) {
      throw new InvariantError("Pesanan tidak ditemukan");
    }

    const orderDetails = orderResult.rows[0];

    const orderItemsQuery = {
      text: "SELECT product_name, quantity, price FROM order_items WHERE order_id = $1",
      values: [orderId],
    };

    const itemsResult = await this._pool.query(orderItemsQuery);
    const orderItems = itemsResult.rows;

    const fullOrderDetails = {
      ...orderDetails,
      items: orderItems,
    };

    return fullOrderDetails;
  }

  async updateStatusOrders(orderId, newStatus) {
    const validStatuses = [
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new InvariantError("Status pesanan tidak valid.");
    }
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE orders SET status = $1 , updated_at = $2 WHERE id = $3 RETURNING id",
      values: [newStatus, updatedAt, orderId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        "Gagal memperbarui status pesanan , id tidak ditemukan"
      );
    }
    return result.rows[0].id;
  }
}

module.exports = OrdersService;
