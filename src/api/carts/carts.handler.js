class CartsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    //cart
    this.postCartHandler = this.postCartHandler.bind(this);
    this.getCartByUserIdHandler = this.getCartByUserIdHandler.bind(this);
    this.deleteCartByIdHandler = this.deleteCartByIdHandler.bind(this);

    //cart-items
    this.postCartItemsHandler = this.postCartItemsHandler.bind(this);
    this.getCartDetailsHandler = this.getCartDetailsHandler.bind(this);
    this.deleteProductFromCartHandler =
      this.deleteProductFromCartHandler.bind(this);
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

  async postCartItemsHandler(req, h) {
    await this._validator.validateCartItemsPayloadSchema(req.payload);

    const { productId, cartId, quantity } = req.payload;

    await this._service.addProductsToCart({
      productId,
      cartId,
      quantity,
    });

    const response = h.response({
      status: "success",
      message: "Berhasil menambahkan produk ke keranjang",
    });
    response.code(201);
    return response;
  }

  async getCartDetailsHandler(req) {
    const { id } = req.params;

    const cartDetails = await this._service.getDetailsCart(id);

    return {
      status: "success",
      message: "Berhasil mendapatkan detail keranjang",
      data: {
        cartDetails,
      },
    };
  }

  async getCartByUserIdHandler(req) {
    const { user_id } = req.params;

    const userCart = await this._service.getCartByUserId(user_id);

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

  async deleteProductFromCartHandler(req) {
    const { id } = req.params;

    await this._service.deleteProductFromCart(id);

    return {
      status: "success",
      message: "Berhasil menghapus produk dari keranjang",
    };
  }
}

module.exports = CartsHandler;
