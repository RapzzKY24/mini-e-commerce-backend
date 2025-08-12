const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct({
    name,
    description,
    price,
    category_id,
    stock = 1,
    image_url = null,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // check duplicate value
    await this.checkName(name);

    const query = {
      text: "INSERT INTO products VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
      values: [
        id,
        name,
        description,
        price,
        category_id,
        stock,
        image_url,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal menambahkan produk");
    }

    return result.rows[0].id;
  }

  async checkName(name) {
    const query = {
      text: "SELECT name FROM products WHERE name = $1",
      values: [name],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError("Nama produk sudah tersedia");
    }
  }

  async getProducts() {
    const results = await this._pool.query("SELECT * FROM products");

    if (!results.rowCount) {
      throw new NotFoundError("Produk belum tersedia");
    }

    return results.rows;
  }

  async getProductById(id) {
    const query = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Id produk tidak tersedia");
    }

    return result.rows[0];
  }

  async updateProductById(
    id,
    { name, description, price, category_id, stock, image_url }
  ) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE products SET name = $1 , description = $2 , price = $3 , category_id = $4 , stock = $5 , image_url = $6 , updated_at = $7 WHERE id = $8 RETURNING id",
      values: [
        name,
        description,
        price,
        category_id,
        stock,
        image_url,
        updatedAt,
        id,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Id produk tidak tersedia");
    }
  }

  async deleteProductById(id) {
    const query = {
      text: "DELETE FROM products WHERE id = $1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Id produk tidak tersedia");
    }
  }
}

module.exports = ProductsService;
