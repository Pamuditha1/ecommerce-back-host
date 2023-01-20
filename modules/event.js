const mongoose = require("mongoose");

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    timestamp: {
      type: Date,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    timeOfTheDay: {
      type: String,
      required: true,
    },
    season: {
      type: String,
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
      default: null,
    },
    isLoggedUser: {
      type: Boolean,
      required: true,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    event: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    ip: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    device: {
      type: String,
      required: true,
    },
    os: {
      type: String,
    },
    browser: {
      type: String,
    },
    mobile: {
      type: String,
    },
  })
);

exports.Event = Event;
