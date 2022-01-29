const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  removeImage,
  getAllProductsAdmin,
} = require("../controllers/products.js");

router.post("/", addProduct);

router.put("/", updateProduct);

router.get("/admin", getAllProductsAdmin);

router.get("/", getAllProducts);

router.delete("/image/:id", removeImage);

module.exports = router;
