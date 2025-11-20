const AuthorizationError = require("../../execptions/AuthorizationError");

class CategoriesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postCategoryHandler = this.postCategoryHandler.bind(this);
    this.getCategoriesHandler = this.getCategoriesHandler.bind(this);
    this.getCategoryByIdHandler = this.getCategoryByIdHandler.bind(this);
    this.putCategoryByIdHandler = this.putCategoryByIdHandler.bind(this);
    this.deleteCategoryByIdHandler = this.deleteCategoryByIdHandler.bind(this);
  }

  async postCategoryHandler(req, h) {
    await this._validator.validateCategoriesPayloadSchema(req.payload);
    const { name, description } = req.payload;

    const categoryId = await this._service.addCategory({ name, description });

    const response = h.response({
      status: "success",
      message: "Kategori berhasil dibuat",
      data: {
        categoryId,
      },
    });
    response.code(201);
    return response;
  }

  async getCategoriesHandler(req) {
    const { name } = req.query;

    let categories;

    if (name) {
      categories = await this._service.getCategoryByName(name);
    } else {
      categories = await this._service.getCategories();
    }

    return {
      status: "success",
      message: "Berhasil mendapatkan seluruh kategori",
      categories,
    };
  }

  async getCategoryByIdHandler(req) {
    const { id } = req.params;
    const category = await this._service.getCategoryById(id);

    return {
      status: "success",
      message: `berhasil mendapatkan categories ${id}`,
      category,
    };
  }

  async putCategoryByIdHandler(req) {
    await this._validator.validateCategoriesPayloadSchema(req.payload);
    const { id } = req.params;

    await this._service.editCategory(id, req.payload);
    return {
      status: "success",
      message: "Berhasil edit kategori",
    };
  }

  async deleteCategoryByIdHandler(req) {
    const { id } = req.params;

    await this._service.deleteCategory(id);

    return {
      status: "success",
      message: "Berhasil menghapus kategori",
    };
  }
}

module.exports = CategoriesHandler;
