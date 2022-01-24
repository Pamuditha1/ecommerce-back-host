const express = require('express');
const Joi = require('joi');
const router = express.Router();

const {Supplier} = require('../modules/supplierModule')

router.get('/all',async function(req, res) {

    const suppliers = await Supplier.find({}, { name: 1, _id: 1 } )
    console.log(suppliers)
    res.status(200).send(suppliers)
});

module.exports = router;