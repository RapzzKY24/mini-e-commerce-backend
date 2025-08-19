const AuthorizationError = require("../../execptions/AuthorizationError");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.getUserByNameHandler = this.getUserByNameHandler.bind(this);
    this.putUserByIdHandler = this.putUserByIdHandler.bind(this);
    this.deleteUserByIdHandler = this.deleteUserByIdHandler.bind(this);
    this.checkAdminRole = this.checkAdminRole.bind(this);
  }

  async checkAdminRole(req, h) {
    const { role } = req.auth.credentials;

    if (role !== "admin") {
      throw new AuthorizationError(
        " Oops! Sepertinya Anda tidak memiliki izin untuk mengakses halaman ini."
      );
    }
    return h.continue;
  }

  async postUserHandler(req, h) {
    await this._validator.validatePostPayloadSchema(req.payload);

    const { name, email, password, role } = req.payload;

    const userId = await this._service.addUser({ name, email, password, role });

    const response = h.response({
      status: "success",
      message: "Pengguna berhasil dibuat",
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUsersHandler() {
    const users = await this._service.getUsers();

    return {
      status: "success",
      message: "berhasil mendapatkan seluruh pengguna",
      data: {
        users,
      },
    };
  }

  async getUserByNameHandler(req) {
    const { name } = req.params;

    const user = await this._service.getUserByName(name);

    return {
      status: "success",
      message: `Berhasil mendapatkan pengguna berdasarkan nama`,
      data: {
        user,
      },
    };
  }

  async putUserByIdHandler(req) {
    await this._validator.validatePutPayloadSchema(req.payload);

    const { id } = req.params;

    await this._service.updateUserById(id, req.payload);

    return {
      status: "success",
      message: "Berhasil mengupdate users",
    };
  }

  async deleteUserByIdHandler(req) {
    const { id } = req.params;

    await this._service.deleteUserById(id);

    return {
      status: "Success",
      message: "Berhasil menghapus users",
    };
  }
}

module.exports = UsersHandler;
