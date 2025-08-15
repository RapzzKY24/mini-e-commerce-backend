class CartsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCartHandler = this.postCartHandler.bind(this);
    this.getCartByIdHandler = this.getCartByIdHandler.bind(this);
    this.getCartsByUserIdHandler = this.getCartsByUserIdHandler.bind(this);
    this.deleteCartByIdHandler = this.deleteCartByIdHandler.bind(this);
  }

  async postCartHandler(req, h) {
    await this._validator.validateCartsPayloadSchema(req.payload);

    const { user_id } = req.payload;

    const cartId = await this._service.addCart(user_id);

    const response = h.response({
      status: "success",
      message: "Berhasil membuat keranjang",
      data: {
        cartId,
      },
    });
    response.code(201);
    return response;
  }

  async getCartByIdHandler(req) {
    const { id } = req.params;

    const cart = await this._service.getCartById(id);

    return {
      status: "success",
      message: "berhasil mendapatkan keranjang",
      data: {
        cart,
      },
    };
  }

  async getCartsByUserIdHandler(req) {
    const { user_id } = req.params;

    const userCart = await this._service.getCartsByUserId(user_id);

    return {
      status: "success",
      message: "Berhasil mendapatkan data keranjang pengguna",
      data: {
        userCart,
      },
    };
  }

  async deleteCartByIdHandler(req) {
    const { id } = req.params;

    await this._service.deleteCartById(id);

    return {
      status: "success",
      message: "Berhasil menghapus keranjang",
    };
  }
}

module.exports = CartsHandler;
