const express = require("express");
const router = express.Router();
const { addSupplier, getSuppliers } = require("../controllers/suppliers");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post(
  "/",
  auth,
  (req, res, next) => role(req, res, next, ["Admin", "Employee"]),
  addSupplier
);

router.get("/", getSuppliers);

module.exports = router;
