const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

class UsersService {
  constructor() {
    this._pool = new Pool();
    this.SALT_ROUND = 10;
  }

  async addUser({ name, email, password, role = "customer" }) {
    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    await this.verifyName(name);

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);

    const query = {
      text: "INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [id, name, email, hashedPassword, role, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Pengguna gagal ditambahkan");
    }
  }

  async getUsers() {
    const result = await this._pool.query("SELECT name,email,role FROM users");

    if (!result.rowCount) {
      throw new NotFoundError("Data pengguna tidak tersedia");
    }

    return result.rows;
  }

  async getUserById(id) {
    const query = {
      text: "SELECT name,email,role FROM users WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Id pengguna tidak tersedia");
    }
    return result.rows[0];
  }

  async updateUserById(id, { name, email, password, role }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE users SET name = $1 , email = $2 , password : $3 , role : $4, updated_at=$5 WHERE id = $6 RETURNING id",
      values: [name, email, password, role, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Id pengguna tidak tersedia");
    }
  }

  async deleteUserById(id) {
    const query = {
      text: "DELETE FROM users WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Id pengguna tidak tersedia");
    }
  }

  async verifyName(name) {
    const queryCheckName = {
      text: "SELECT name FROM users WHERE id = $1",
      values: [name],
    };

    const result = await this._pool.query(queryCheckName);

    if (result.rowCount > 0) {
      throw new InvariantError("Nama pengguna sudah tersedia");
    }
  }
}

module.exports = UsersService;
