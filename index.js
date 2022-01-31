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
const customers = require("./routes/customers");
const sales = require("./routes/sales");

const viewAllProducts = require("./routes/getAllProductsRoute");
const viewAllProductsAdmin = require("./routes/getAllProductsAdmin");

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
app.use("/api/customer", customers);
app.use("/api/order", sales);

app.use("/ninetees/api/user/products/", viewAllProducts);
app.use("/ninetees/api/admin/products/", viewAllProductsAdmin);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
