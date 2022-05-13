require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

var path = require("path");
global.appRoot = path.resolve(__dirname);

const products = require("./routes/products");
const categories = require("./routes/categories");
const suppliers = require("./routes/suppliers");
const users = require("./routes/users");
const customers = require("./routes/customers");
const sales = require("./routes/sales");

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("Could not Connect to mongoDB", err);
  });

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/product", products);
app.use("/api/category", categories);
app.use("/api/supplier", suppliers);
app.use("/api/user", users);
app.use("/api/customer", customers);
app.use("/api/order", sales);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
