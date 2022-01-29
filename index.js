const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

var path = require("path");
global.appRoot = path.resolve(__dirname);

const products = require("./routes/products");
const categories = require("./routes/categories");
const suppliers = require("./routes/suppliers");
const users = require("./routes/users");

const viewAllProducts = require("./routes/getAllProductsRoute");
const viewAllProductsAdmin = require("./routes/getAllProductsAdmin");
const registerCustomer = require("./routes/registerCustomer");
const authCustomer = require("./routes/authCustomer");
const getCustomer = require("./routes/getCustomer");
const placeOrder = require("./routes/placeOrder");
const addDiscount = require("./routes/addDiscount");
const getOrders = require("./routes/getOrders");
const getLastProNum = require("./routes/getProductNo");
const loginUser = require("./routes/authUser");
const getCustomers = require("./routes/getCustomers");
const deliverOrder = require("./routes/updateOrderStatus");

const env = require("./envVariables");

mongoose
  .connect(env.mongoDB, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Could not Connect to mongoDB", err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/product", products);
app.use("/api/category", categories);
app.use("/api/supplier", suppliers);
app.use("/api/user", users);

app.use("/ninetees/api/user/products/", viewAllProducts);
app.use("/ninetees/api/admin/products/", viewAllProductsAdmin);
app.use("/ninetees/api/user/register", registerCustomer);
app.use("/ninetees/api/user/auth", authCustomer);
app.use("/ninetees/api/user/get-customer", getCustomer);
app.use("/ninetees/api/user/place-order", placeOrder);

app.use("/ninetees/api/admin/add-discount", addDiscount);
app.use("/ninetees/api/admin/orders", getOrders);
app.use("/ninetees/api/admin/proNo", getLastProNum);
app.use("/ninetees/api/admin/auth", loginUser);
app.use("/ninetees/api/admin/customers", getCustomers);
app.use("/ninetees/api/admin/deliver", deliverOrder);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
