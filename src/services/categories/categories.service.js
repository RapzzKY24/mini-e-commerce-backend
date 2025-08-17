const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");

class CategoriesService {
  constructor() {
    this._pool = new Pool();
  }

  async addCategory({ name, description }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    //check existing name
    await this.checkName(name);

    const query = {
      text: "INSERT INTO categories VALUES($1,$2,$3,$4,$5) RETURNING id",
      values: [id, name, description, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Gagal menambahkan kategori");
    }

    return result.rows[0].id;
  }

  async checkName(name) {
    const query = {
      text: "SELECT name FROM categories WHERE name = $1",
      values: [name],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError("Nama kategori sudah tersedia");
    }
  }

  async getCategories() {
    const results = await this._pool.query("SELECT * FROM categories");

    if (!results.rowCount) {
      throw new NotFoundError("Kategori belum tersedia");
    }

    return results.rows;
  }

  async getCategoryByName(name) {
    const query = {
      text: "SELECT * FROM categories WHERE name  ILIKE $1",
      values: [`%${name}%`],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Kategori tidak ditemukan");
    }

    return result.rows[0];
  }

  async getCategoryById(id) {
    const query = {
      text: "SELECT * FROM categories WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Kategori tidak ditemukan");
    }

    return result.rows[0];
  }

  async editCategory(id, { name, description }) {
    const query = {
      text: "UPDATE categories SET name = $1 , description = $2 WHERE id = $3 RETURNING id",
      values: [name, description, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Id kategori tidak ditemukan");
    }
  }

  async deleteCategory(id) {
    const query = {
      text: "DELETE FROM categories WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Id kategori tidak ditemukan");
    }
  }
}

module.exports = CategoriesService;
