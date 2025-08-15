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

  async getCartById(id) {
    const query = {
      text: "SELECT * FROM carts WHERE id= $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Keranjang belum ada, buat terlebih dahulu");
    }

    return result.rows[0];
  }

  async getCartsByUserId(userId) {
    const query = {
      text: "SELECT * FROM carts WHERE user_id= $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Keranjang belum ada, buat terlebih dahulu");
    }

    return result.rows;
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
