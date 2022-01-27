const express = require("express");
const Joi = require("joi");
const router = express.Router();

const { Product } = require("../modules/products");

router.post("/", async (req, res) => {
  //select item

  let product = await Product.findById(req.body.id);

  //set discount

  product.discount = req.body.discount;
  if (product.discount.includes("%")) {
    product.discountedPrice =
      parseInt(product.price) -
      (parseInt(product.price) * parseInt(req.body.discount.slice(0, -1))) /
        100;
  } else {
    product.discountedPrice =
      parseInt(product.price) - parseInt(req.body.discount);
  }
  await product.save();

  if (req.body.discount == 0) {
    return res.status(200).send(`Discount Removed.`);
  }
  res.status(200).send(`Discount Added.`);

  return;
});

module.exports = router;
