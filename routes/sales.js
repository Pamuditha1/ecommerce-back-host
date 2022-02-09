const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrdersCount,
  getOrders,
  updateOrder,
} = require("../controllers/sales");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post(
  "/",
  auth,
  (req, res, next) => role(req, res, next, ["Customer"]),
  placeOrder
);

router.get(
  "/count",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  getOrdersCount
);

router.get(
  "/",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  getOrders
);

router.put(
  "/:id",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  updateOrder
);

module.exports = router;
