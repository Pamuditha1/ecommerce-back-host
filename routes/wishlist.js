const express = require("express");
const router = express.Router();

const {
  getWishProduct,
  updateWishlist,
} = require("../controllers/wishlist.js");

router.post("/", updateWishlist);

router.get("/:id", getWishProduct);

module.exports = router;
