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

  async register({ name, email, password }) {
    return this._usersService.addUser({
      name,
      email,
      password,
      role: "customer",
    });
  }
}

module.exports = RegisterService;
