const express = require('express');
const Joi = require('joi');
const router = express.Router();

const {Product} = require('../modules/productModule')

router.get('/',async function(req, res) {

    const products = await Product.find({}, 
        {   
            productNo: 1, 
            productName : 1 ,
            category : 1,
            sales : 1,
            salesCombinations : 1
        }        
    )

    res.status(200).send(products)
});

module.exports = router;

