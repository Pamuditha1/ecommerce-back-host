const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  removeImage,
  getAllProductsAdmin,
  getSales,
  getInventory,
  getNewProNo,
  updateDiscount,
  getProduct,
  getDiscountedProducts,
  getMostPopularProducts,
} = require("../controllers/products.js");

router.get("/pro-no", getNewProNo);

router.post("/", addProduct);

router.put("/discount", updateDiscount);

router.put("/", updateProduct);

router.get("/sales", getSales);

router.get("/inventory", getInventory);

router.get("/discounted", getDiscountedProducts);

router.get("/popular", getMostPopularProducts);

router.get("/:id", getProduct);

router.get("/", getAllProducts);

router.delete("/image/:id", removeImage);

module.exports = router;
