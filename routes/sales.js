const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrdersCount,
  getOrders,
  updateOrder,
} = require("../controllers/sales");

router.post("/", placeOrder);

router.get("/count", getOrdersCount);

router.get("/", getOrders);

router.put("/:id", updateOrder);

module.exports = router;
