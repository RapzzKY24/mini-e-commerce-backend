const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../execptions/InvariantError");

class RegisterService {
  constructor(usersService) {
    this.pool = new Pool();
    this._usersService = usersService;
    this.SALT_ROUND = 10;
  }

  async addUser({ name, email, password }) {
    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const role = "customer";

    await this._usersService.verifyEmail(email);

    const hashPassword = await bcrypt.hash(password, this.SALT_ROUND);

    const query = {
      text: "INSERT INTO users VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id",
      values: [id, name, email, hashPassword, role, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal membuat akun");
    }
    return result.rows[0].id;
  }
}

module.exports = RegisterService;
