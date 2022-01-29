const mongoose = require("mongoose");

const Supplier = mongoose.model(
  "Supplier",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    contactMobile: {
      type: String,
      required: true,
    },
    contactOfficial: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
  })
);

exports.Supplier = Supplier;
