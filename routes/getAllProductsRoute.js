const express = require('express');
const Joi = require('joi');
const router = express.Router();

const {Product} = require('../modules/productModule')

// let popular = []
// let popularIds = []

router.get('/',async function(req, res) {

    //get available products
    const products = await Product.find({})
    let availableProducts = products.filter(p => {
        if(p.totalQuantity > 0) return true
    })

    //filter most popular
    let popularF = availableProducts.filter(p => {
        if(p.sales > 0) return true
    })
    popularF.sort( compare )
    let popular = popularF.slice(0,2)
    let popularIds = popular.map(p => p._id)

    //set popular
    availableProducts.forEach(p => {
        if(popularIds.includes(p._id)) return p.popular = true
    })
    
    res.status(200).send(availableProducts)
});

router.get('/discounted',async function(req, res) {

    //In stock items
    const products = await Product.find({})
    let availableProducts = products.filter(p => {
        if(p.totalQuantity > 0) return true
    })

    //filter discounted
    let discounted = availableProducts.filter(p => {
        if(p.discount && p.discount!=0) return true
    })
    let discounted5 = discounted.splice(0, 5)

    //filter most popular
    let popularF = products.filter(p => {
        if(p.sales > 0) return true
    })
    popularF.sort( compare )
    let popular = popularF.slice(0,5)
    let popularIds = popular.map(p => p._id)

    //set popular
    discounted5.forEach(p => {
        if(popularIds.includes(p._id)) return p.popular = true
    })
    
    
    // console.log("Discounted", limited)
    // // console.log("availableProducts", availableProducts)
    res.status(200).send(discounted5)
});

router.get('/popular',async function(req, res) {

    const products = await Product.find({})
    let availableProducts = products.filter(p => {
        if(p.totalQuantity > 0) return true
    })
    let popular = availableProducts.filter(p => {
        if(p.sales > 0) return true
    })
    popular.sort( compare )
    let popular5 = popular.slice(0,5)
    popular5.forEach(p => p.popular = true)
    // console.log("Popular", filtered)
    // console.log("availableProducts", availableProducts)
    res.status(200).send(popular5)
});

function compare( a, b ) {
    if ( parseInt(a.sales) < parseInt(b.sales) ){
      return 1;
    }
    if ( parseInt(a.sales) > parseInt(b.sales) ){
      return -1;
    }
    return 0; 
}

module.exports = router;

