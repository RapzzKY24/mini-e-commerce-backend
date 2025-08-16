class OrdersHandler {
  constructor(ordersService, cartsService, validator) {
    this._ordersService = ordersService;
    this._cartsService = cartsService;
    this._validator = validator;

    this.postOrderItemsHandler = this.postOrderItemsHandler.bind(this);
    this.getOrderItemDetailsHandler =
      this.getOrderItemDetailsHandler.bind(this);
    this.putOrderStatusHandler = this.putOrderStatusHandler.bind(this);
  }

  async postOrderItemsHandler(req, h) {
    await this._validator.validatePostOrderItemSchema(req.payload);

    const { userId, shippingAddress } = req.payload;

    const orderId = await this._ordersService.createOrders({
      userId,
      shippingAddress,
    });

    const response = h.response({
      status: "success",
      message: "berhasil menambahkan produk ke order",
      data: {
        orderId,
      },
    });
    response.code(201);
    return response;
  }

  async getOrderItemDetailsHandler(req) {
    const { id } = req.params;

    const dataOrder = await this._ordersService.getOrderDetails(id);

    return {
      status: "success",
      message: "Menampilkan detail pesanan",
      data: {
        dataOrder,
      },
    };
  }

  async putOrderStatusHandler(req) {
    const { id } = req.params;
    await this._validator.validatePutOrderSchema(req.payload);
    const { status } = req.payload;

    const orderId = await this._ordersService.updateStatusOrders(id, status);

    return {
      status: "success",
      message: "berhasil memperbarui pesanan",
      data: {
        orderId,
      },
    };
  }
}

module.exports = OrdersHandler;
