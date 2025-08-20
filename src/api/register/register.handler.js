class RegisterHandler {
  constructor(registerService, validator) {
    this._regsiterService = registerService;
    this._validator = validator;

    this.registerNewUserHandler = this.registerNewUserHandler.bind(this);
  }

  async registerNewUserHandler(req, h) {
    try {
      await this._validator.validateRegisterPayloadSchema(req.payload);

      const { email, name, password } = req.payload;

      const userId = await this._regsiterService.register({
        email,
        name,
        password,
      });

      const response = h.response({
        status: "success",
        message: "Akun berhasil dibuat",
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}

module.exports = RegisterHandler;
