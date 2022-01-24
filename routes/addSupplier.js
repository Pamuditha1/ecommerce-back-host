const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('../envVariables')

const {Supplier} = require('../modules/supplierModule')


router.post('/', async (req, res) => {

    // console.log(req.body)
    // res.send('Received')

    // const {error} = validateCustomer(req.body);
    // if(error) return res.status(400).send(error.details[0].message);
    
    let supplier = await Supplier.findOne({ email: req.body.email});
    if(supplier) return res.status(400).send('Supplier Already Registered.')

    let newSupplier = new Supplier({
        name: req.body.name ,
        email: req.body.email ,
        nic: req.body.nic ,
        contactMobile: req.body.contact1 ,
        contactOfficial: req.body.contact2 ,
        address: req.body.address
    });

    await newSupplier.save();
    res.status(200).send('Successfully Registered the Supplier');

    return
    
});



module.exports = router;

