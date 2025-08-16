const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");

class CartsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCart(userId) {
    const existCart = await this.checkCart(userId);

    if (existCart) {
      throw new InvariantError("Keranjang sudah ada untuk pengguna ini");
    }

    const id = `carts-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO carts VALUES ($1,$2,$3,$4) RETURNING id",
      values: [id, userId, createdAt, updatedAt],
    };

    const results = await this._pool.query(query);

    if (!results.rowCount) {
      throw new InvariantError("keranjang gagal dibuat");
    }

    return results.rows[0].id;
  }

  async checkCart(userId) {
    const query = {
      text: "SELECT id FROM carts WHERE user_id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async addProductsToCart({ productId, cartId, quantity }) {
    const existingProduct = await this.checkProductOnCart(productId, cartId);

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + quantity;
      const updatedAt = new Date().toISOString();

      const query = {
        text: "UPDATE cart_items SET quantity = $1 , updated_at = $2 WHERE product_id = $3 AND cart_id = $4",
        values: [newQuantity, updatedAt, productId, cartId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError(
          "Gagal memperbarui jumlah produk di keranjang"
        );
      }
    } else {
      const id = `cart-items-${nanoid(16)}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const query = {
        text: "INSERT INTO cart_items VALUES ($1,$2,$3,$4,$5,$6)",
        values: [id, productId, cartId, quantity, createdAt, updatedAt],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError("Gagal menambahkan produk ke keranjang");
      }
    }
  }

  async checkProductOnCart(productId, cartId) {
    const query = {
      text: "SELECT quantity FROM cart_items WHERE product_id = $1 AND cart_id = $2",
      values: [productId, cartId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0 ? result.rows[0] : null;
  }

  async getDetailsCart(cartId) {
    const cart = await this.getCartById(cartId);

    const query = {
      text: `SELECT 
              ci.product_id, 
              ci.quantity, 
              p.name, 
              p.price,
              (ci.quantity * p.price) AS total_price
             FROM cart_items AS ci
             JOIN products AS p ON ci.product_id = p.id
             WHERE ci.cart_id = $1`,
      values: [cartId],
    };

    const result = await this._pool.query(query);

    const cartItems = result.rows;

    const fullCartDetails = {
      ...cart,
      items: cartItems,
    };

    return fullCartDetails;
  }

  async getCartById(id) {
    const query = {
      text: "SELECT c.id, c.user_id, u.name AS user_name FROM carts AS c JOIN users AS u ON c.user_id = u.id WHERE c.id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Keranjang belum ada, buat terlebih dahulu");
    }

    return result.rows[0];
  }

  async getCartByUserId(userId) {
    const query = {
      text: "SELECT * FROM carts WHERE user_id= $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Keranjang belum ada, buat terlebih dahulu");
    }

    return result.rows[0];
  }

  async deleteProductFromCart(cartItemsId) {
    const query = {
      text: "DELETE FROM cart_items WHERE id = $1",
      values: [cartItemsId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError(
        "Produk gagal dihapus dari keranjang. ID tidak ditemukan."
      );
    }
  }

  async deleteCartById(id) {
    const query = {
      text: "DELETE FROM carts WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Keranjang gagal dihapus");
    }
  }
}

module.exports = CartsService;
