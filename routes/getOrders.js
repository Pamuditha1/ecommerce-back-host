const express = require('express');
const Joi = require('joi');
const router = express.Router();

const {Sale} = require('../modules/salesModule')
const {Customer} = require('../modules/customerModule')

router.get('/count',async function(req, res) {

    const orders = await Sale.find({status: 'Ordered'})

    // console.log(orders.length)
    res.status(200).send(`${orders.length}`)
})

router.get('/',async function(req, res) {

    const orders = await Sale.find({})
    .sort({timeStamp: 'desc'})
    .populate('customer', '-_id -password')
    .populate({
        model : 'Product',
        path : 'products.id'
    })

    // console.log(orders)
    res.status(200).send(orders)

    // setCustomers(orders)
    // .then((orders) => {
    //     console.log(`orders`, orders)
    // })

    // res.status(200).send(orders)

    let odersWCustomers = []

    // asyncForEach(orders, async (o) => {
    //     let customer = await Customer.findById(o.customerID).select('-password');
    //     o.customer = customer
    // })
    // .then(() => {
    //     console.log(orders)
    // })

    // async function asyncForEach(array, callback) {
    //     for (let index = 0; index < array.length; index++) {
    //       await callback(array[index], index, array);
    //     }
    //   }

    // Sale.find({})
    // .then((orders) => {
    //     orders.forEach(o => {

    //         Customer.findById(o.customerID).select('-password')
    //         .then(c => {
    //             o.customer = c
    //         })
    //         .then(c => {
                
    //            odersWCustomers.push(o)          
    //         })
    //         .then(c => {
    //             return  odersWCustomers
    //         })
            
    //     })
        
    // })
    // .then((odersWCustomers) => {
    //     res.status(200).send(odersWCustomers[0])
    // })   
});

// function setCustomers(orders) {

//     return new Promise((resolve, reject) => {
        
//         orders.forEach(o => {

//             Customer.findById(o.customerID).select('-password')
//             .then(c => {
//                 o.customer = c
//             })        
//         })
//         resolve(orders)
//     })
// }

module.exports = router;

