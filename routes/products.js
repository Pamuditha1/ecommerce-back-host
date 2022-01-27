const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts } = require("../controllers/products.js");

router.post("/", addProduct);

router.get("/", getAllProducts);

module.exports = router;
