const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");

class CartsService {
  constructor(productsService) {
    this._pool = new Pool();
    this._productsService = productsService;
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
    const client = await this._pool.connect();

    try {
      await client.query("BEGIN");

      const product = await this._productsService.getProductById(productId);
      const existingProduct = await this.checkProductOnCart(productId, cartId);

      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        const updatedAt = new Date().toISOString();

        if (newQuantity > product.stock) {
          throw new InvariantError("Jumlah stock barang kurang");
        }

        const query = {
          text: `UPDATE cart_items 
               SET quantity = $1, updated_at = $2 
               WHERE product_id = $3 AND cart_id = $4`,
          values: [newQuantity, updatedAt, productId, cartId],
        };

        const result = await client.query(query);

        if (!result.rowCount) {
          throw new InvariantError(
            "Gagal memperbarui jumlah produk di keranjang"
          );
        }
      } else {
        if (quantity > product.stock) {
          throw new InvariantError("Jumlah produk melebihi stok yang tersedia");
        }

        const id = `cart-items-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
          text: `INSERT INTO cart_items 
               (id, product_id, cart_id, quantity, created_at, updated_at) 
               VALUES ($1,$2,$3,$4,$5,$6)`,
          values: [id, productId, cartId, quantity, createdAt, updatedAt],
        };

        const result = await client.query(query);

        if (!result.rowCount) {
          throw new InvariantError("Gagal menambahkan produk ke keranjang");
        }
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new InvariantError(error.message);
    } finally {
      client.release();
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

  async getCartDetailsByUserId(userId) {
    const queryCart = {
      text: "SELECT id, user_id FROM carts WHERE user_id = $1",
      values: [userId],
    };

    const resultCart = await this._pool.query(queryCart);

    if (!resultCart.rowCount) {
      throw new NotFoundError("Keranjang belum ada untuk pengguna ini");
    }

    const cart = resultCart.rows[0];

    const queryItems = {
      text: `SELECT 
            ci.product_id, 
            ci.quantity, 
            p.name, 
            p.price,
            (ci.quantity * p.price) AS total_price
           FROM cart_items AS ci
           JOIN products AS p ON ci.product_id = p.id
           WHERE ci.cart_id = $1`,
      values: [cart.id],
    };

    const resultItems = await this._pool.query(queryItems);

    const cartItems = resultItems.rows;

    const fullCartDetails = {
      ...cart,
      items: cartItems,
    };

    return fullCartDetails;
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
