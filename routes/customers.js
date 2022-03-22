const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  login,
  getAllCustomers,
  getCustomer,
} = require("../controllers/customers");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post("/", registerCustomer);

router.post("/login", login);

router.get(
  "/all",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  getAllCustomers
);

router.get("/:id", auth, getCustomer);

module.exports = router;
