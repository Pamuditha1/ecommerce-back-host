const Joi = require("joi");
const mongoose = require("mongoose");

const Sizes = new mongoose.Schema({
  size: String,
  qty: Number,
});

const productSchema = new mongoose.Schema({
  productNo: {
    type: String,
    required: true,
  },
  barcode: {
    type: Number,
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  image: {
    type: String,
    default: "https://en.pimg.jp/052/988/018/1/52988018.jpg",
  },
  material: {
    type: String,
  },
  color: {
    type: String,
  },
  bprice: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  sales: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
  },
  rquantity: {
    type: Number,
    default: 0,
  },
  discount: {
    type: String,
    default: "0",
  },
  discountedPrice: {
    type: Number,
  },
  profit: {
    type: Number,
    default: 0,
  },
  profitP: {
    type: Number,
    default: 0,
  },
  combinations: [Sizes],
  salesCombinations: [Sizes],
  visible: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;
exports.productSchema = productSchema;
