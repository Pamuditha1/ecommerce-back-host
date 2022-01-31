const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  login,
  getAllCustomers,
  getCustomer,
} = require("../controllers/customers");

router.post("/", registerCustomer);

router.post("/login", login);

router.get("/all", getAllCustomers);

router.get("/:id", getCustomer);

module.exports = router;
