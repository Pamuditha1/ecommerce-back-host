const mongoose = require("mongoose");

const Sale = mongoose.model(
  "Sale",
  new mongoose.Schema({
    orderNo: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: String,
      required: true,
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        size: { type: String },
        qty: { type: Number },
        total: { type: Number },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  })
);

// function validateCustomer(customer) {
//     const schema = {
//         name : Joi.string().min(5).required(),
//         phone : Joi.string().min(5).required(),
//         isGold: Joi.boolean()
//     };
//     return Joi.validate(customer, schema);
// }

exports.Sale = Sale;
// exports.validateCustomer = validateCustomer;
