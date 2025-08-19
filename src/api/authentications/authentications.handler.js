class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, h) {
    await this._validator.validatePostAuthenticationPayloadSchema(req.payload);

    const { name, password } = req.payload;

    const { id, role } = await this._usersService.verifyUserCredential(
      name,
      password
    );

    const refreshToken = await this._tokenManager.generateRefreshToken({
      id,
      role,
    });
    const accessToken = await this._tokenManager.generateAccessToken({
      id,
      role,
    });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: "success",
      message: "token berhasil ditambahkan",
      data: {
        refreshToken,
        accessToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(req) {
    await this._validator.validatePutAuthenticationPayloadSchema(req.payload);

    const { refreshToken } = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);

    const { id, role } = await this._tokenManager.verifyRefreshToken(
      refreshToken
    );

    const accessToken = await this._tokenManager.generateAccessToken({
      id,
      role,
    });

    return {
      status: "success",
      message: "token berhasil diperbarui",
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(req) {
    await this._validator.validateDeleteAuthenticationPayloadSchema(
      req.payload
    );

    const { refreshToken } = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: "success",
      message: "Token berhasil dihapus",
    };
  }
}

module.exports = AuthenticationsHandler;
