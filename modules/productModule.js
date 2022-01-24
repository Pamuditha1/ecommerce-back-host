const Joi = require('joi');
const mongoose = require('mongoose');

const Sizes = new mongoose.Schema({
    size : String,
    qty: Number
})

const productSchema = new mongoose.Schema({
    productNo: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    supplierID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier"
    },
    image: {
        type: String
    },
    material: {
        type: String
    },
    color: {
        type: String
    },
    bprice: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sales: {
        type: String
    },
    totalQuantity: {
        type: String
    },
    rquantity: {
        type: String
    },
    discount: {
        type: String
    },
    discountedPrice: {
        type: String
    },
    popular: {
        type: String
    },
    profit: {
        type: String
    },
    profitP: {
        type: String
    },
    combinations: [Sizes],
    salesCombinations: [Sizes],
    barcode: {
        type: String
    },
})


const Product = mongoose.model('Product', productSchema);

// function validateCustomer(customer) {
//     const schema = {
//         name : Joi.string().min(5).required(),
//         phone : Joi.string().min(5).required(),
//         isGold: Joi.boolean()
//     };
//     return Joi.validate(customer, schema);
// }

exports.Product = Product;
exports.productSchema = productSchema
// exports.validateCustomer = validateCustomer;
