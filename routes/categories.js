const express = require("express");
const router = express.Router();
const {
  addCategory,
  getCategories,
  updateCategory,
} = require("../controllers/categories");

router.post("/", addCategory);

router.put("/:id", updateCategory);

router.get("/", getCategories);

module.exports = router;
