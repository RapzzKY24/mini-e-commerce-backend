require("dotenv").config();
const Hapi = require("@hapi/hapi");

//execptions
const ClientError = require("./execptions/ClientError");

//categories
const CategoriesService = require("./services/categories/categories.service");
const CategoriesValidator = require("./validator/categories");
const categories = require("./api/categories/categories.index");

//products
const ProductsService = require("./services/products/products.service");
const ProductsValidator = require("./validator/products");
const products = require("./api/products/products.index");

const init = async () => {
  //services
  const categoriesService = new CategoriesService();
  const productsService = new ProductsService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  //register plugin
  await server.register([
    {
      plugin: categories,
      options: {
        service: categoriesService,
        validator: CategoriesValidator,
      },
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`server running in ${server.info.uri}`);
};

init();
