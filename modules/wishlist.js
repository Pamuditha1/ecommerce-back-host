const mongoose = require("mongoose");

const Wishlist = mongoose.model(
  "Wishlist",
  new mongoose.Schema({
    timestamp: {
      type: Date,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

exports.Wishlist = Wishlist;
