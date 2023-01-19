const express = require("express");
const router = express.Router();

const {
  addWishProduct,
  getWishProduct,
} = require("../controllers/wishlist.js");

router.post("/", addWishProduct);

router.get("/:id", getWishProduct);

module.exports = router;
