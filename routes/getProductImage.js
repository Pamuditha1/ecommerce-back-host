var express = require('express');
const router = express.Router();
const path = require('path');

const {Product} = require('../modules/productModule')

router.get('/:proNo', async function (req, res, next) {

    if(req.params.proNo) {

        const imageName = await Product.findOne({productNo: req.params.proNo}, {image: 1})

        // console.log(typeof imageName.image)
        if(imageName.image) {
            var options = {
                root: path.join(appRoot + '/productImages'),
                dotfiles: 'deny',
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true
                } 
            }

            res.sendFile(imageName.image, options, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    // console.log('Sent:', imageName.image)
                }
            }) 
        }   
    }
})

module.exports = router;