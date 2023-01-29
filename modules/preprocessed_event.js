const mongoose = require("mongoose");

const PreprocessedEvent = mongoose.model(
  "preprocessed_event",
  new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isLoggedUser: {
      type: Number,
      required: true,
    },
    isDiscounted: {
      type: Number,
      required: true,
    },
    userAgeGroup: {
      type: String,
    },
    season: {
      type: String,
      required: true,
    },

    isHovered: {
      type: Number,
      default: 0,
    },
    isViewed: {
      type: Number,
      default: 0,
    },
    isAddedToWishlist: {
      type: Number,
      default: 0,
    },
    isAddedToCart: {
      type: Number,
      default: 0,
    },
    isPurchased: {
      type: Number,
      default: 0,
    },

    hoveredDuration: {
      type: Number,
      default: 0,
    },
    viewedDuration: {
      type: Number,
      default: 0,
    },

    hoveredTimestamp: {
      type: Date,
    },
    viewedTimestamp: {
      type: Date,
    },
    addedToWishlistTimestamp: {
      type: Date,
    },
    addedToCartTimestamp: {
      type: Date,
    },
    purchasedTimestamp: {
      type: Date,
    },

    hoveredDate: {
      type: String,
    },
    viewedDate: {
      type: String,
    },
    addedToWishlistDate: {
      type: String,
    },
    addedToCartDate: {
      type: String,
    },
    purchasedDate: {
      type: String,
    },

    hoveredTime: {
      type: String,
    },
    viewedTime: {
      type: String,
    },
    addedToWishlistTime: {
      type: String,
    },
    addedToCartTime: {
      type: String,
    },
    purchasedTime: {
      type: String,
    },

    hoveredTOD: {
      type: String,
    },
    viewedTOD: {
      type: String,
    },
    addedToWishlistTOD: {
      type: String,
    },
    addedToCartTOD: {
      type: String,
    },
    purchasedTOD: {
      type: String,
    },

    hoveredBrowser: {
      type: String,
    },
    viewedBrowser: {
      type: String,
    },
    addedToWishlistBrowser: {
      type: String,
    },
    addedToCartBrowser: {
      type: String,
    },
    purchasedBrowser: {
      type: String,
    },

    hoveredDevice: {
      type: String,
    },
    viewedDevice: {
      type: String,
    },
    addedToWishlistDevice: {
      type: String,
    },
    addedToCartDevice: {
      type: String,
    },
    purchasedDevice: {
      type: String,
    },

    hoveredMobile: {
      type: String,
    },
    viewedMobile: {
      type: String,
    },
    addedToWishlistMobile: {
      type: String,
    },
    addedToCartMobile: {
      type: String,
    },
    purchasedMobile: {
      type: String,
    },

    hoveredOs: {
      type: String,
    },
    viewedOs: {
      type: String,
    },
    addedToWishlistOs: {
      type: String,
    },
    addedToCartOs: {
      type: String,
    },
    purchasedOs: {
      type: String,
    },

    hoveredIp: {
      type: String,
    },
    viewedIp: {
      type: String,
    },
    addedToWishlistIp: {
      type: String,
    },
    addedToCartIp: {
      type: String,
    },
    purchasedIp: {
      type: String,
    },

    hoveredLocation: {
      type: String,
    },
    viewedLocation: {
      type: String,
    },
    addedToWishlistLocation: {
      type: String,
    },
    addedToCartLocation: {
      type: String,
    },
    purchasedLocation: {
      type: String,
    },
  })
);

exports.PreprocessedEvent = PreprocessedEvent;
