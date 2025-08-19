const AuthorizationError = require("../../execptions/AuthorizationError");
class ProductsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
  }

  async postProductHandler(req, h) {
    await this._validator.validateProductsPayloadSchema(req.payload);

    const { name, description, price, category_id, image_url, stock } =
      req.payload;

    const productId = await this._service.addProduct({
      name,
      description,
      price,
      category_id,
      image_url,
      stock,
    });

    const response = h.response({
      status: "success",
      message: "Berhasil menambahkan produk",
      data: {
        productId,
      },
    });
    response.code(201);
    return response;
  }

  async getProductsHandler(req) {
    const { name } = req.query;

    let products;
    if (name) {
      products = await this._service.getProductByName(name);
    } else {
      products = await this._service.getProducts();
    }

    return {
      status: "success",
      message: "Berhasil mendapatkan seluruh produk",
      data: {
        products,
      },
    };
  }

  async getProductByIdHandler(req) {
    const { id } = req.params;

    const product = await this._service.getProductById(id);

    return {
      status: "success",
      message: `berhasil mendapatkan produk dengan id ${id}`,
      data: {
        product,
      },
    };
  }

  async putProductByIdHandler(req) {
    await this._validator.validateProductsPayloadSchema(req.payload);

    const { id } = req.params;

    await this._service.updateProductById(id, req.payload);

    return {
      status: "success",
      message: "Berhasil update produk",
    };
  }

  async deleteProductByIdHandler(req) {
    const { id } = req.params;

    await this._service.deleteProductById(id);

    return {
      status: "success",
      message: "Berhasil menghapus produk",
    };
  }
}

module.exports = ProductsHandler;
