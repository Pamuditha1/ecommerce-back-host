const Joi = require('joi');
const mongoose = require('mongoose');

const Supplier = mongoose.model('Supplier', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactMobile: {
        type: String,
        required: true
    },
    contactOfficial: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
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

exports.Supplier = Supplier;
// exports.validateCustomer = validateCustomer;
