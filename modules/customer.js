const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    qutyBought: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    district: {
      type: String,
    },
    province: {
      type: String,
    },
    dob: {
      type: String,
    },
  })
);

exports.Customer = Customer;
