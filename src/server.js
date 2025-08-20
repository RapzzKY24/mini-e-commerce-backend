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

//register
const RegisterService = require("./services/register/register.service");
const RegisterValidator = require("./validator/register");
const register = require("./api/register/register.index");

//carts
const CartsService = require("./services/carts/carts.service");
const CartsValidator = require("./validator/carts");
const carts = require("./api/carts/carts.index");

//orders
const OrdersService = require("./services/orders/orders.service");
const OrdersValidator = require("./validator/orders");
const orders = require("./api/orders/orders.index");

//dashboard
const DashboardService = require("./services/dashboard/dashboard.service");
const dashboard = require("./api/dashboard/dashboard.index");

const init = async () => {
  //instance
  const authenticationsService = new AuthenticationsService();
  const categoriesService = new CategoriesService();
  const productsService = new ProductsService();
  const usersService = new UsersService();
  const registerService = new RegisterService(usersService);
  const cartsService = new CartsService(productsService);
  const ordersService = new OrdersService(cartsService, productsService);
  const dashboardService = new DashboardService();

  const server = Hapi.server({
    host: process.env.HOST || 3001,
    port: process.env.PORT || "0.0.0.0",
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
        role: artifacts.decoded.payload.role,
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
      plugin: register,
      options: {
        registerService,
        validator: RegisterValidator,
      },
    },
    {
      plugin: carts,
      options: {
        service: cartsService,
        validator: CartsValidator,
      },
    },
    {
      plugin: orders,
      options: {
        ordersService,
        cartsService,
        validator: OrdersValidator,
      },
    },
    {
      plugin: dashboard,
      options: {
        service: dashboardService,
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
