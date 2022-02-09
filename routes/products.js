const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  removeImage,
  getSales,
  getInventory,
  getNewProNo,
  updateDiscount,
  getProduct,
  getDiscountedProducts,
  getMostPopularProducts,
} = require("../controllers/products.js");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/pro-no", getNewProNo);

router.post(
  "/",
  auth,
  (req, res, next) => role(req, res, next, ["Admin"]),
  addProduct
);

router.put(
  "/discount",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  updateDiscount
);

router.put(
  "/",
  auth,
  (req, res, next) => role(req, res, next, ["Admin"]),
  updateProduct
);

router.get(
  "/sales",
  auth,
  (req, res, next) => role(req, res, next, ["Admin"]),
  getSales
);

router.get(
  "/inventory",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  getInventory
);

router.get("/discounted", getDiscountedProducts);

router.get("/popular", getMostPopularProducts);

router.get("/:id", getProduct);

router.get("/", getAllProducts);

router.delete(
  "/image/:id",
  auth,
  (req, res, next) => role(req, res, next, ["Admin"]),
  removeImage
);

module.exports = router;
