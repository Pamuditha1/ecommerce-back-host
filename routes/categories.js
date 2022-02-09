const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  updateCategory,
} = require("../controllers/categories");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.post(
  "/",
  auth,
  (req, res, next) => role(req, res, next, ["Admin"]),
  addCategory
);

router.put(
  "/:id",
  auth,
  (req, res, next) => role(req, res, next, ["Admin"]),
  updateCategory
);

router.get("/", getCategories);

module.exports = router;
