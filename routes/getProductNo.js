var express = require('express');
const router = express.Router();
const path = require('path');

const {Product} = require('../modules/productModule')

router.get('/',async function(req, res) {

    //get available products
    const product = await Product.find().sort({_id: -1}).limit(1).select('productNo');
    let newNo
    if(product.length != 0) {
        let proNo = product[0].productNo.substring(1);
        newNo= parseInt(proNo) + 1
    }
    else {
        newNo = 1
    }
    
    console.log('Last Product', newNo)
    res.status(200).send(newNo.toString())
});

module.exports = router;