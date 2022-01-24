const Joi = require('joi');
const mongoose = require('mongoose');
const productSchema = require('./productModule')

// const AddressSchema = mongoose.Schema({
//     city: String,
//     street: String,
//     houseNumber: String,
// });
  
//   const ContactInfoSchema = mongoose.Schema({
//     tel: [Number],
//     email: [String],
//     address: {
//         type: AddressSchema,
//         required: true,
//     },
// });


const Sale = mongoose.model('Sale', new mongoose.Schema({
    orderNo: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    timeStamp: {
        type: String,
        required: true
    },
    // products: {
    //     type: Array,
    //     required: true
    // },
    products: [{id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }, size : {type: String} , qty : {type : 'String'} , total : {type : 'String'}
    }],
    subtotal: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    }
}));

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
