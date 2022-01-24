const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('../envVariables')

const {Customer} = require('../modules/customerModule')


router.post('/', async (req, res) => {
    console.log(req.body)
    let customer = await Customer.findOne({ email: req.body.email});
    if(customer) return res.status(400).send('Customer Already Registered.')

    let newCustomer = new Customer({
        username: req.body.name ,
        email: req.body.email ,
        contactNo: req.body.contact ,
        address: req.body.address ,
        password: req.body.password ,
        type: 'Customer',
        qutyBought: req.body.qutyBought,
        district: req.body.district,
        province : req.body.province,
        dob : req.body.dob
    });
    const salt = await bcrypt.genSalt(10)
    newCustomer.password = await bcrypt.hash(newCustomer.password, salt)

    await newCustomer.save();
    const token = jwt.sign({_id : newCustomer._id, type: newCustomer.type, name: newCustomer.username}, env.jewtKey)
    res.status(200)
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .send('Successfully Registered the Customer');

    return
    
});



module.exports = router;

