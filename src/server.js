require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

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

//users
const UsersService = require("./services/users/users.service");
const UsersValidator = require("./validator/users");
const users = require("./api/users/users.index");

//authentication
const AuthenticationsService = require("./services/authentications/authentications.service");
const AuthenticationsValidator = require("./validator/authentications");
const authentication = require("./api/authentications/authentications.index");
const TokenManager = require("./tokenize/TokenManager");

//carts
const CartsService = require("./services/carts/carts.service");
const CartsValidator = require("./validator/carts");
const carts = require("./api/carts/carts.index");

const init = async () => {
  //services
  const authenticationsService = new AuthenticationsService();
  const categoriesService = new CategoriesService();
  const productsService = new ProductsService();
  const usersService = new UsersService();
  const cartsService = new CartsService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy("miniEcommerce_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: carts,
      options: {
        service: cartsService,
        validator: CartsValidator,
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
