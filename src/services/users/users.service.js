const { Pool } = require("pg");
const InvariantError = require("../../execptions/InvariantError");
const NotFoundError = require("../../execptions/NotFoundError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const AuthenticationError = require("../../execptions/AuthenticationError");

class UsersService {
  constructor() {
    this._pool = new Pool();
    this.SALT_ROUND = 10;
  }

  async _addUserCore({ name, email, password, role }) {
    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    await this.verifyEmail(email);

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);

    const query = {
      text: "INSERT INTO users VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [id, name, email, hashedPassword, role, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Pengguna gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async addUser({ name, email, password, role }) {
    return this._addUserCore({ name, email, password, role });
  }

  async getUsers() {
    const result = await this._pool.query(
      "SELECT id,name,email,role FROM users"
    );

    if (!result.rowCount) {
      throw new NotFoundError("Data pengguna tidak tersedia");
    }

    return result.rows;
  }

  async getUserByName(name) {
    const query = {
      text: "SELECT id, name, email, role FROM users WHERE name ILIKE $1",
      values: [`%${name}%`], //wildcard
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Nama pengguna tidak tersedia");
    }
    return result.rows[0];
  }

  async updateUserById(id, { name, email, password, role = "customer" }) {
    const updatedAt = new Date().toISOString();

    // Hash password kalau ada
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);
    }

    // Cek email conflict (exclude current user)
    if (email) {
      await this.verifyEmailForUpdate(id, email);
    }

    const query = {
      text: "UPDATE users SET name = $1, email = $2, password = $3, role = $4, updated_at = $5 WHERE id = $6 RETURNING id",
      values: [name, email, hashedPassword, role, updatedAt, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Id pengguna tidak tersedia");
    }
  }

  async verifyEmailForUpdate(userId, email) {
    const query = {
      text: "SELECT email FROM users WHERE email = $1 AND id != $2",
      values: [email, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError("Email pengguna sudah tersedia");
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

  async verifyEmail(email) {
    const queryCheckEmail = {
      text: "SELECT email FROM users WHERE email = $1",
      values: [email],
    };

    const result = await this._pool.query(queryCheckEmail);

    if (result.rowCount > 0) {
      throw new InvariantError("Email pengguna sudah tersedia");
    }
  }

  async verifyUserCredential(name, password) {
    const query = {
      text: "SELECT id,password,role FROM users where name = $1",
      values: [name],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError("Kredensial pengguna salah");
    }

    const { id, role, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial pengguna salah");
    }

    return { id, role };
  }
}

module.exports = UsersService;
